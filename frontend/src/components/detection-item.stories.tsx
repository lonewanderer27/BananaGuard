import type { Meta, StoryObj } from "@storybook/react-vite";

import DetectionItem from "./detection-item";

import bbtvUrl from "/bbtv.png";

const meta = {
  component: DetectionItem,
  title: "Detection Item",
  tags: ["autodocs"],
} satisfies Meta<typeof DetectionItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "q1",
    photo: bbtvUrl,
    question: "What disease does my banana plant have based on this photo?",
    insightResult: {
      response:
        "The primary threat to your banana crop is BBTV, a viral disease caused by *Banana Bunchy Top Virus* (BBTV). It’s a significant problem in the Philippines, and requires proactive management.\n\n",
    },
    loading: false,
    showAnalysisResult: true,
  },
};
