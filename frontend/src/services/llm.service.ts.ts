import { AnalysisResult } from "@/types/analysis-result.types";
import axios from "axios";

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
  ): Promise<InsightResponse> {
    const res = await llm.post("/ask", {
      question,
      "retrieve_sources": retrieveSources,
    });
    return res.data;
  }
  static async insight(
    question: string,
    retrieveSources: boolean,
    analysisResult: AnalysisResult,
  ): Promise<InsightResponse> {
    const res = await llm.post("/insight", {
      question,
      "retrieve_sources": retrieveSources,
      analysisResult,
    });
    return res.data;
  }
}
