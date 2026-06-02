import type { RoleSummary, TaskRow } from "../types";

function avg(items: number[]): number {
  if (!items.length) return 0;
  return items.reduce((a, b) => a + b, 0) / items.length;
}

export function aggregateRoleSummaries(taskRows: TaskRow[]): RoleSummary[] {
  const roleMap = new Map<string, RoleSummary>();

  taskRows.forEach((row) => {
    const key = [row.role, row.department, row.subDepartment, row.level].join("__");
    const weight = row.hours > 0 ? row.hours : 1;

    if (!roleMap.has(key)) {
      roleMap.set(key, {
        key,
        role: row.role,
        department: row.department,
        subDepartment: row.subDepartment,
        level: row.level,
        fteCount: row.fteCount,
        taskCount: 0,
        totalHours: 0,
        agentic: 0,
        generative: 0,
        traditional: 0,
        human: 0,
        clusterCounts: {},
        riskAgentic: [],
        riskGenerative: [],
        riskTraditional: []
      });
    }

    const summary = roleMap.get(key)!;
    summary.taskCount += 1;
    summary.totalHours += row.hours;
    summary.fteCount = Math.max(summary.fteCount, row.fteCount);

    summary.agentic += row.agentic * weight;
    summary.generative += row.generative * weight;
    summary.traditional += row.traditional * weight;
    summary.human += row.human * weight;

    const cluster = row.superClusterName || row.clusterName || "Unassigned";
    summary.clusterCounts[cluster] = (summary.clusterCounts[cluster] ?? 0) + 1;

    if (row.riskAgentic) summary.riskAgentic.push(row.riskAgentic);
    if (row.riskGenerative) summary.riskGenerative.push(row.riskGenerative);
    if (row.riskTraditional) summary.riskTraditional.push(row.riskTraditional);
  });

  return [...roleMap.values()].map((item) => {
    const denom = item.totalHours > 0 ? item.totalHours : item.taskCount || 1;
    return {
      ...item,
      agentic: item.agentic / denom,
      generative: item.generative / denom,
      traditional: item.traditional / denom,
      human: item.human / denom
    };
  });
}

export function summarizeRiskLevels(values: string[]): "Low" | "Medium" | "High" {
  const text = values.join(" ").toLowerCase();
  const high = (text.match(/high|severe|critical|major/g) ?? []).length;
  const medium = (text.match(/medium|moderate|elevated/g) ?? []).length;
  if (high >= 4) return "High";
  if (high > 0 || medium >= 3) return "Medium";
  return "Low";
}

export function averageSplitByGroup(rows: RoleSummary[], groupKey: keyof RoleSummary) {
  const map = new Map<string, { count: number; agentic: number; generative: number; traditional: number; human: number }>();

  rows.forEach((row) => {
    const label = String(row[groupKey] ?? "Unknown");
    if (!map.has(label)) {
      map.set(label, { count: 0, agentic: 0, generative: 0, traditional: 0, human: 0 });
    }
    const current = map.get(label)!;
    current.count += 1;
    current.agentic += row.agentic;
    current.generative += row.generative;
    current.traditional += row.traditional;
    current.human += row.human;
  });

  return [...map.entries()].map(([label, v]) => ({
    label,
    agentic: v.agentic / v.count,
    generative: v.generative / v.count,
    traditional: v.traditional / v.count,
    human: v.human / v.count
  }));
}

export function getKpis(rows: RoleSummary[]) {
  const totalFte = rows.reduce((sum, r) => sum + r.fteCount, 0);
  const avgHuman = avg(rows.map((r) => r.human));
  const avgAi = avg(rows.map((r) => r.agentic + r.generative + r.traditional));
  const clusters = new Set<string>();
  rows.forEach((r) => Object.keys(r.clusterCounts).forEach((c) => clusters.add(c)));

  return {
    totalFte,
    avgHuman,
    avgAi,
    roles: rows.length,
    clusters: clusters.size
  };
}
