import { useMemo, useState } from "react";
import type { AIType, RoleSummary } from "../../types";
import { SplitBar } from "./charts/SplitBar";

type SortKey = "role" | "department" | "level" | "fteCount" | "taskCount" | "human" | "agentic" | "generative" | "traditional";

interface RoleTableProps {
  rows: RoleSummary[];
  activeAIType: AIType;
}

export function RoleTable({ rows, activeAIType }: RoleTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("role");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const sortedRows = useMemo(() => {
    const cloned = [...rows];
    cloned.sort((a, b) => {
      const multiplier = sortDir === "asc" ? 1 : -1;
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return aVal.localeCompare(bVal) * multiplier;
      }
      return (Number(aVal) - Number(bVal)) * multiplier;
    });
    return cloned;
  }, [rows, sortDir, sortKey]);

  function applySort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDir("asc");
  }

  const columnClass = (k: Exclude<AIType, "all">) =>
    activeAIType === "all" || activeAIType === k ? "" : "opacity-30";

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[980px] border-collapse text-xs">
        <thead>
          <tr className="bg-[--wfa-text] text-white">
            <th className="cursor-pointer p-2 text-left" onClick={() => applySort("role")}>Role</th>
            <th className="cursor-pointer p-2 text-left" onClick={() => applySort("department")}>Dept</th>
            <th className="cursor-pointer p-2 text-left" onClick={() => applySort("level")}>Level</th>
            <th className="cursor-pointer p-2 text-left" onClick={() => applySort("fteCount")}>FTE</th>
            <th className="cursor-pointer p-2 text-left" onClick={() => applySort("taskCount")}>Tasks</th>
            <th className="p-2 text-left">Split</th>
            <th className="cursor-pointer p-2 text-left" onClick={() => applySort("human")}>Human%</th>
            <th className="cursor-pointer p-2 text-left" onClick={() => applySort("agentic")}>Agentic%</th>
            <th className="cursor-pointer p-2 text-left" onClick={() => applySort("generative")}>GenAI%</th>
            <th className="cursor-pointer p-2 text-left" onClick={() => applySort("traditional")}>Trad AI%</th>
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, i) => (
            <tr key={row.key} className={i % 2 ? "bg-[#FAFAFA]" : "bg-white"}>
              <td className="p-2">{row.role}</td>
              <td className="p-2">{row.department}</td>
              <td className="p-2">{row.level}</td>
              <td className="p-2">{Math.round(row.fteCount)}</td>
              <td className="p-2">{row.taskCount}</td>
              <td className="p-2">
                <SplitBar
                  activeAIType={activeAIType}
                  agentic={row.agentic}
                  generative={row.generative}
                  traditional={row.traditional}
                  human={row.human}
                />
              </td>
              <td className={`p-2 ${columnClass("human")}`}>{Math.round(row.human * 100)}%</td>
              <td className={`p-2 ${columnClass("agentic")}`}>{Math.round(row.agentic * 100)}%</td>
              <td className={`p-2 ${columnClass("generative")}`}>{Math.round(row.generative * 100)}%</td>
              <td className={`p-2 ${columnClass("traditional")}`}>{Math.round(row.traditional * 100)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
