import axios from "axios";

import { AnalysisResult } from "@/types/analysis-result.types";
import { InsightResult } from "@/types/insight-result.types";

const llm = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8001",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export class LLMServices {
  static async ask(
    question: string,
    retrieveSources: boolean,
  ): Promise<InsightResult> {
    const res = await llm.post("/ask", {
      question,
      retrieve_sources: retrieveSources,
    });

    return res.data;
  }
  static async insight(
    question: string,
    retrieveSources: boolean,
    analysisResult: AnalysisResult,
  ): Promise<InsightResult> {
    const res = await llm.post("/insight", {
      question,
      retrieve_sources: retrieveSources,
      analysis_result: analysisResult,
    });

    return res.data;
  }
}
