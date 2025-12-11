import { memo } from "react";

import DetectionItem from "./detection-item";

const PendingDetectionItem = memo(
  ({
    question,
    photo,
    analysisResult,
    insightResult,
    pendingInsight,
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
      photo={photo}
      question={question}
      showAnalysisResult={false}
    />
  ),
);

PendingDetectionItem.displayName = "PendingDetectionItem";

export default PendingDetectionItem;
