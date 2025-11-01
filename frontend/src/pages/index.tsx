import { analysisResultAtom, detectionItemsAtom, insightResultAtom, photoAtom, questionAtom } from "@/atoms";
import { sampleQuestionsAtom } from "@/atoms/sample-questions-atom";
import DetectionInput from "@/components/detection-input";
import DetectionItem from "@/components/detection-item";
import useDetect from "@/hooks/use-detect";
import useInsight from "@/hooks/use-insight";
import DefaultLayout from "@/layouts/default";
import { AnalysisResult } from "@/types/analysis-result.types";
import { useAtomValue, useAtom } from "jotai";

export default function IndexPage() {
  const [photo, setPhoto] = useAtom(photoAtom);
  const [question, setQuestion] = useAtom(questionAtom);
  const sampleQuestions = useAtomValue(sampleQuestionsAtom);

  const analysisResult = useAtomValue(analysisResultAtom);
  const [detectionItems, setDetectionItems] = useAtom(detectionItemsAtom);
  const { mutate: insight, isPending: pendingInsight } = useInsight({
    onSuccess: (data) => {
      console.log(`Insight Result: ${JSON.stringify(data)}`)
      setDetectionItems((items) => [...items, {
        id: Date.now().toString(),
        question,
        photo,
        analysisResult,
        insightResult: data
      }])
    }
  });

  const { mutate: detect, isPending: pendingAnalysis } = useDetect({
    onSuccess: (data) => {
      console.log(`Analysis Result: ${JSON.stringify(data)}`);

      // Only send record of the highest result for a more sensible insight
      // In our case, since we sort our result by default
      // The first item should be the conclusive disease
      const entries = Object.entries(data);
      const filteredAnalysis = entries.length > 0
        ? { [entries[0][0]]: entries[0][1] } as AnalysisResult
        : {};

      insight({
        analysisResult: filteredAnalysis,
        question: question,
        sources: false
      })
    }
  });
  const insightResult = useAtomValue(insightResultAtom);

  const handlePhotoChange = (photo: File) => {
    setPhoto(photo);
  }

  const handleSubmit = (q: string) => {
    // TODO: Ensure image is present
    if (!photo) {
      // TODO: display an error??
      return
    }

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
      {detectionItems.length == 0 &&
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <h1>BananaGuard</h1>
        </section>}
      <div className="flex flex-col gap-y-5 overflow-y-auto max-h-[calc(100vh-200px)] p-4">
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
