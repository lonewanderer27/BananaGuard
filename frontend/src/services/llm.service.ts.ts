import axios from "axios";

const llm = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8001",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

class LLMServices {
  async ask(
    question: string,
    retrieveSources: boolean,
  ): Promise<AskLlmResponse> {
    const res = await llm.post("/query", {
      question,
      "retrieve_sources": retrieveSources,
    });
    return res.data;
  }
}
