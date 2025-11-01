import { DiseaseType } from "@/enums/disease.enum";

export type AnalysisResult = Partial<Record<DiseaseType, number>>;
