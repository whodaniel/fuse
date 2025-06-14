/**
 * WebSocket connection manager
 * Handles WebSocket connections to the VS Code extension
 */
import { EventEmitter } from 'events';
// WebSocketEventType, WebSocketEventListener, WebSocketEventListenerOptions removed as they are unused
import { compressString, decompressArrayBufferToString } from './compression'; // Import from TypeScript file
import { MessageType, MessageSource, BaseMessage, ConnectionStatusMessage } from '../shared-protocol'; // Added BaseMessage, ConnectionStatusMessage
import { SecurityManager } from './security';
 
// Placeholder for token retrieval
const getAuthToken = (): string | null => {
  // In a real extension, this would retrieve the token from secure storage
  // For now, let's use a mock token
  // Try to get it from localStorage, or default to a mock token
  if (typeof localStorage !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) return token;
  }
  // Return a default mock token if not found or localStorage is unavailable
  return 'mock-auth-token-from-client';
};

interface WebSocketManagerOptions {
  reconnectAttempts?: number;
  reconnectDelay?: number;
  debug?: boolean;
  useCompression?: boolean;
  logger?: any;
  securityManager?: SecurityManager;
  heartbeatInterval?: number;
  connectionTimeout?: number;
  maxRetryDelay?: number;
}

interface ConnectionHealth {
  latency: number;
  lastHeartbeat: number;
  missedHeartbeats: number;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'disconnected';
}

export class WebSocketManager extends EventEmitter {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private heartbeatTimer: ReturnType<typeof setTimeout> | null = null;
  private connectionTimeout: ReturnType<typeof setTimeout> | null = null;
  private securityManager: SecurityManager | null = null;
  private connectionStartTime: number = 0;
  private health: ConnectionHealth = {
    latency: 0,
    lastHeartbeat: 0,
    missedHeartbeats: 0,
    connectionQuality: 'disconnected'
  };
  private state: {
    connected: boolean;
    reconnecting: boolean;
    lastError: Error | null;
    authenticating: boolean;
    connectionAttempts: number;
    lastConnectTime: number;
    retriesExhausted: boolean; // New state property
  } = {
    connected: false,
    reconnecting: false,
    lastError: null,
    authenticating: false,
    connectionAttempts: 0,
    lastConnectTime: 0,
    retriesExhausted: false, // Initialize
  };

  /**
   * Create a new WebSocketManager
   * @param url - WebSocket URL
   * @param options - WebSocketManager options
   */
  constructor(
    private readonly url: string,
    private readonly options: WebSocketManagerOptions = {}
  ) {
    super();
    this.options = {
      reconnectAttempts: 5,
      reconnectDelay: 1000,
      debug: false,
      useCompression: false,
      heartbeatInterval: 30000, // 30 seconds
      connectionTimeout: 10000, // 10 seconds
      maxRetryDelay: 30000, // 30 seconds max
      ...options
    };

    // Set security manager if provided
    this.securityManager = options.securityManager || null;
  }

  /**
   * Get current connection state
   * @returns Current state object
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Add an event listener - Bridge method for compatibility with EventTarget style
   * @param event - Event name
   * @param listener - Event listener
   * @param options - Event listener options
   * @returns this instance for chaining
   */
  addListener(event: string, listener: (...args: any[]) => void): this {
    return super.addListener(event, listener);
  }

  /**
   * Add an event listener (EventTarget-style compatibility)
   * @param event - Event name
   * @param listener - Event listener
   * @param options - Event listener options
   */
  addEventListener(event: string, listener: EventListener | ((...args: any[]) => void)): this {
    return this.addListener(event, listener as (...args: any[]) => void);
  }

  /**
   * Remove an event listener (EventTarget-style compatibility)
   * @param event - Event name
   * @param listener - Event listener
   */
  removeEventListener(event: string, listener: EventListener | ((...args: any[]) => void)): this {
    return this.removeListener(event, listener as (...args: any[]) => void);
  }

  /**
   * Connect to the WebSocket server
   * @returns Promise that resolves to true if connected successfully
   */
  async connect(): Promise<boolean> {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return true;
    }
    // Reset flags before attempting a new connection sequence
    this.state.retriesExhausted = false;
    this.reconnectAttempts = 0; // Reset attempts for a fresh connect call

