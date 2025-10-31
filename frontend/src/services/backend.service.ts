import axios from "axios";

import { AnalysisResult } from "@/types/analysis-result.types";

const backend = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8000",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export class BackendServices {
  static async detect(
    photo: File,
    sortResults?: true,
  ): Promise<AnalysisResult> {
    // construct the form
    const formData = new FormData();

    // append the photo file
    formData.append("photo", photo);

    // make the request
    const res = await backend.post("/detect", formData, {
      params: {
        sort_results: sortResults,
      },
    });

    // return the data
    return res.data;
  }
}
