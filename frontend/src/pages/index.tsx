import { photoAtom, questionAtom } from "@/atoms";
import { sampleQuestionsAtom } from "@/atoms/sample-questions-atom";
import DetectionInput from "@/components/detection-input";
import DefaultLayout from "@/layouts/default";
import { useAtomValue, useAtom } from "jotai";

export default function IndexPage() {
  const [photo, setPhoto] = useAtom(photoAtom);
  const [question, setQuestion] = useAtom(questionAtom);
  const sampleQuestions = useAtomValue(sampleQuestionsAtom);

  const handlePhotoChange = (photo: File) => {
    setPhoto(photo);
  }

  const handleSubmit = (q: string) => { }

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
        />}
    >
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <h1>BananaGuard</h1>
      </section>
    </DefaultLayout>
  );
}
