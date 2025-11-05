import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useSetAtom } from "jotai";

import { BackendServices } from "@/services/backend.service";
import { AnalysisResult } from "@/types/analysis-result.types";
import { analysisResultAtom } from "@/atoms";

const useDetect = (
  options?: Omit<UseMutationOptions<AnalysisResult, Error, File>, "mutationFn">,
) => {
  const setAnalysisResult = useSetAtom(analysisResultAtom);

  return useMutation({
    mutationFn: async (photo: File) => {
      return BackendServices.detect(photo);
    },
    onSuccess: (data: AnalysisResult) => {
      setAnalysisResult(data);
    },
    onError: options?.onError,
    ...options,
  });
};

export default useDetect;
