import { DetectionItemType } from "@/types/detection-item.types"
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { Skeleton } from "@heroui/skeleton";
import { useMemo } from "react";
import Markdown from 'react-markdown'
import { AnalysisSummary } from "./analysis-summary";


interface DetectionItemProps extends DetectionItemType {
  loading: boolean
}

const DetectionItem = (props: DetectionItemProps) => {
  const photoUrl = typeof props.photo === 'string'
    ? props.photo
    : props.photo ? URL.createObjectURL(props.photo) : undefined;

  const responseSkeletonWidths = useMemo(
    () => ["92%", "100%", "78%", "86%", "65%"],
    []
  );

  return (
    <div
      id={props.id.toString()}
      className="flex flex-col max-w-screen gap-y-5"
    >
      <div className="flex max-w-full justify-end">
        <Card className="max-w-[300px] justify-self-end">
          <CardBody className="flex gap-2">
            {props.photo && <Image src={photoUrl} />}
            <p>{props.question}</p>
          </CardBody>
        </Card>
      </div>
      <div>
        {props.analysisResult &&
          <div>
            <AnalysisSummary analysis={props.analysisResult} />
          </div>}
        {(props.loading == false && props.insightResult) &&
          <div>
            <Card className="max-w-[700px]">
              <CardBody>
                <Markdown>{props.insightResult.response}</Markdown>
              </CardBody>
            </Card>
          </div>}
      </div>
      {props.loading &&
        <div>
          <Card className="max-w-[700px]">
            <CardBody className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                {responseSkeletonWidths.map((width, index) => (
                  <Skeleton key={index} className="h-4 rounded-lg" style={{ width }} />
                ))}
              </div>
            </CardBody>
          </Card>
        </div>}
    </div>
  )
}

DetectionItem.defaultProps = {
  loading: false
}

export default DetectionItem