import express, { Request, Response, NextFunction } from 'express';
import { ChatService } from '../services/chatService.js';
import { authMiddleware } from '../middleware/auth.js';

// Define interface to extend Express Request
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    // Specify known properties instead of using index signature
    email?: string;
    name?: string;
    role?: string;
  };
}

const router = express.Router();

// Wrapper function to handle async route handlers
const asyncHandler = (fn: (req: AuthenticatedRequest, res: Response, next?: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req as AuthenticatedRequest, res, next)).catch(next);
  };
};

router.use(authMiddleware);

router.get('/history', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Check if user exists in the request
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const page = parseInt(req.query.page as string) || 1;
    const history = await ChatService.getChatHistory(req.user.id, page);
    res.json(history);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error retrieving chat history:', errorMessage);
    res.status(500).json({ error: 'Failed to retrieve chat history' });
  }
}));

router.post('/message', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Check if user exists in the request
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const { role, content } = req.body;
    const message = await ChatService.addMessage(req.user.id, role, content);
    res.json(message);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error adding message:', errorMessage);
    res.status(400).json({ error: 'Invalid message data' });
  }
}));

router.delete('/history', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Check if user exists in the request
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const result = await ChatService.clearChatHistory(req.user.id);
    res.json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error clearing chat history:', errorMessage);
    res.status(500).json({ error: 'Failed to clear chat history' });
  }
}));

export default router;