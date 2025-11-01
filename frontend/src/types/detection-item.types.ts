import { AnalysisResult } from "./analysis-result.types";
import { InsightResult } from "./insight-result.types";

export type DetectionItemType = {
  id: string;
  question: string;
  photo?: File | string;
  analysisResult?: AnalysisResult;
  insightResult?: InsightResult;
};
