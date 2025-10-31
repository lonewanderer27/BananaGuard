import { insightResultAtom } from '@/atoms'
import { LLMServices } from '@/services/llm.service.ts'
import { AnalysisResult } from '@/types/analysis-result.types'
import { useMutation } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'

const setInsightResult = useSetAtom(insightResultAtom);

const useInsight = useMutation({
  mutationFn: async ({
    question, analysisResult, sources
  }: { question: string, analysisResult: AnalysisResult, sources: boolean }) => {
    return LLMServices.insight(question, sources, analysisResult);
  },
  onSuccess: (data: InsightResponse) => {
    setInsightResult(data);
  }
})

export default useInsight