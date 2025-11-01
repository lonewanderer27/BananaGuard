import { AnalysisResult } from "@/types/analysis-result.types";
import { DetectionItemType } from "@/types/detection-item.types";
import { InsightResult } from "@/types/insight-result.types";
import { atom } from "jotai";

export const photoAtom = atom<File>();

export const questionAtom = atom<string>("");

export const analysisResultAtom = atom<AnalysisResult>();

export const insightResultAtom = atom<InsightResult>();

export const detectionItemsAtom = atom<DetectionItemType[]>([]);
