import { useAtomValue, useAtom } from "jotai";
import { useRef, useEffect, useCallback, useState } from "react";

import {
  analysisResultAtom,
  detectionItemsAtom,
  insightResultAtom,
  photoAtom,
  questionAtom,
} from "@/atoms";
import { sampleQuestionsAtom } from "@/atoms/sample-questions-atom";
import DetectionInput from "@/components/detection-input";
import DetectionItem from "@/components/detection-item";
import Onboarding from "@/components/onboarding";
import useDetect from "@/hooks/use-detect";
import useInsight from "@/hooks/use-insight";
import DefaultLayout from "@/layouts/default";
import { AnalysisResult } from "@/types/analysis-result.types";
import { DetectionItemType } from "@/types/detection-item.types";

export default function IndexPage() {
  const ref = useRef<HTMLDivElement>(null);
  const [localQuestion, setLocalQuestion] = useState("");

  const [photo, setPhoto] = useAtom(photoAtom);
  const [question, setQuestion] = useAtom(questionAtom);
  const sampleQuestions = useAtomValue(sampleQuestionsAtom);

  const [analysisResult, setAnalysisResult] = useAtom(analysisResultAtom);
  const [detectionItems, setDetectionItems] = useAtom(detectionItemsAtom);
  const { mutate: insight, isPending: pendingInsight } = useInsight({
    onSuccess: (data) => {
      console.log(`Insight Result: ${JSON.stringify(data)}`);
      console.log(`Analysis Result: ${JSON.stringify(analysisResult)}`);
      setDetectionItems((items) => [
        ...items,
        {
          id: Date.now().toString() + question + photo?.name,
          question: question,
          photo: photo,
          analysisResult: analysisResult,
          insightResult: data,
        },
      ]);
      handleClear();
    },
  });

  const { mutate: detect, isPending: pendingAnalysis } = useDetect({
    onSuccess: (data) => {
      setAnalysisResult(data);

      // Filter diseases based on percentage differences
      const entries = Object.entries(data);

      if (entries.length === 0) {
        insight({
          analysisResult: {},
          question: question,
          sources: false,
        });

        return;
      }

      // Sort entries by percentage (descending)
      entries.sort((a, b) => b[1] - a[1]);

      // Group diseases by similar percentages (within 5% threshold)
      const threshold = 5;
      const filteredAnalysis: Record<string, number> = {};
      const processedPercentages = new Set<number>();

      entries.forEach(([disease, percentage]) => {
        // Check if this percentage is significantly different from already processed ones
        const isSimilar = Array.from(processedPercentages).some(
          (processedPerc) => Math.abs(processedPerc - percentage) <= threshold,
        );

        if (!isSimilar) {
          filteredAnalysis[disease] = percentage;
          processedPercentages.add(percentage);
        }
      });

      // Always include the top result
      if (Object.keys(filteredAnalysis).length === 0) {
        filteredAnalysis[entries[0][0]] = entries[0][1];
      }

      insight({
        analysisResult: filteredAnalysis as AnalysisResult,
        question: question,
        sources: false,
      });
    },
  });
  const insightResult = useAtomValue(insightResultAtom); // Only for pending

  // Auto-scroll when detection items change or when pending state changes
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [detectionItems.length, pendingAnalysis, pendingInsight]);

  const handlePhotoChange = useCallback((photo: File) => {
    setPhoto(photo);
  }, []);

  const handleSubmit = (q: string) => {
    // If there is a photo, use the detect hook
    if (photo && q.trim().length > 0) {
      console.log(`User asks: ${q}`);
      setQuestion(q);
      detect(photo);
    }

    // TODO: Allow the user to just chat with the AI
  };

  const handleClickQuestion = useCallback((q: string) => {
    setLocalQuestion(q);
  }, []);

  const handleClear = useCallback(() => {
    setPhoto(undefined);
    setQuestion("");
  }, []);

  const handlePrefill = useCallback((item: DetectionItemType) => {
    console.log(`Pre-filling a query from a previous detection item: ${item}`);
    setPhoto(item.photo as File);
    setQuestion(item.question);
  }, []);

  return (
    <DefaultLayout
      footer={
        <DetectionInput
          loading={pendingAnalysis || pendingInsight}
          photo={photo}
          question={localQuestion}
          sampleQuestions={sampleQuestions}
          onChange={handleClickQuestion}
          onPhotoChange={handlePhotoChange}
          onSubmit={handleSubmit}
          maxSampleQuestions={3}
        />
      }
    >
      {detectionItems.length == 0 && !pendingAnalysis && !pendingInsight && (
        <Onboarding />
      )}
      <div
        ref={ref}
        className="flex flex-col gap-y-5 overflow-y-auto max-h-[calc(100vh-200px)] p-4"
      >
        {detectionItems.map((item) => (
          <DetectionItem
            {...item}
            id={item.id}
            key={item.id}
            loading={false}
            showAnalysisResult={false}
            onTap={handlePrefill}
          />
        ))}
        {(pendingAnalysis || pendingInsight) && (
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
        )}
      </div>
    </DefaultLayout>
  );
}
