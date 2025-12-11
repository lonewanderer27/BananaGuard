import { memo } from "react";
import DetectionItem from "./detection-item";
import { DetectionItemType } from "@/types/detection-item.types";

const PendingDetectionItem = memo(({ 
  question, 
  photo, 
  analysisResult, 
  insightResult, 
  pendingInsight 
}: {
  question: string;
  photo?: File;
  analysisResult?: any;
  insightResult?: any;
  pendingInsight: boolean;
}) => (
  <DetectionItem
    key={"pending"}
    analysisResult={analysisResult}
    id="pending"
    insightResult={insightResult}
    loading={pendingInsight}
    showAnalysisResult={false}
    photo={photo}
    question={question}
  />
));

export default PendingDetectionItem;