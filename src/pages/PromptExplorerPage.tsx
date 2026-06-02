import { useState } from "react";
import { PromptChips } from "../components/prompt/PromptChips";
import { PromptInput } from "../components/prompt/PromptInput";
import { PromptResult } from "../components/prompt/PromptResult";
import { useDataStore } from "../store/dataStore";

interface Result {
  id: string;
  title: string;
  subtitle: string;
  chartType:
    | "bar"
    | "horizontal-bar"
    | "line"
    | "area"
    | "pie"
    | "donut"
    | "stacked-bar"
    | "grouped-bar"
    | "bubble"
    | "scatter"
    | "treemap";
  data: Array<Record<string, string | number>>;
}

function detectChartType(query: string): Result["chartType"] {
  if (query.includes("treemap") || query.includes("tree map") || query.includes("heatmap")) return "treemap";
  if (query.includes("donut")) return "donut";
  if (query.includes("pie")) return "pie";
  if (query.includes("stacked")) return "stacked-bar";
  if (query.includes("grouped")) return "grouped-bar";
  if (query.includes("bubble")) return "bubble";
  if (query.includes("scatter")) return "scatter";
  if (query.includes("line")) return "line";
  if (query.includes("area")) return "area";
  if ((query.includes("horizontal") && query.includes("bar")) || query.includes("hbar")) return "horizontal-bar";
  if (query.includes("map")) return "treemap";
  return "bar";
}

function buildTopRoleDisruptionData(roles: ReturnType<typeof useDataStore.getState>["roles"]) {
  return [...roles]
    .sort((a, b) => b.agentic + b.generative + b.traditional - (a.agentic + a.generative + a.traditional))
    .slice(0, 15)
    .map((r) => ({ name: r.role, value: Math.round((r.agentic + r.generative + r.traditional) * 100) }));
}

function buildDepartmentAISplitData(roles: ReturnType<typeof useDataStore.getState>["roles"]) {
  const map = new Map<string, { agentic: number; generative: number; traditional: number; human: number; count: number }>();
  roles.forEach((r) => {
    const entry = map.get(r.department) ?? { agentic: 0, generative: 0, traditional: 0, human: 0, count: 0 };
    entry.agentic += r.agentic;
    entry.generative += r.generative;
    entry.traditional += r.traditional;
    entry.human += r.human;
    entry.count += 1;
    map.set(r.department, entry);
  });

  return [...map.entries()]
    .map(([name, value]) => ({
      name,
      agentic: Math.round((value.agentic / value.count) * 100),
      generative: Math.round((value.generative / value.count) * 100),
      traditional: Math.round((value.traditional / value.count) * 100),
      human: Math.round((value.human / value.count) * 100)
    }))
    .sort((a, b) => b.agentic + b.generative + b.traditional - (a.agentic + a.generative + a.traditional))
    .slice(0, 10);
}

function buildAISplitPieData(roles: ReturnType<typeof useDataStore.getState>["roles"]) {
  const totals = roles.reduce(
    (acc, r) => {
      acc.agentic += r.agentic;
      acc.generative += r.generative;
      acc.traditional += r.traditional;
      acc.human += r.human;
      return acc;
    },
    { agentic: 0, generative: 0, traditional: 0, human: 0 }
  );

  const grandTotal = totals.agentic + totals.generative + totals.traditional + totals.human || 1;
  return [
    { name: "Agentic", value: Math.round((totals.agentic / grandTotal) * 100) },
    { name: "Generative", value: Math.round((totals.generative / grandTotal) * 100) },
    { name: "Traditional", value: Math.round((totals.traditional / grandTotal) * 100) },
    { name: "Human", value: Math.round((totals.human / grandTotal) * 100) }
  ];
}

function buildClusterTreemapData(tasks: ReturnType<typeof useDataStore.getState>["tasks"]) {
  const map = new Map<string, number>();
  tasks.forEach((t) => {
    const key = t.clusterName?.trim() || "Uncategorized";
    map.set(key, (map.get(key) ?? 0) + 1);
  });

  return [...map.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 20);
}

export function PromptExplorerPage() {
  const roles = useDataStore((s) => s.roles);
  const tasks = useDataStore((s) => s.tasks);
  const [results, setResults] = useState<Result[]>([]);

  function ask(query: string) {
    const q = query.toLowerCase().trim();
    if (!q) return;

    const chartType = detectChartType(q);
    let result: Result;

    if (chartType === "treemap") {
      result = {
        id: crypto.randomUUID(),
        title: "Task Clusters by Task Count",
        subtitle: "Treemap sized by number of tasks in each cluster",
        chartType,
        data: buildClusterTreemapData(tasks)
      };
    } else if (chartType === "pie" || chartType === "donut") {
      result = {
        id: crypto.randomUUID(),
        title: "Overall Work Split by AI Type",
        subtitle: "Distribution of Agentic, Generative, Traditional and Human work",
        chartType,
        data: buildAISplitPieData(roles)
      };
    } else if (chartType === "stacked-bar" || chartType === "grouped-bar") {
      result = {
        id: crypto.randomUUID(),
        title: "AI Work Split by Department",
        subtitle: "Department-wise composition across AI and Human work",
        chartType,
        data: buildDepartmentAISplitData(roles)
      };
    } else if (chartType === "bubble" || chartType === "scatter") {
      result = {
        id: crypto.randomUUID(),
        title: "Role Distribution: AI Disruption vs Human Necessity",
        subtitle: chartType === "bubble" ? "Bubble size reflects FTE count" : "Scatter view by role",
        chartType,
        data: roles.slice(0, 40).map((r) => ({
          x: Math.round((r.agentic + r.generative + r.traditional) * 100),
          y: Math.round(r.human * 100),
          z: Math.max(4, r.fteCount),
          name: r.role
        }))
      };
    } else if (q.includes("department") && q.includes("agentic")) {
      const map = new Map<string, { sum: number; count: number }>();
      roles.forEach((r) => {
        const entry = map.get(r.department) ?? { sum: 0, count: 0 };
        entry.sum += r.agentic;
        entry.count += 1;
        map.set(r.department, entry);
      });

      const data = [...map.entries()]
        .map(([name, value]) => ({ name, value: Math.round((value.sum / value.count) * 100) }))
        .sort((a, b) => b.value - a.value);

      result = {
        id: crypto.randomUUID(),
        title: "Average Agentic AI Split by Department",
        subtitle: "Pre-canned chart response",
        chartType: chartType === "horizontal-bar" ? "horizontal-bar" : "bar",
        data
      };
    } else {
      result = {
        id: crypto.randomUUID(),
        title: "Top Roles by AI Disruption",
        subtitle: "Auto-generated response for your prompt",
        chartType,
        data: buildTopRoleDisruptionData(roles)
      };
    }

    setResults((prev) => [result, ...prev]);
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6">
      <h2 className="text-2xl font-bold text-[--wfa-text]">Prompt Explorer</h2>
      <p className="mb-4 text-sm text-[--wfa-text-secondary]">
        Ask any question about the workforce data. Only real data from your output files is shown.
      </p>

      <PromptChips onSelect={ask} />
      <PromptInput onAsk={ask} />

      {results.map((result) => (
        <PromptResult
          key={result.id}
          title={result.title}
          subtitle={result.subtitle}
          chartType={result.chartType}
          data={result.data}
        />
      ))}
    </div>
  );
}
