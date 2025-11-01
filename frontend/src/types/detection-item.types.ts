import { AnalysisResult } from "./analysis-result.types";
import { InsightResult } from "./insight-result.types";

export type DetectionItemType = {
  id: number;
  photo?: File | string;
  question?: string;
  analysisResult?: AnalysisResult;
  insightResult?: InsightResult;
};
