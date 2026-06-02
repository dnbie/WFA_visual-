import { create } from "zustand";
import { persist } from "zustand/middleware";

export const defaultLayoutOrder = [
  "ai-split",
  "top-disrupted",
  "opportunity-quadrant",
  "work-split",
  "dept-split",
  "level-split",
  "subdept-split",
  "role-table",
  "clusters",
  "risk",
  "hours-role"
];

interface LayoutState {
  order: string[];
  editMode: boolean;
  draftOrder: string[];
  setEditMode: (mode: boolean) => void;
  setDraftOrder: (order: string[]) => void;
  saveDraft: () => void;
  cancelDraft: () => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      order: [...defaultLayoutOrder],
      draftOrder: [...defaultLayoutOrder],
      editMode: false,
      setEditMode: (mode) =>
        set((state) => ({
          editMode: mode,
          draftOrder: mode ? [...state.order] : state.draftOrder
        })),
      setDraftOrder: (order) => set({ draftOrder: order }),
      saveDraft: () => set((state) => ({ order: [...state.draftOrder], editMode: false })),
      cancelDraft: () => set((state) => ({ draftOrder: [...state.order], editMode: false }))
    }),
    {
      name: "wfa_layout_v1",
      partialize: (state) => ({ order: state.order })
    }
  )
);
