import { AnalysisResult } from "./analysis-result.types";

export type InsightParams = {
  question: string;
  analysisResult: AnalysisResult;
  sources?: boolean;
};
