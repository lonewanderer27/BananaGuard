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
  maxSampleQuestions = 5,
  onClickViewMoreQuestions,
  photo,
  onPhotoChange,
  question,
  onChange,
  onSubmit,
  loading = false,
}: {
  photo?: File;
  onPhotoChange: (photo: File) => void;
  question: string;
  onChange: (question: string) => void;
  sampleQuestions?: string[];
  maxSampleQuestions: number;
  onClickViewMoreQuestions?: () => void;
  onSubmit: (question: string) => void;
  loading: boolean;
}) => {
  const handleDrop = (files: File[]) => {
    console.log(files);
    onPhotoChange(files[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    maxFiles: 1,
    onDrop: handleDrop,
  });

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPhotoChange(null as any);
  };

  const handleKeyEnter = (e: React.KeyboardEvent) => {
    if (question.trim().length != 0 && e.key == "Enter") {
      onSubmit(question);
    }
  };

  return (
    <div className="container flex flex-col gap-y-2 p-3 shadow-[0_-2px_4px_-1px_rgba(0,0,0,0.06)] rounded-xl">
      <section>
        <div
          {...getRootProps()}
          className={`rounded-lg cursor-pointer transition-colors ${!photo
            ? "border border-dashed border-gray-400 p-3 hover:border-gray-600"
            : ""
            }`}
        >
          <input {...getInputProps()} />
          {!photo ? (
            <div className="flex items-center gap-2">
              <FiImage className="text-gray-400" size={20} />
              <p className=" text-sm text-gray-600">
                {isDragActive
                  ? "Drop image here"
                  : "Drag image or click to browse"}
              </p>
            </div>
          ) : (
            <Card className="relative w-fit" radius="sm">
              <CardBody className="p-1.5">
                <div className="flex items-center gap-2">
                  <Image
                    alt="Preview"
                    className="w-12 h-12 object-cover"
                    radius="sm"
                    src={URL.createObjectURL(photo)}
                  />
                  <p className="text-xs text-gray-500 truncate flex-1 max-w-[200px]">
                    {photo.name}
                  </p>
                  <Button
                    isIconOnly
                    className="min-w-unit-8 w-8 h-8"
                    color="danger"
                    disabled={loading}
                    size="sm"
                    variant="light"
                    onClick={handleRemoveImage}
                  >
                    <FiX size={16} />
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </section>
      {sampleQuestions && sampleQuestions.length > 0 && (
        <section>
          <p className="mb-1.5 text-gray-600">Quick questions:</p>
          <section className="flex flex-wrap gap-1.5">
            {sampleQuestions.slice(0, maxSampleQuestions).map((q) => (
              <Chip
                className="cursor-pointer text-xs"
                id={q}
                key={q}
                size="lg"
                variant="flat"
                onClick={() => onChange(q)}
              >
                {q}
              </Chip>
            ))}
            {sampleQuestions.length > maxSampleQuestions &&
              onClickViewMoreQuestions ? (
              <Chip
                className="cursor-pointer text-xs"
                size="lg"
                variant="flat"
                onClick={onClickViewMoreQuestions}
              >
                View More
              </Chip>
            ) : (
              ""
            )}
          </section>
        </section>
      )}
      <section className="flex gap-x-2">
        <Input
          placeholder="Type your question..."
          readOnly={loading}
          value={question}
          onChange={(q) => onChange(q.target.value)}
          onKeyDown={handleKeyEnter}
        />
        <Button
          disabled={question.trim().length == 0}
          variant={question.trim().length == 0 ? "ghost" : undefined}
          onPress={() => onSubmit(question)}
        >
          {!loading && (
            <>
              <FiSend size={20} />
              Send
            </>
          )}
          {loading && <Spinner size="sm" />}
        </Button>
      </section>
    </div>
  );
};

export default DetectionInput;
