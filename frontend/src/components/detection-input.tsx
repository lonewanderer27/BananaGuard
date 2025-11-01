import { useDropzone } from "react-dropzone";
import { FiImage, FiSend, FiX } from "react-icons/fi";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Image } from "@heroui/image";
import { Card, CardBody } from "@heroui/card";

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
  onPhotoChange: (photo: File) => void,
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
    onPhotoChange(files[0]);
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg']
    },
    maxFiles: 1,
    onDrop: handleDrop,
  })

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPhotoChange(null as any);
  }

  return (
    <div className="container flex flex-col gap-y-2 p-5">
      <section>
        <div
          {...getRootProps()}
          className={`rounded-lg cursor-pointer transition-colors ${!photo
            ? 'border border-dashed border-gray-400 p-6 hover:border-gray-600'
            : ''
            }`}
        >
          <input {...getInputProps()} />
          {!photo ? (
            <div className="flex items-center gap-2">
              <FiImage size={32} className="text-gray-400" />
              <p className="text-sm text-gray-600">
                {isDragActive ? 'Drop the image file here...' : 'Drag image here or click to browse'}
              </p>
            </div>
          ) : (
            <Card className="relative w-fit" radius="sm">
              <CardBody className="p-2 relative">
                <Image
                  src={URL.createObjectURL(photo)}
                  alt="Preview"
                  className="w-48 h-32 object-cover"
                  classNames={{
                    wrapper: "w-48 h-32"
                  }}
                  radius="sm"
                />
                <Button
                  isIconOnly
                  size="sm"
                  color="danger"
                  variant="flat"
                  onClick={handleRemoveImage}
                  className="absolute top-3 right-3 z-10"
                >
                  <FiX size={18} />
                </Button>
                <p className="text-xs text-gray-500 mt-1 truncate">{photo.name}</p>
              </CardBody>
            </Card>
          )}
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