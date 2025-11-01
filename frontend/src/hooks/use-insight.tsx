import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useSetAtom } from "jotai";

import { insightResultAtom } from "@/atoms";
import { LLMServices } from "@/services/llm.service.ts";
import { AnalysisResult } from "@/types/analysis-result.types";
import { InsightResult } from "@/types/insight-result.types";
import { InsightParams } from "@/types/insight-params.types";

const useInsight = (
  options?: Omit<UseMutationOptions<InsightResult, Error, InsightParams>, "mutationFn">
) => {
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
    onSuccess: (data: InsightResult, variables, context, mutation) => {
      setInsightResult(data);
      options?.onSuccess?.(data, variables, context, mutation);
    },
    onError: options?.onError,
    ...options,
  });
};

export default useInsight;
