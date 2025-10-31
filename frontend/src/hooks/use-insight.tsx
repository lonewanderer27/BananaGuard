import { useMutation } from "@tanstack/react-query";
import { useSetAtom } from "jotai";

import { insightResultAtom } from "@/atoms";
import { LLMServices } from "@/services/llm.service.ts";
import { AnalysisResult } from "@/types/analysis-result.types";


const useInsight = () => {
  const setInsightResult = useSetAtom(insightResultAtom);

  return useMutation({
    mutationFn: async ({
      question,
      analysisResult,
      sources,
    }: {
      question: string;
      analysisResult: AnalysisResult;
      sources: boolean;
    }) => {
      return LLMServices.insight(question, sources, analysisResult);
    },
    onSuccess: (data: InsightResponse) => {
      setInsightResult(data);
    },
  });
}

export default useInsight;
