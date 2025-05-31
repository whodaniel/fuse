var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '../guards/authGuard.js';
let HealthController = (() => {
    let _classDecorators = [ApiTags('Health'), Controller('health')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getBasicHealth_decorators;
    let _getDetailedHealth_decorators;
    var HealthController = _classThis = class {
        constructor(healthService) {
            this.healthService = (__runInitializers(this, _instanceExtraInitializers), healthService);
        }
        async getBasicHealth() {
            const health = await this.healthService.getStatus();
            return {
                status: health.status,
                timestamp: health.timestamp
            };
        }
        async getDetailedHealth() {
            return this.healthService.getStatus();
        }
    };
    __setFunctionName(_classThis, "HealthController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getBasicHealth_decorators = [Get(), ApiOperation({ summary: 'Get basic health status' }), ApiResponse({ status: 200, description: 'Service is healthy' }), ApiResponse({ status: 503, description: 'Service is unhealthy' })];
        _getDetailedHealth_decorators = [Get('/detailed'), UseGuards(AuthGuard), ApiOperation({ summary: 'Get detailed health status' }), ApiResponse({
                status: 200,
                description: 'Detailed health information',
                type: 'object',
                schema: {
                    properties: {
                        status: {
                            type: 'string',
                            enum: ['healthy', 'degraded', 'unhealthy']
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time'
                        },
                        components: {
                            type: 'object',
                            properties: {
                                database: {
                                    type: 'object',
                                    properties: {
                                        status: { type: 'string' },
                                        latency: { type: 'number' },
                                        error: { type: 'string' }
                                    }
                                },
                                redis: {
                                    type: 'object',
                                    properties: {
                                        status: { type: 'string' },
                                        latency: { type: 'number' },
                                        error: { type: 'string' }
                                    }
                                },
                                cache: {
                                    type: 'object',
                                    properties: {
                                        status: { type: 'string' },
                                        stats: {
                                            type: 'object',
                                            properties: {
                                                hits: { type: 'number' },
                                                misses: { type: 'number' },
                                                keys: { type: 'number' },
                                                memoryUsed: { type: 'number' }
                                            }
                                        },
                                        error: { type: 'string' }
                                    }
                                },
                                system: {
                                    type: 'object',
                                    properties: {
                                        status: { type: 'string' },
                                        uptime: { type: 'number' },
                                        memory: {
                                            type: 'object',
                                            properties: {
                                                used: { type: 'number' },
                                                total: { type: 'number' },
                                                percentage: { type: 'number' }
                                            }
                                        },
                                        cpu: {
                                            type: 'object',
                                            properties: {
                                                usage: { type: 'number' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }), ApiResponse({ status: 401, description: 'Unauthorized' }), ApiResponse({ status: 503, description: 'Service is unhealthy' })];
        __esDecorate(_classThis, null, _getBasicHealth_decorators, { kind: "method", name: "getBasicHealth", static: false, private: false, access: { has: obj => "getBasicHealth" in obj, get: obj => obj.getBasicHealth }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getDetailedHealth_decorators, { kind: "method", name: "getDetailedHealth", static: false, private: false, access: { has: obj => "getDetailedHealth" in obj, get: obj => obj.getDetailedHealth }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        HealthController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return HealthController = _classThis;
})();
export { HealthController };
