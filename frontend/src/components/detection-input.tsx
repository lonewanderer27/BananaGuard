import { useDropzone } from "react-dropzone";
import { FiImage, FiSend } from "react-icons/fi";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";

export const DetectionInput = ({
  sampleQuestions,
  maxSampleQuestions,
  onClickViewMoreQuestions,
  photo,
  onPhotoChange,
  question,
  onChange,
  onSubmit,
  loading
}: {
  photo?: File,
  onPhotoChange?: (photo: File) => void,
  question: string,
  onChange: (question: string) => void,
  sampleQuestions?: string[],
  maxSampleQuestions: number,
  onClickViewMoreQuestions?: () => void,
  onSubmit: (question: string) => void,
  loading: boolean
}) => {
  const handleDrop = (files: File[]) => {
    console.log(files)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg']
    },
    maxFiles: 1,
    onDrop: handleDrop,
  })

  return (
    <div className="container flex flex-col gap-y-2 p-5">
      <section {...getRootProps()} style={{ border: "0.5px dashed grey" }}>
        <div {...getInputProps()}>
          {isDragActive ? 'Drop the image file here...' : 'Drag image here'}
          <FiImage size={20} color="red" />
        </div>
      </section>
      {(sampleQuestions && sampleQuestions.length > 0) &&
        <section>
          <p className="text-base mb-2">Quick questions:</p>
          <section className="flex flex-wrap gap-2">
            {sampleQuestions.slice(0, maxSampleQuestions).map((q) =>
              <Chip
                variant="flat"
                className="cursor-pointer"
                onClick={() => onChange(q)}
              >
                {q}
              </Chip>)}
            {(sampleQuestions.length > maxSampleQuestions && onClickViewMoreQuestions) ?
              <Chip
                variant="flat"
                className="cursor-pointer"
                onClick={onClickViewMoreQuestions}>
                View More Questions
              </Chip> : ""}
          </section>
        </section>}
      <section className="flex gap-x-2">
        <Input
          placeholder="Or type your own question..."
          onChange={(q) => onChange(q.target.value)}
          readOnly={loading}
          value={question}
        />
        <Button
          variant={question.trim().length == 0 ? "ghost" : undefined}
          disabled={question.trim().length == 0}
          onPress={() => onSubmit(question)}
        >
          {!loading && <>Send <FiSend size={20} /></>}
          {loading && <>Sending... <Spinner size="sm" /></>}
        </Button>
      </section>
    </div >
  )
}

DetectionInput.defaultProps = {
  maxSampleQuestions: 5,
  loading: false
}

export default DetectionInput