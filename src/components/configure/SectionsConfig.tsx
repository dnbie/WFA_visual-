import { sectionDefinitions, useConfigStore } from "../../store/configStore";

export function SectionsConfig() {
  const sections = useConfigStore((s) => s.sections);
  const setSectionEnabled = useConfigStore((s) => s.setSectionEnabled);
  const setSectionChartType = useConfigStore((s) => s.setSectionChartType);

  return (
    <div className="space-y-3">
      {sectionDefinitions.map((section) => {
        const sectionState = sections[section.id];
        return (
          <div key={section.id} className="flex items-center gap-3 rounded-xl border border-[--wfa-border] bg-white p-4">
            <button
              type="button"
              aria-label={`Toggle ${section.title}`}
              className={[
                "relative h-6 w-11 rounded-full transition",
                sectionState.enabled ? "bg-[--wfa-green]" : "bg-gray-300"
              ].join(" ")}
              onClick={() => setSectionEnabled(section.id, !sectionState.enabled)}
            >
              <span
                className={[
                  "absolute top-0.5 h-5 w-5 rounded-full bg-white transition",
                  sectionState.enabled ? "left-[22px]" : "left-0.5"
                ].join(" ")}
              />
            </button>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-[--wfa-text]">{section.title}</h3>
            </div>
            {section.chartTypes.length > 0 && (
              <select
                className="rounded-md border border-[--wfa-border] px-2 py-1 text-sm"
                value={sectionState.chartType}
                onChange={(e) => setSectionChartType(section.id, e.target.value)}
              >
                {section.chartTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            )}
          </div>
        );
      })}
    </div>
  );
}
