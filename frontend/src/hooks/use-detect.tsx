import { useMutation } from "@tanstack/react-query";
import { BackendServices } from '@/services/backend.service';
import { AnalysisResult } from "@/types/analysis-result.types";
import { analysisResultAtom } from "@/atoms";
import { useSetAtom } from "jotai";

const setAnalysisResult = useSetAtom(analysisResultAtom);

const useDetect = useMutation({
  mutationFn: async (photo: File) => {
    return BackendServices.detect(photo);
  },
  onSuccess: (data: AnalysisResult) => {
    setAnalysisResult(data);
  }
})

export default useDetect