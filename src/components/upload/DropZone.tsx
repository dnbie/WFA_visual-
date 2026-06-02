import { useRef, useState } from "react";

interface DropZoneProps {
  onFileSelected: (file: File) => void;
}

export function DropZone({ onFileSelected }: DropZoneProps) {
  const [active, setActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={[
        "mx-auto max-w-3xl cursor-pointer rounded-xl border-2 border-dashed bg-white p-10 text-center transition",
        active ? "border-[--wfa-green] bg-[--wfa-green-light]/30" : "border-[--wfa-border] hover:border-[--wfa-green]"
      ].join(" ")}
      onClick={() => inputRef.current?.click()}
      onDragEnter={(e) => {
        e.preventDefault();
        setActive(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setActive(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setActive(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file) onFileSelected(file);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelected(file);
        }}
      />
      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-[--wfa-green-light] text-2xl font-semibold text-[--wfa-green]">
        CSV
      </div>
      <h3 className="text-base font-semibold text-[--wfa-text]">Drop your WFA CSV file here</h3>
      <p className="mt-1 text-sm text-[--wfa-text-muted]">or click to browse. Required schema validation is applied automatically.</p>
    </div>
  );
}
