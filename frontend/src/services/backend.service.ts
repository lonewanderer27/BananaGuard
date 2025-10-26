import axios from "axios";

const backend = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8000",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

class BackendServices {
  async detect(
    photo: File,
    sortResults?: true,
  ): Promise<DetectDiseaseResponse> {
    // construct the form
    const formData = new FormData();

    // append the photo file
    formData.append("photo", photo);

    // make the request
    const res = await backend.post("/detect", formData, {
      params: {
        "sort_results": sortResults,
      },
    });

    // return the data
    return res.data;
  }
}
