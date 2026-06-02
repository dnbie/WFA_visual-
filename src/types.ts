export type AIType = "all" | "agentic" | "generative" | "traditional" | "human";

export interface TaskRow {
  role: string;
  department: string;
  subDepartment: string;
  level: string;
  fteCount: number;
  contingentCount: number;
  taskId: string;
  taskDescription: string;
  hours: number;
  agentic: number;
  generative: number;
  traditional: number;
  human: number;
  clusterName: string;
  superClusterName: string;
  riskAgentic: string;
  riskGenerative: string;
  riskTraditional: string;
}

export interface RoleSummary {
  key: string;
  role: string;
  department: string;
  subDepartment: string;
  level: string;
  fteCount: number;
  taskCount: number;
  totalHours: number;
  agentic: number;
  generative: number;
  traditional: number;
  human: number;
  clusterCounts: Record<string, number>;
  riskAgentic: string[];
  riskGenerative: string[];
  riskTraditional: string[];
}

export interface DashboardSectionConfig {
  enabled: boolean;
  chartType: string;
}