    return new Promise((resolve) => {
      try {
        let urlWithToken = this.url;
        const token = getAuthToken();
        if (token) {
          const separator = this.url.includes('?') ? '&' : '?';
          urlWithToken = `${this.url}${separator}token=${encodeURIComponent(token)}`;
          this.log('Connecting with token via query parameter.');
        } else {
          this.log('No auth token found, connecting without token.');
        }
        this.ws = new WebSocket(urlWithToken);
        this.ws.binaryType = "arraybuffer"; // Ensure binary messages are received as ArrayBuffer

        this.ws.onopen = () => {
          this.log('Connected to WebSocket server');
          this.reconnectAttempts = 0; // Reset on successful open
          this.state.connected = true;
          this.state.reconnecting = false;
          this.state.retriesExhausted = false; // Reset on successful open
          this.emit('open');
          resolve(true);
        };

        this.ws.onmessage = async (event) => {
          try {
            let processedData: string; // This will hold the string data after potential decompression

            if (event.data instanceof ArrayBuffer) {
              this.log('Received binary message (ArrayBuffer)');
              if (this.options.useCompression) {
                try {
                  processedData = decompressArrayBufferToString(event.data);
                  this.log(`Decompressed binary message. Original size: ${event.data.byteLength}, Decompressed size: ${processedData.length}`);
                } catch (compressionError) {
                  this.log('Failed to decompress ArrayBuffer, attempting to process as uncompressed string. Error:', compressionError instanceof Error ? compressionError.message : compressionError);
                  // Fallback: try to convert ArrayBuffer to string directly (assuming it might be uncompressed UTF-8 text)
                  try {
                    processedData = new TextDecoder().decode(event.data);
                  } catch (decodeError) {
                     this.log('Failed to decode ArrayBuffer as UTF-8 string after decompression failure. Error:', decodeError);
                     this.emit('error', new Error('Failed to process binary message: decompression and decode failed.'));
                     return;
                  }
                }
              } else {
                // Not using compression, but received ArrayBuffer. Try to decode as UTF-8 string.
                try {
                    processedData = new TextDecoder().decode(event.data);
                    this.log('Received uncompressed binary message, decoded to string.');
                } catch (decodeError) {
                    this.log('Failed to decode ArrayBuffer as UTF-8 string (compression disabled). Error:', decodeError);
                    this.emit('error', new Error('Failed to process binary message: decode failed.'));
                    return;
                }
              }
            } else if (typeof event.data === 'string') {
              this.log('Received string message.');
              // If compression is enabled, but we received a string, it might be an uncompressed message (e.g. error from server before compression)
              // or an older client/server not yet using binary compression.
              // For now, we assume strings are not compressed if useCompression is on and server sends binary.
              // If server *always* compresses (even text to binary), this branch might need adjustment
              // or the server should send a flag indicating compression status.
              // Let's assume if useCompression is true, we expect binary. If we get string, it's likely uncompressed.
              processedData = event.data;
              if (this.options.useCompression) {
                // If compression is on, and we receive a string, it's likely an uncompressed message
                // (e.g., an error from the server sent before compression could occur, or a non-standard message).
                // Pako's inflate expects a byte array. Directly trying to decompress a raw string
                // like this is usually incorrect unless it's an encoded representation (e.g. base64)
                // of compressed binary data.
                // Given our server compresses encrypted strings to binary, a string received here
                // when compression is expected should be treated as uncompressed.
                this.log('Received string message while compression is enabled. Treating as uncompressed.');
              }
              // No actual decompression attempt here for string `processedData` as it's not the expected compressed format.
            } else {
              this.log('Received message of unknown type:', typeof event.data);
              this.emit('error', new Error('Received message of unknown type'));
              return;
            }

            // Decrypt the message if security manager is available
            let decryptedData = processedData;
            if (this.securityManager) {
              try {
                const decrypted = await this.securityManager.decryptMessage(processedData); // processData is now always string
                if (decrypted !== null) {
                  decryptedData = decrypted;
                  this.log('Message decrypted successfully');
                } else {
                  this.log('Decryption failed, using original (potentially decompressed) message');
                }
              } catch (decryptionError) {
                this.log('Failed to decrypt message, using original (potentially decompressed) data. Error:', decryptionError instanceof Error ? decryptionError.message : decryptionError);
              }
            }

            // Try to parse as JSON
            let parsedMessage: any;
            try {
              parsedMessage = JSON.parse(decryptedData);
            } catch (parseError) {
              this.log('Failed to parse message data as JSON, treating as plain string. Error:', parseError instanceof Error ? parseError.message : parseError, 'Data:', decryptedData);
              parsedMessage = decryptedData; // Treat as plain string if not JSON
            }
            
            // Handle connection status messages
            if (parsedMessage && parsedMessage.type === MessageType.CONNECTION_STATUS) {
              this.log('Received connection status:', parsedMessage.payload.status);
              this.handleConnectionStatus(parsedMessage as ConnectionStatusMessage);
            }

            // Add heartbeat handling
            if (parsedMessage && parsedMessage.type === MessageType.HEARTBEAT) {
              this.log('Received heartbeat from server');
              const response: Partial<BaseMessage> = {
                id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
                source: MessageSource.CHROME_EXTENSION, // Corrected source
                timestamp: Date.now(),
                type: MessageType.HEARTBEAT,
              };
              await this.send(response); // Send will handle compression/encryption
            }

            this.emit('message', parsedMessage);
          } catch (error) {
            if (error instanceof Error) {
              this.log('Failed to process message:', error.message, error.stack);
            } else {
              this.log('Failed to process message: Invalid message format or unknown error', error);
            }
            this.emit('error', new Error('Invalid message format or processing error'));
          }
        };

        this.ws.onclose = (event) => {
          this.log(`WebSocket closed: ${event.code} ${event.reason}`);
          this.state.connected = false;
          this.state.authenticating = false; // Also reset authenticating

          if (!event.wasClean && this.reconnectAttempts < this.options.reconnectAttempts!) {
            this.scheduleReconnect();
          } else if (!event.wasClean && this.reconnectAttempts >= this.options.reconnectAttempts!) {
            this.log(`Max reconnect attempts reached (${this.reconnectAttempts}/${this.options.reconnectAttempts}). Not rescheduling.`);
            this.state.reconnecting = false;
            this.state.retriesExhausted = true; // Set the new flag
            this.emit('retries_exhausted', { code: event.code, reason: event.reason }); // Emit a specific event
          } else {
            // Clean close or reconnects not attempted/applicable
            this.state.reconnecting = false;
          }
          this.emit('close', event); // Still emit the general 'close' event
          resolve(false); // From the connect() promise
        };

        this.ws.onerror = (error) => {
          this.log('WebSocket error:', error);
          this.state.lastError = error instanceof Error ? error : new Error('WebSocket error');
          this.emit('error', error);
          resolve(false);
        };
      } catch (error) {
        this.log('Failed to create WebSocket:', error);
        this.state.lastError = error instanceof Error ? error : new Error('WebSocket error');
        resolve(false);
      }
    });
  }

  /**
   * Set the security manager
   * @param securityManager - Security manager to use
   */
  setSecurityManager(securityManager: SecurityManager): void {
    this.securityManager = securityManager;
  }

  /**
   * Send a message to the WebSocket server
   * @param data - Message data to send (BaseMessage or any object)
   * @returns boolean indicating if the message was sent successfully
   */
  async send(data: BaseMessage | any): Promise<boolean> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.log('Cannot send message: WebSocket not connected');
      return false;
    }

    try {
      const jsonMessage = typeof data === 'string' ? data : JSON.stringify(data);
      let messageToSend: string | ArrayBuffer = jsonMessage; // Default to jsonMessage if no encryption/compression

      if (this.securityManager) {
        if (!(await this.securityManager.isKeyReady())) {
          this.log('Error: Encryption key is not available. Message will not be sent.');
          this.emit('error', new Error('Encryption key unavailable; message not sent.')); // Generic error
          this.emit('encryption_unavailable', { message: 'Encryption key unavailable; message not sent.'}); // Specific event
          return false;
        }

        const encrypted = await this.securityManager.encryptMessage(jsonMessage);
        if (encrypted === null) {
          this.log('Error: Message encryption failed. Message will not be sent.');
          this.emit('error', new Error('Message encryption failed; message not sent.')); // Generic error
          this.emit('encryption_error', { message: 'Message encryption failed; message not sent.' }); // Specific event
          return false;
        }
        this.log('Message encrypted successfully before potential compression.');
        messageToSend = encrypted;
      }

      // Compression logic (operates on messageToSend, which is either jsonMessage or encrypted string)
      if (this.options.useCompression && typeof messageToSend === 'string') {
        try {
          const compressedData = compressString(messageToSend as string); // Cast is safe here
          messageToSend = compressedData.buffer.slice(compressedData.byteOffset, compressedData.byteOffset + compressedData.byteLength);
          this.log(`Message compressed successfully. Original (encrypted/plain) length: ${(messageToSend as string).length}, Compressed length: ${messageToSend.byteLength}`);
        } catch (compressionError) {
          this.log('Failed to compress message, sending uncompressed. Error:', compressionError instanceof Error ? compressionError.message : compressionError);
          // messageToSend remains the string (encrypted or plain)
        }
      } else if (this.options.useCompression && !(typeof messageToSend === 'string')) {
          this.log('Compression enabled, but message is not a string (already binary?). Skipping compression.');
      } else {
        this.log('Compression not enabled or message not suitable for string compression.');
      }
      
      this.ws.send(messageToSend);
      return true;
    } catch (error) {
      if (error instanceof Error) {
        this.log('Failed to send message:', error.message);
      } else {
        this.log('Failed to send message: Unknown error');
      }
      this.emit('error', error); // Emit error if any part of try block fails
      return false;
    }
  }

  /**
   * Disconnect from the WebSocket server
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close(1000, 'Client disconnecting');
      this.ws = null;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  /**
   * Schedule a reconnect attempt
   */
  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    // Check for window to support both browser and service worker environments
    const setTimeoutFn = typeof window !== 'undefined' ? window.setTimeout :
                         typeof setTimeout !== 'undefined' ? setTimeout : null;

    if (setTimeoutFn) {
      this.state.reconnecting = true;
      // Emit reconnecting event for UI feedback
      this.emit('reconnecting', {
        attempt: this.reconnectAttempts + 1,
        maxAttempts: this.options.reconnectAttempts
      });

      this.reconnectTimer = setTimeoutFn(() => {
        this.reconnectAttempts++;
        this.log(`Reconnect attempt ${this.reconnectAttempts}`);
        this.connect();
      // Exponential backoff: delay * 2^attempt, capped at a max (e.g., 30s)
      }, Math.min((this.options.reconnectDelay || 1000) * Math.pow(2, this.reconnectAttempts), 30000));
    } else {
      this.log('Cannot schedule reconnect: setTimeout not available in this environment');

      // Even if we can't reconnect, we should notify UI
      this.emit('error', new Error('Cannot reconnect: setTimeout not available'));
    }
  }

  /**
   * Log a message to the console if debug is enabled
   * @param args - Arguments to log
   */
  private log(...args: any[]): void {
    if (this.options.debug) {
      console.log('[WebSocketManager]', ...args);
    }
  }

  /**
   * Check if the WebSocket is connected
   * @returns boolean indicating if connected
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Handle connection status messages
   * @param message - Connection status message
   */
  private handleConnectionStatus(message: ConnectionStatusMessage): void {
    const { status } = message.payload;

    // Update state based on status
    switch (status) {
      case 'connected':
        this.state.connected = true;
        this.state.reconnecting = false;
        this.state.authenticating = false;
        break;
      case 'disconnected':
        this.state.connected = false;
        this.state.reconnecting = false;
        this.state.authenticating = false;
        break;
      case 'connecting':
        this.state.connected = false;
        this.state.reconnecting = true;
        this.state.authenticating = false;
        break;
      case 'authenticating':
        this.state.connected = false;
        this.state.reconnecting = false;
        this.state.authenticating = true;
        break;
      case 'error':
        this.state.connected = false;
        this.state.reconnecting = false;
        this.state.authenticating = false;
        this.state.lastError = new Error(message.payload.message || 'Connection error from server');
        break;
    }

    // Emit connection status event
    this.emit('connectionStatus', message.payload);
  }

  /**
   * Set debug mode
   * @param enabled - Whether debug mode is enabled
   */
  public setDebug(enabled: boolean): void {
    this.options.debug = enabled;
    this.log(`Debug mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Get connection status
   * @returns Connection status message payload
   */
  getConnectionStatus(): ConnectionStatusMessage['payload'] & { retriesExhausted?: boolean } {
    let status: ConnectionStatusMessage['payload']['status'];

    if (this.state.authenticating) {
      status = 'authenticating';
    } else if (this.state.connected) {
      status = 'connected';
    } else if (this.state.reconnecting) {
      status = 'connecting';
    } else if (this.state.lastError) {
      status = 'error';
    } else {
      status = 'disconnected';
    }

    return {
      status,
      message: this.state.lastError?.message,
      retriesExhausted: this.state.retriesExhausted // Add the new flag
    };
  }
}

/**
 * Usage:
 * // Option 1: Singleton instance
 * import { webSocketManager } from './websocket-manager';
 *
 * // Option 2: Create your own instance
 * import { WebSocketManager } from './websocket-manager';
 * const myManager = new WebSocketManager();
 */
export const webSocketManager = new WebSocketManager();
