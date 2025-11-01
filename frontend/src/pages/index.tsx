import { analysisResultAtom, detectionItemsAtom, insightResultAtom, photoAtom, questionAtom } from "@/atoms";
import { sampleQuestionsAtom } from "@/atoms/sample-questions-atom";
import DetectionInput from "@/components/detection-input";
import DetectionItem from "@/components/detection-item";
import Onboarding from "@/components/onboarding";
import useDetect from "@/hooks/use-detect";
import useInsight from "@/hooks/use-insight";
import DefaultLayout from "@/layouts/default";
import { AnalysisResult } from "@/types/analysis-result.types";
import { useAtomValue, useAtom } from "jotai";
import { useRef, useEffect } from "react";

export default function IndexPage() {
  const ref = useRef<HTMLDivElement>(null);

  const [photo, setPhoto] = useAtom(photoAtom);
  const [question, setQuestion] = useAtom(questionAtom);
  const sampleQuestions = useAtomValue(sampleQuestionsAtom);

  const [analysisResult, setAnalysisResult] = useAtom(analysisResultAtom);
  const [detectionItems, setDetectionItems] = useAtom(detectionItemsAtom);
  const { mutate: insight, isPending: pendingInsight } = useInsight({
    onSuccess: (data) => {
      console.log(`Insight Result: ${JSON.stringify(data)}`)
      console.log(`Analysis Result: ${JSON.stringify(analysisResult)}`)
      setDetectionItems((items) => [...items, {
        id: Date.now().toString(),
        question: question,
        photo: photo,
        analysisResult: analysisResult,
        insightResult: data
      }])
    }
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
          sources: false
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
          processedPerc => Math.abs(processedPerc - percentage) <= threshold
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
        sources: false
      })
    }
  });
  const insightResult = useAtomValue(insightResultAtom);

  // Auto-scroll when detection items change or when pending state changes
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [detectionItems.length, pendingAnalysis, pendingInsight]);

  const handlePhotoChange = (photo: File) => {
    setPhoto(photo);
  }

  const handleSubmit = (q: string) => {
    // TODO: Ensure image is present
    if (!photo) {
      // TODO: display an error??
      return
    }

    console.log(`User asks: ${q}`)
    detect(photo)
  }

  const handleClickQuestion = (q: string) => {
    setQuestion(q);
  }

  return (
    <DefaultLayout
      footer={
        <DetectionInput
          photo={photo}
          onPhotoChange={handlePhotoChange}
          sampleQuestions={sampleQuestions}
          question={question ?? ''}
          onChange={handleClickQuestion}
          onSubmit={handleSubmit}
          loading={pendingAnalysis || pendingInsight}
        />}
    >
      {detectionItems.length == 0 && !pendingAnalysis && !pendingInsight &&
        <Onboarding />}
      <div
        ref={ref}
        className="flex flex-col gap-y-5 overflow-y-auto max-h-[calc(100vh-200px)] p-4"
      >
        {detectionItems.map(item =>
          <DetectionItem
            key={item.id}
            {...item}
          />)}
        {(pendingAnalysis || pendingInsight) &&
          <DetectionItem
            key={"pending"}
            id="pending"
            question={question}
            photo={photo}
            loading={pendingInsight}
            analysisResult={analysisResult}
            insightResult={insightResult}
          />
        }
      </div>
    </DefaultLayout>
  );
}