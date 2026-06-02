import Papa, { type ParseResult } from "papaparse";
import { aggregateRoleSummaries } from "./aggregations";
import type { RoleSummary, TaskRow } from "../types";

const REQUIRED_COLUMNS = [
  "Role",
  "Department",
  "Sub-Department",
  "Level",
  "FTE Count",
  "Task ID",
  "Hours",
  "Agentic AI Work Split",
  "Generative AI Work Split",
  "Traditional AI Work Split",
  "Human Work Split",
  "Cluster Name",
  "Super Cluster Name"
];

function asNumber(value: unknown): number {
  const num = Number(String(value ?? "").trim());
  return Number.isFinite(num) ? num : 0;
}

function normalizeRow(raw: Record<string, unknown>): TaskRow {
  return {
    role: String(raw["Role"] ?? "").trim(),
    department: String(raw["Department"] ?? "").trim(),
    subDepartment: String(raw["Sub-Department"] ?? "").trim(),
    level: String(raw["Level"] ?? "").trim(),
    fteCount: asNumber(raw["FTE Count"]),
    contingentCount: asNumber(raw["Contingent Count"]),
    taskId: String(raw["Task ID"] ?? "").trim(),
    taskDescription: String(raw["Task Description"] ?? raw["Task"] ?? "").trim(),
    hours: asNumber(raw["Hours"]),
    agentic: asNumber(raw["Agentic AI Work Split"]),
    generative: asNumber(raw["Generative AI Work Split"]),
    traditional: asNumber(raw["Traditional AI Work Split"]),
    human: asNumber(raw["Human Work Split"]),
    clusterName: String(raw["Cluster Name"] ?? "").trim(),
    superClusterName: String(raw["Super Cluster Name"] ?? "").trim(),
    riskAgentic: String(raw["Risk Agentic AI"] ?? "").trim(),
    riskGenerative: String(raw["Risk Generative AI"] ?? "").trim(),
    riskTraditional: String(raw["Risk Traditional AI"] ?? "").trim()
  };
}

export interface ParsedDataset {
  tasks: TaskRow[];
  roles: RoleSummary[];
  fileName: string;
}

export async function parseCsvText(text: string, fileName: string): Promise<ParsedDataset> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, unknown>>(text, {
      header: true,
      skipEmptyLines: true,
      complete: (result: ParseResult<Record<string, unknown>>) => {
        const fields = result.meta.fields ?? [];
        const missing = REQUIRED_COLUMNS.filter((column) => !fields.includes(column));
        if (missing.length > 0) {
          reject(new Error(`Missing required columns: ${missing.join(", ")}`));
          return;
        }

        const tasks = result.data
          .map(normalizeRow)
          .filter((row: TaskRow) => row.role && row.department && row.taskId);

        const roles = aggregateRoleSummaries(tasks);
        resolve({ tasks, roles, fileName });
      },
      error: (error: Error) => reject(error)
    });
  });
}
