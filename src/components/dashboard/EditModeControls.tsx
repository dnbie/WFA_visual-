interface EditModeControlsProps {
  editMode: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export function EditModeControls({ editMode, onEdit, onSave, onCancel }: EditModeControlsProps) {
  if (!editMode) {
    return (
      <button
        type="button"
        className="rounded-md border border-[--wfa-border] bg-white px-3 py-1.5 text-xs font-semibold text-[--wfa-text-secondary]"
        onClick={onEdit}
      >
        Edit layout
      </button>
    );
  }

  return (
    <div className="flex gap-2">
      <button type="button" className="rounded-md bg-[--wfa-green] px-3 py-1.5 text-xs font-semibold text-white" onClick={onSave}>
        Save
      </button>
      <button
        type="button"
        className="rounded-md border border-[--wfa-border] bg-white px-3 py-1.5 text-xs font-semibold text-[--wfa-text-secondary]"
        onClick={onCancel}
      >
        Cancel
      </button>
    </div>
  );
}
