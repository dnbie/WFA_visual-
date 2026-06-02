import { defaultTerminology, useConfigStore } from "../../store/configStore";

export function TerminologyConfig() {
  const terminology = useConfigStore((s) => s.terminology);
  const setTerm = useConfigStore((s) => s.setTerm);

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {Object.keys(defaultTerminology).map((label) => (
        <div key={label} className="flex items-center gap-2 rounded-lg border border-[--wfa-border] bg-white p-3">
          <span className="min-w-28 text-sm text-[--wfa-text-muted]">{label}</span>
          <span className="text-[--wfa-text-muted]">{">"}</span>
          <input
            className="w-full rounded-md border border-[--wfa-border] px-2 py-1 text-sm"
            value={terminology[label] ?? ""}
            onChange={(e) => setTerm(label, e.target.value.trim())}
          />
        </div>
      ))}
    </div>
  );
}
