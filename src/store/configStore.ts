import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DashboardSectionConfig } from "../types";

export const sectionDefinitions = [
  { id: "kpi", title: "KPI Summary", chartTypes: [] as string[] },
  { id: "distribution", title: "Disruption Distribution", chartTypes: ["Donut Chart", "Bar Chart"] },
  { id: "topDisrupted", title: "Top Disrupted Roles", chartTypes: ["Horizontal Bar", "Table"] },
  { id: "quadrant", title: "Opportunity Quadrant", chartTypes: ["Scatter", "Bubble"] },
  { id: "workSplit", title: "Work Split Breakdown", chartTypes: ["Stacked Bar", "Grouped Bar"] },
  { id: "aiDept", title: "AI Split by Department", chartTypes: ["Stacked Bar"] },
  { id: "aiLevel", title: "AI Adoption by Level", chartTypes: ["Horizontal Stacked Bar"] },
  { id: "roleTable", title: "Role Detail Table", chartTypes: [] as string[] },
  { id: "clusters", title: "Task Clusters", chartTypes: [] as string[] },
  { id: "risk", title: "Risk Assessment", chartTypes: [] as string[] },
  { id: "hours", title: "Hours-Weighted Distribution", chartTypes: ["Horizontal Stacked Bar"] }
];

export const defaultTerminology: Record<string, string> = {
  "AI Disruption": "AI Disruption",
  "Human Necessity": "Human Necessity",
  "Agentic AI": "Agentic AI",
  "Generative AI": "Generative AI",
  "Traditional AI": "Traditional AI",
  "Human Work": "Human Work",
  "Time Savings": "Time Savings",
  "Disruption Score": "Disruption Score",
  Department: "Department",
  "Sub-Department": "Sub-Department",
  Role: "Role",
  Task: "Task",
  Cluster: "Cluster",
  "Super Cluster": "Super Cluster"
};

function getDefaultSections(): Record<string, DashboardSectionConfig> {
  return sectionDefinitions.reduce<Record<string, DashboardSectionConfig>>((acc, section) => {
    acc[section.id] = {
      enabled: true,
      chartType: section.chartTypes[0] ?? ""
    };
    return acc;
  }, {});
}

interface ConfigState {
  clientName: string;
  sections: Record<string, DashboardSectionConfig>;
  terminology: Record<string, string>;
  setClientName: (value: string) => void;
  setSectionEnabled: (id: string, enabled: boolean) => void;
  setSectionChartType: (id: string, chartType: string) => void;
  setTerm: (key: string, value: string) => void;
  resetAll: () => void;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      clientName: "[Client Name]",
      sections: getDefaultSections(),
      terminology: { ...defaultTerminology },
      setClientName: (value) => set({ clientName: value }),
      setSectionEnabled: (id, enabled) =>
        set((state) => ({
          sections: {
            ...state.sections,
            [id]: { ...state.sections[id], enabled }
          }
        })),
      setSectionChartType: (id, chartType) =>
        set((state) => ({
          sections: {
            ...state.sections,
            [id]: { ...state.sections[id], chartType }
          }
        })),
      setTerm: (key, value) =>
        set((state) => ({
          terminology: {
            ...state.terminology,
            [key]: value || defaultTerminology[key]
          }
        })),
      resetAll: () =>
        set({
          clientName: "[Client Name]",
          sections: getDefaultSections(),
          terminology: { ...defaultTerminology }
        })
    }),
    {
      name: "wfa_config_v1"
    }
  )
);
