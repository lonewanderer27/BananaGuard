import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { Skeleton } from "@heroui/skeleton";
import { memo, useMemo } from "react";
import Markdown from "react-markdown";

import { AnalysisSummary } from "./analysis-summary";

import { DetectionItemType } from "@/types/detection-item.types";

interface DetectionItemProps extends DetectionItemType {
  loading: boolean;
  showAnalysisResult: boolean;
  onTap?: (item: DetectionItemType) => void;
}

const DetectionItem = memo(({
  loading = false,
  showAnalysisResult = false,
  ...props
}: DetectionItemProps) => {
  const photoUrl =
    typeof props.photo === "string"
      ? props.photo
      : props.photo
        ? URL.createObjectURL(props.photo)
        : undefined;

  const responseSkeletonWidths = useMemo(
    () => ["92%", "100%", "78%", "86%", "65%"],
    [],
  );

  return (
    <div
      className={`flex flex-col max-w-screen gap-y-5 ${props.onTap ? "cursor-pointer" : ""}`}
      id={props.id.toString()}
    >
      <div className="flex max-w-full justify-end">
        <Card
          isPressable
          className="max-w-[300px] justify-self-end cursor-pointer"
          onPress={() => props.onTap?.(props)}
        >
          <CardBody className="flex gap-2">
            {props.photo && <Image src={photoUrl} />}
            <p>{props.question}</p>
          </CardBody>
        </Card>
      </div>
      <div className="pointer-events-none">
        {(showAnalysisResult && props.analysisResult) && (
          <div>
            <AnalysisSummary analysis={props.analysisResult} />
          </div>
        )}
        {loading == false && props.insightResult && (
          <div>
            <Card className="max-w-[700px]">
              <CardBody>
                <Markdown>{props.insightResult.response}</Markdown>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
      {loading && (
        <div className="pointer-events-none">
          <Card className="max-w-[700px]">
            <CardBody className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                {responseSkeletonWidths.map((width, index) => (
                  <Skeleton
                    key={index}
                    className="h-4 rounded-lg"
                    style={{ width }}
                  />
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.id === nextProps.id &&
    prevProps.question === nextProps.question &&
    prevProps.loading === nextProps.loading &&
    prevProps.insightResult?.response === nextProps.insightResult?.response
  );
});

export default DetectionItem;
