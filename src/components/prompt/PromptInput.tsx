import { useState } from "react";

interface PromptInputProps {
  onAsk: (query: string) => void;
  initialValue?: string;
}

export function PromptInput({ onAsk, initialValue = "" }: PromptInputProps) {
  const [value, setValue] = useState(initialValue);

  return (
    <div className="mb-5 flex flex-col gap-2 md:flex-row">
      <input
        className="flex-1 rounded-lg border border-[--wfa-border] px-3 py-2 text-sm"
        placeholder="Ask a question about roles, departments, clusters, risks, or AI split"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onAsk(value);
        }}
      />
      <button
        type="button"
        className="rounded-lg bg-[--wfa-green] px-4 py-2 text-sm font-semibold text-white hover:bg-[--wfa-green-dark]"
        onClick={() => onAsk(value)}
      >
        Ask
      </button>
    </div>
  );
}
