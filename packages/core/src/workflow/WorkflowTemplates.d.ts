import { WorkflowTemplate } from '@the-new-fuse/types';
export declare const dependencyAnalysisTemplate: WorkflowTemplate;
export declare const securityAnalysisTemplate: WorkflowTemplate;
export declare const performanceAnalysisTemplate: WorkflowTemplate;
export declare const apiIntegrationTemplate: WorkflowTemplate;
export declare const dataFlowAnalysisTemplate: WorkflowTemplate;
export declare const validationWorkflow: WorkflowTemplate;
export declare const memoryAnalysisTemplate: WorkflowTemplate;
export declare const redundancyAnalysisTemplate: WorkflowTemplate;
export declare const accessibilityTemplate: WorkflowTemplate;
export declare const codeQualityTemplate: WorkflowTemplate;
export declare const documentationAnalysisTemplate: WorkflowTemplate;
export declare const accessibilityWorkflow: WorkflowTemplate;
export declare const analysisWorkflow: WorkflowTemplate;
export declare const processWorkflow: WorkflowTemplate;
export declare const analysisReportWorkflow: WorkflowTemplate;
export declare const complexWorkflow: WorkflowTemplate;
export declare const i18nWorkflow: WorkflowTemplate;
export declare const workflowTemplates: {
    readonly dependencyAnalysisTemplate: WorkflowTemplate;
    readonly redundancyAnalysisTemplate: WorkflowTemplate;
    readonly performanceAnalysisTemplate: WorkflowTemplate;
    readonly memoryAnalysisTemplate: WorkflowTemplate;
    readonly apiIntegrationTemplate: WorkflowTemplate;
    readonly securityAnalysisTemplate: WorkflowTemplate;
    readonly codeQualityTemplate: WorkflowTemplate;
    readonly accessibilityTemplate: WorkflowTemplate;
    readonly i18nWorkflow: WorkflowTemplate;
    readonly dataFlowAnalysisTemplate: WorkflowTemplate;
    readonly documentationAnalysisTemplate: WorkflowTemplate;
    readonly accessibilityWorkflow: WorkflowTemplate;
    readonly analysisWorkflow: WorkflowTemplate;
    readonly processWorkflow: WorkflowTemplate;
    readonly validationWorkflow: WorkflowTemplate;
    readonly analysisReportWorkflow: WorkflowTemplate;
    readonly complexWorkflow: WorkflowTemplate;
};
export type WorkflowTemplateType = keyof typeof workflowTemplates;
