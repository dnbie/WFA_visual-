import { useState } from "react";
import { SectionsConfig } from "../components/configure/SectionsConfig";
import { TerminologyConfig } from "../components/configure/TerminologyConfig";
import { useConfigStore } from "../store/configStore";

export function ConfigurePage() {
  const [tab, setTab] = useState<"sections" | "terms">("sections");
  const resetAll = useConfigStore((s) => s.resetAll);

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[--wfa-text]">Configure</h2>
          <p className="text-sm text-[--wfa-text-secondary]">Customize dashboard sections, chart types, and terminology.</p>
        </div>
        <button
          type="button"
          className="rounded-lg border border-[#f3cdc8] bg-white px-4 py-2 text-sm font-semibold text-[--wfa-red]"
          onClick={resetAll}
        >
          Reset all
        </button>
      </div>

      <div className="mb-4 flex border-b-2 border-[--wfa-border]">
        <button
          type="button"
          className={[
            "-mb-0.5 border-b-2 px-4 py-2 text-sm font-semibold",
            tab === "sections"
              ? "border-[--wfa-green] text-[--wfa-green]"
              : "border-transparent text-[--wfa-text-secondary]"
          ].join(" ")}
          onClick={() => setTab("sections")}
        >
          Sections
        </button>
        <button
          type="button"
          className={[
            "-mb-0.5 border-b-2 px-4 py-2 text-sm font-semibold",
            tab === "terms"
              ? "border-[--wfa-green] text-[--wfa-green]"
              : "border-transparent text-[--wfa-text-secondary]"
          ].join(" ")}
          onClick={() => setTab("terms")}
        >
          Terminology
        </button>
      </div>

      {tab === "sections" ? <SectionsConfig /> : <TerminologyConfig />}
    </div>
  );
}
