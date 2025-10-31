import { AnalysisResult } from "@/types/analysis-result.types";
import {atom} from "jotai";

export const imageAtom = atom<File>();

export const questionAtom = atom<String>();

export const analysisResultAtom = atom<AnalysisResult>();

export const insightResultAtom = atom<InsightResponse>();