import type { AIType } from "../../../types";
import { getAIColor } from "../../../utils/colors";

interface SplitBarProps {
  agentic: number;
  generative: number;
  traditional: number;
  human: number;
  activeAIType: AIType;
}

export function SplitBar({ agentic, generative, traditional, human, activeAIType }: SplitBarProps) {
  const values = [
    { k: "agentic", v: agentic },
    { k: "generative", v: generative },
    { k: "traditional", v: traditional },
    { k: "human", v: human }
  ] as const;

  return (
    <div className="flex h-2 w-40 overflow-hidden rounded border border-gray-100">
      {values.map((item) => (
        <span
          key={item.k}
          style={{ width: `${Math.round(item.v * 100)}%`, backgroundColor: getAIColor(item.k, activeAIType) }}
        />
      ))}
    </div>
  );
}
