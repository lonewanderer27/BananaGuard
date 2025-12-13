import { useDropzone } from "react-dropzone";
import { FiImage, FiSend, FiX } from "react-icons/fi";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Image } from "@heroui/image";
import { Card, CardBody } from "@heroui/card";
import { memo, useCallback, useMemo, useState } from "react";

interface DetectionInputProps {
  photo?: File;
  onPhotoChange: (photo: File) => void;
  question: string;
  onChange: (question: string) => void;
  sampleQuestions?: string[];
  maxSampleQuestions?: number;
  onClickViewMoreQuestions?: () => void;
  onSubmit: (question: string) => void;
  loading?: boolean;
}

const PhotoPreview = memo(
  ({
    photo,
    photoUrl,
    loading,
    onRemove,
  }: {
    photo: File;
    photoUrl: string;
    loading: boolean;
    onRemove: (e: React.MouseEvent) => void;
  }) => (
    <Card className="relative w-fit" radius="sm">
      <CardBody className="p-1.5">
        <div className="flex items-center gap-2">
          <Image
            key={photo.name + photo.lastModified}
            alt="Preview"
            className="w-12 h-12 object-cover"
            id={photo.name + photo.lastModified}
            radius="sm"
            src={photoUrl}
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
            onClick={onRemove}
          >
            <FiX size={16} />
          </Button>
        </div>
      </CardBody>
    </Card>
  ),
  (prev, next) =>
    prev.photo === next.photo &&
    prev.loading === next.loading &&
    prev.photoUrl === next.photoUrl,
);

PhotoPreview.displayName = "PhotoPreview";

const DropzoneArea = memo(
  ({
    getRootProps,
    getInputProps,
    isDragActive,
  }: {
    getRootProps: any;
    getInputProps: any;
    isDragActive: boolean;
  }) => (
    <div
      {...getRootProps()}
      className="border border-dashed border-gray-400 p-3 hover:border-gray-600 rounded-lg cursor-pointer transition-colors"
    >
      <input {...getInputProps()} />
      <div className="flex items-center gap-2">
        <FiImage className="text-gray-400" size={20} />
        <p className="text-sm text-gray-600">
          {isDragActive ? "Drop image here" : "Drag image or click to browse"}
        </p>
      </div>
    </div>
  ),
);

DropzoneArea.displayName = "DropzoneArea";

const SampleQuestions = memo(
  ({
    displayedQuestions,
    showViewMore,
    onClickQuestion,
    onClickViewMore,
  }: {
    displayedQuestions: string[];
    showViewMore: boolean;
    onClickQuestion: (q: string) => void;
    onClickViewMore?: () => void;
  }) => (
    <section>
      <p className="mb-1.5 text-gray-600">Quick questions:</p>
      <section className="flex flex-wrap gap-1.5">
        {displayedQuestions.map((q) => (
          <Chip
            key={q}
            className="cursor-pointer text-xs"
            id={q}
            size="lg"
            variant="flat"
            onClick={() => onClickQuestion(q)}
          >
            {q}
          </Chip>
        ))}
        {showViewMore && (
          <Chip
            className="cursor-pointer text-xs"
            size="lg"
            variant="flat"
            onClick={onClickViewMore}
          >
            View More
          </Chip>
        )}
      </section>
    </section>
  ),
  (prev, next) =>
    prev.displayedQuestions === next.displayedQuestions &&
    prev.showViewMore === next.showViewMore &&
    prev.onClickQuestion === next.onClickQuestion &&
    prev.onClickViewMore === next.onClickViewMore,
);

SampleQuestions.displayName = "SampleQuestions";

