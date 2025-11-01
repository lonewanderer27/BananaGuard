import { AnalysisResult } from "./analysis-result.types";
import { InsightResult } from "./insight-result.types";

export type DetectionItemType = {
  photo: File;
  question: string;
  analysisResult: AnalysisResult;
  insightResult: InsightResult;
};
