import { atom } from "jotai";

export const sampleQuestionsAtom = atom<string[]>([
  "What disease does my banana plant have based on this photo?",
  "How can I prevent banana diseases from spreading between farms?",
  "What are the best ways to control banana aphids?",
  "Should I use traps or barrier crops for pest control?",
  "What's the best spacing and pruning method to prevent leaf diseases?",
  "What are the next actions I should take after this diagnosis?",
  "Can I prevent this disease from spreading to nearby plants?",
]);
