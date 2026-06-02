import type { AIType } from "../../types";

interface AITypeFilterProps {
  activeAIType: AIType;
  onSelect: (value: AIType) => void;
}

const options: Array<{ value: AIType; label: string }> = [
  { value: "all", label: "All" },
  { value: "agentic", label: "Agentic AI" },
  { value: "generative", label: "Generative AI" },
  { value: "traditional", label: "Traditional AI" },
  { value: "human", label: "Human" }
];

export function AITypeFilter({ activeAIType, onSelect }: AITypeFilterProps) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="text-sm text-[--wfa-text-secondary]">Focus on:</span>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={[
            "rounded-full border px-3 py-1 text-xs font-semibold",
            activeAIType === option.value
              ? "border-[--wfa-green] bg-[--wfa-green] text-white"
              : "border-[--wfa-border] bg-white text-[--wfa-text-secondary] hover:border-[--wfa-green]"
          ].join(" ")}
          onClick={() => onSelect(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
