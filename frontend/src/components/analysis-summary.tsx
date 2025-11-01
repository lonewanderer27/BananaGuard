import { Card, CardBody } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { DiseaseType } from "@/enums/disease.enum";
import { AnalysisResult } from "@/types/analysis-result.types";

interface AnalysisSummaryProps {
  analysis?: AnalysisResult | null;
}

const DISEASE_LABELS: Record<DiseaseType, string> = {
  [DiseaseType.BBTV]: "Banana Bunchy Top Virus (BBTV)",
  [DiseaseType.Cordana]: "Cordana Leaf Spot",
  [DiseaseType.BlackSigatoka]: "Black Sigatoka",
  [DiseaseType.Panama]: "Panama Disease",
  [DiseaseType.Pestalotiopsis]: "Pestalotiopsis Leaf Spot",
  [DiseaseType.Healthy]: "Healthy Leaf",
};

export const AnalysisSummary = ({ analysis }: AnalysisSummaryProps) => {
  if (!analysis || Object.keys(analysis).length === 0) return null;

  // Step 1: Sort all results (highest first)
  const sortedResults = Object.entries(analysis)
    .filter(([_, value]) => value !== undefined && value !== null)
    .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0));

  // Step 2: Group diseases with the same value
  const groupedResults: Record<number, string[]> = {};
  for (const [key, value] of sortedResults) {
    const v = Number(value?.toFixed(1)); // normalize decimals
    if (!groupedResults[v]) groupedResults[v] = [];
    groupedResults[v].push(key);
  }

  const sortedGroups = Object.entries(groupedResults).sort(
    (a, b) => Number(b[0]) - Number(a[0])
  );

  return (
    <Card className="max-w-[700px] mb-4 border border-gray-200 dark:border-gray-700">
      <CardBody className="space-y-4">
        <h3 className="font-semibold text-lg">Image Analysis Results</h3>

        {sortedGroups.map(([percent, diseases]) => {
          const topGroup = sortedGroups[0][0] === percent;
          const isHealthy = diseases.includes(DiseaseType.Healthy);
          const label = diseases.map(
            (d) => DISEASE_LABELS[d as DiseaseType]
          ).join(", ");

          return (
            <div key={percent}>
              <div className="flex justify-between text-sm mb-1">
                <span>{label}</span>
                <span className="font-medium">{percent}%</span>
              </div>
              <Progress
                aria-label={label}
                value={Number(percent)}
                color={
                  isHealthy
                    ? "success"
                    : topGroup
                      ? "warning"
                      : "default"
                }
                className="h-2"
              />
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
};