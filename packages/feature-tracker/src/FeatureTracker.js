"use strict";
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureTracker = void 0;
const common_1 = require("@nestjs/common");
const types_js_1 = require("./types.js");
let FeatureTracker = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var FeatureTracker = _classThis = class {
        constructor() {
            this.features = new Map();
        }
        createFeature(featureId, name, description, dependencies = []) {
            const newFeature = {
                featureId,
                name,
                description,
                currentStage: types_js_1.FeatureStage.ANALYSIS,
                metrics: {
                    linesOfCode: 0,
                    filesModified: [],
                    newFiles: [],
                    tokensUsed: 0,
                    testCoverage: 0
                },
                qualitativeAssessment: {
                    challenges: [],
                    risks: [],
                    notes: '',
                    lastUpdated: new Date()
                },
                stageHistory: [],
                dependencies,
                startTime: new Date(),
                lastUpdated: new Date(),
                completionPercentage: 0
            };
            this.features.set(featureId, newFeature);
            return newFeature;
        }
        getFeature(featureId) {
            const feature = this.features.get(featureId);
            if (!feature) {
                throw new Error(`Feature ${featureId} not found`);
            }
            return feature;
        }
        updateStage(featureId, newStage) {
            const feature = this.getFeature(featureId);
            const stageTransition = {
                from: feature.currentStage,
                to: newStage,
                timestamp: new Date(),
                duration: new Date().getTime() - feature.lastUpdated.getTime()
            };
            const updatedFeature = {
                ...feature,
                currentStage: newStage,
                stageHistory: [...feature.stageHistory, stageTransition],
                lastUpdated: new Date(),
                completionPercentage: this.calculateCompletionPercentage(newStage)
            };
            this.features.set(featureId, updatedFeature);
            return updatedFeature;
        }
        calculateCompletionPercentage(stage) {
            const stages = Object.values(types_js_1.FeatureStage);
            const currentIndex = stages.indexOf(stage);
            return Math.round((currentIndex / (stages.length - 1)) * 100);
        }
        updateMetrics(featureId, metrics) {
            const feature = this.getFeature(featureId);
            const updatedFeature = {
                ...feature,
                metrics: {
                    ...feature.metrics,
                    ...metrics
                },
                lastUpdated: new Date()
            };
            this.features.set(featureId, updatedFeature);
            return updatedFeature;
        }
        updateQualitativeAssessment(featureId, assessment) {
            const feature = this.getFeature(featureId);
            const updatedFeature = {
                ...feature,
                qualitativeAssessment: {
                    ...feature.qualitativeAssessment,
                    ...assessment,
                    lastUpdated: new Date()
                },
                lastUpdated: new Date()
            };
            this.features.set(featureId, updatedFeature);
            return updatedFeature;
        }
        getProgressSummary(featureId) {
            const feature = this.getFeature(featureId);
            return `Feature ${feature.name} is in ${feature.currentStage} stage with ${feature.completionPercentage}% completion.`;
        }
    };
    __setFunctionName(_classThis, "FeatureTracker");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FeatureTracker = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FeatureTracker = _classThis;
})();
exports.FeatureTracker = FeatureTracker;
