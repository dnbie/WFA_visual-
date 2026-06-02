import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

interface DraggableCardProps {
  id: string;
  full?: boolean;
  editMode: boolean;
  title: string;
  children: React.ReactNode;
}

export function DraggableCard({ id, full, editMode, title, children }: DraggableCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.45 : 1
  };

  return (
    <section
      ref={setNodeRef}
      style={style}
      className={[
        "rounded-xl border border-[--wfa-border] bg-white",
        full ? "lg:col-span-2" : "",
        editMode ? "cursor-grab" : ""
      ].join(" ")}
      {...(editMode ? attributes : {})}
      {...(editMode ? listeners : {})}
    >
      <header className="flex items-center justify-between border-b border-[--wfa-border] px-4 py-3">
        <h3 className="text-sm font-bold text-[--wfa-text]">{title}</h3>
        {editMode && <span className="text-sm text-[--wfa-green]">⠿</span>}
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}
