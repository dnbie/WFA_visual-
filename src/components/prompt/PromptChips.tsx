const prompts = [
  "Show the top 15 roles most disrupted by AI as a horizontal bar chart",
  "Bubble chart of roles by AI disruption vs human necessity, sized by FTE count",
  "Which departments have the highest average agentic AI work split?",
  "Treemap of task clusters sized by task count",
  "Top 10 skills with highest total disruption score",
  "Compare work split across job levels as a stacked bar chart",
  "Scatter plot of all roles: disruption score on x, human work split on y, colored by department"
];

interface PromptChipsProps {
  onSelect: (value: string) => void;
}

export function PromptChips({ onSelect }: PromptChipsProps) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          className="rounded-full border border-[--wfa-border] bg-white px-3 py-2 text-left text-sm text-[--wfa-text-secondary] hover:border-[--wfa-green] hover:text-[--wfa-text]"
          onClick={() => onSelect(prompt)}
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