export const DetectionInput = memo(
  ({
    sampleQuestions,
    maxSampleQuestions = 5,
    onClickViewMoreQuestions,
    photo,
    onPhotoChange,
    question,
    onChange,
    onSubmit,
    loading = false,
  }: DetectionInputProps) => {
    const [localQuestion, setLocalQuestion] = useState(question);

    const handleDrop = useCallback(
      (files: File[]) => {
        if (process.env.NODE_ENV === "development") {
          console.debug(files);
        }
        onPhotoChange(files[0]);
      },
      [onPhotoChange],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      accept: {
        "image/png": [".png"],
        "image/jpeg": [".jpg", ".jpeg"],
      },
      maxFiles: 1,
      onDrop: handleDrop,
    });

    const handleRemoveImage = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onPhotoChange(null as any);
      },
      [onPhotoChange],
    );

    const handleKeyEnter = useCallback(
      (e: React.KeyboardEvent) => {
        if (localQuestion.trim().length !== 0 && e.key === "Enter") {
          onSubmit(localQuestion);
          onChange(localQuestion);
        }
      },
      [localQuestion, onSubmit, onChange],
    );

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        setLocalQuestion(value);
        onChange(value);
      },
      [onChange],
    );

    const handleSubmitClick = useCallback(() => {
      onSubmit(localQuestion);
    }, [onSubmit, localQuestion]);

    const handleChipClick = useCallback(
      (q: string) => {
        setLocalQuestion(q);
        onChange(q);
      },
      [onChange],
    );

    const photoUrl = useMemo(
      () => (photo ? URL.createObjectURL(photo) : undefined),
      [photo],
    );

    const displayedQuestions = useMemo(
      () => sampleQuestions?.slice(0, maxSampleQuestions) || [],
      [sampleQuestions, maxSampleQuestions],
    );

    const showViewMore = useMemo(
      () =>
        !!(sampleQuestions &&
          sampleQuestions.length > maxSampleQuestions &&
          onClickViewMoreQuestions),
      [sampleQuestions, maxSampleQuestions, onClickViewMoreQuestions],
    );

    const isSubmitDisabled = localQuestion.trim().length === 0;

    useMemo(() => {
      if (question !== localQuestion) {
        setLocalQuestion(question);
      }
    }, [question]);

    return (
      <div className="container flex flex-col gap-y-2 p-3 shadow-[0_-2px_4px_-1px_rgba(0,0,0,0.06)] rounded-xl">
        <section>
          {!photo ? (
            <DropzoneArea
              getInputProps={getInputProps}
              getRootProps={getRootProps}
              isDragActive={isDragActive}
            />
          ) : (
            <div {...getRootProps()} className="rounded-lg cursor-pointer">
              <input {...getInputProps()} />
              <PhotoPreview
                loading={loading}
                photo={photo}
                photoUrl={photoUrl!}
                onRemove={handleRemoveImage}
              />
            </div>
          )}
        </section>
        {displayedQuestions.length > 0 && (
          <SampleQuestions
            displayedQuestions={displayedQuestions}
            showViewMore={showViewMore}
            onClickQuestion={handleChipClick}
            onClickViewMore={onClickViewMoreQuestions}
          />
        )}
        <section className="flex gap-x-2">
          <Input
            placeholder="Type your question..."
            readOnly={loading}
            value={localQuestion}
            onChange={handleInputChange}
            onKeyDown={handleKeyEnter}
          />
          <Button
            disabled={isSubmitDisabled}
            variant={isSubmitDisabled ? "ghost" : undefined}
            onPress={handleSubmitClick}
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
  },
  (prevProps, nextProps) => {
    return (
      prevProps.loading === nextProps.loading &&
      prevProps.photo === nextProps.photo &&
      prevProps.sampleQuestions === nextProps.sampleQuestions &&
      prevProps.maxSampleQuestions === nextProps.maxSampleQuestions &&
      prevProps.onChange === nextProps.onChange &&
      prevProps.onPhotoChange === nextProps.onPhotoChange &&
      prevProps.onSubmit === nextProps.onSubmit &&
      prevProps.onClickViewMoreQuestions === nextProps.onClickViewMoreQuestions
    );
  },
);

DetectionInput.displayName = "DetectionInput";

export default DetectionInput;
