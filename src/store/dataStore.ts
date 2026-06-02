import { create } from "zustand";
import type { RoleSummary, TaskRow } from "../types";

interface DataStoreState {
  tasks: TaskRow[];
  roles: RoleSummary[];
  fileName: string | null;
  loadedAt: string | null;
  setDataset: (payload: { tasks: TaskRow[]; roles: RoleSummary[]; fileName: string }) => void;
  clearDataset: () => void;
}

export const useDataStore = create<DataStoreState>((set) => ({
  tasks: [],
  roles: [],
  fileName: null,
  loadedAt: null,
  setDataset: ({ tasks, roles, fileName }) =>
    set({ tasks, roles, fileName, loadedAt: new Date().toISOString() }),
  clearDataset: () => set({ tasks: [], roles: [], fileName: null, loadedAt: null })
}));
