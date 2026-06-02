import type { AIType, RoleSummary } from "../../types";
import { summarizeRiskLevels } from "../../utils/aggregations";

interface RiskAssessmentProps {
  rows: RoleSummary[];
  activeAIType: AIType;
}

type RiskBand = "Low" | "Medium" | "High";

function classifyRiskText(value: string): RiskBand {
  const text = value.toLowerCase();
  if (/high|severe|critical|major/.test(text)) return "High";
  if (/medium|moderate|elevated/.test(text)) return "Medium";
  return "Low";
}

function getRiskMix(values: string[]) {
  const mix = { high: 0, medium: 0, low: 0 };
  values.forEach((value) => {
    const band = classifyRiskText(value);
    if (band === "High") mix.high += 1;
    else if (band === "Medium") mix.medium += 1;
    else mix.low += 1;
  });
  return mix;
}

function pct(part: number, total: number): number {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

export function RiskAssessment({ rows, activeAIType }: RiskAssessmentProps) {
  const agenticValues = rows.flatMap((r) => r.riskAgentic);
  const generativeValues = rows.flatMap((r) => r.riskGenerative);
  const traditionalValues = rows.flatMap((r) => r.riskTraditional);

  const riskAgentic = summarizeRiskLevels(agenticValues);
  const riskGenerative = summarizeRiskLevels(generativeValues);
  const riskTraditional = summarizeRiskLevels(traditionalValues);

  const agenticMix = getRiskMix(agenticValues);
  const generativeMix = getRiskMix(generativeValues);
  const traditionalMix = getRiskMix(traditionalValues);

  const cards = [
    { key: "agentic", label: "Agentic AI", value: riskAgentic },
    { key: "generative", label: "Generative AI", value: riskGenerative },
    { key: "traditional", label: "Traditional AI", value: riskTraditional }
  ] as const;

  const levelScore: Record<RiskBand, number> = { Low: 1, Medium: 2, High: 3 };
  const maxScore = Math.max(...cards.map((c) => levelScore[c.value]));
  const highest = cards.filter((c) => levelScore[c.value] === maxScore).map((c) => c.label);
  const highestText = highest.length > 1 ? `${highest.slice(0, -1).join(", ")} and ${highest.at(-1)}` : highest[0];
  const sampleText = `${rows.length} roles | ${agenticValues.length + generativeValues.length + traditionalValues.length} risk signals`;

  const highPct = [
    { label: "Agentic", pct: pct(agenticMix.high, agenticValues.length) },
    { label: "Generative", pct: pct(generativeMix.high, generativeValues.length) },
    { label: "Traditional", pct: pct(traditionalMix.high, traditionalValues.length) }
  ].sort((a, b) => b.pct - a.pct);

  const dominantHighRisk = highPct[0];
  const insight =
    rows.length === 0
      ? "No data is available for the current filter selection."
      : `${highestText} currently has the highest overall risk level in this slice. ` +
        `${dominantHighRisk.label} has the highest concentration of High-risk signals at ${dominantHighRisk.pct}%. ` +
        `Agentic ${riskAgentic} (${agenticMix.high}H/${agenticMix.medium}M/${agenticMix.low}L), ` +
        `Generative ${riskGenerative} (${generativeMix.high}H/${generativeMix.medium}M/${generativeMix.low}L), ` +
        `Traditional ${riskTraditional} (${traditionalMix.high}H/${traditionalMix.medium}M/${traditionalMix.low}L).`;

  const focusText =
    activeAIType === "all"
      ? "Viewing all AI categories together."
      : `Current AI filter focus: ${cards.find((c) => c.key === activeAIType)?.label ?? "Selected AI type"}.`;

  return (
    <div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.key}
            className={[
              "rounded-lg border border-[--wfa-border] p-3 text-center",
              activeAIType === card.key ? "ring-2 ring-[--wfa-green]" : "",
              activeAIType !== "all" && activeAIType !== card.key ? "opacity-35" : ""
            ].join(" ")}
          >
            <div className="text-[11px] font-bold uppercase tracking-wide text-[--wfa-text-muted]">{card.label}</div>
            <div className="text-lg font-bold text-[--wfa-text]">{card.value}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-lg border border-[#d8eebe] bg-[#f5faea] p-3 text-xs text-[#517218]">
        <div className="font-semibold">Key insight</div>
        <div className="mt-1">{insight}</div>
        <div className="mt-1">{focusText}</div>
        <div className="mt-1 text-[11px] opacity-85">Data scope: {sampleText}</div>
      </div>
    </div>
  );
}
