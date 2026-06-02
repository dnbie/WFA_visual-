import { create } from "zustand";
import type { AIType } from "../types";

interface FilterState {
  department: string;
  subDepartment: string;
  role: string;
  level: string;
  activeAIType: AIType;
  setDepartment: (value: string) => void;
  setSubDepartment: (value: string) => void;
  setRole: (value: string) => void;
  setLevel: (value: string) => void;
  setActiveAIType: (value: AIType) => void;
  resetAll: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  department: "All",
  subDepartment: "All",
  role: "All",
  level: "All",
  activeAIType: "all",
  setDepartment: (value) => set({ department: value, subDepartment: "All", role: "All", level: "All" }),
  setSubDepartment: (value) => set({ subDepartment: value, role: "All", level: "All" }),
  setRole: (value) => set({ role: value, level: "All" }),
  setLevel: (value) => set({ level: value }),
  setActiveAIType: (value) => set((state) => ({ activeAIType: state.activeAIType === value ? "all" : value })),
  resetAll: () => set({ department: "All", subDepartment: "All", role: "All", level: "All", activeAIType: "all" })
}));
