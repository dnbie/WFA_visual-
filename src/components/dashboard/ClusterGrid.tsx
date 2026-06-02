import { useMemo } from "react";
import type { RoleSummary } from "../../types";

interface ClusterGridProps {
  rows: RoleSummary[];
}

export function ClusterGrid({ rows }: ClusterGridProps) {
  const clusters = useMemo(() => {
    const map = new Map<string, number>();
    rows.forEach((row) => {
      Object.entries(row.clusterCounts).forEach(([name, count]) => {
        map.set(name, (map.get(name) ?? 0) + count);
      });
    });

    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);
  }, [rows]);

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {clusters.map(([name, count]) => (
        <div key={name} className="rounded-lg border border-[--wfa-border] bg-white p-2 text-xs">
          <div className="font-semibold text-[--wfa-text]">{name}</div>
          <div className="text-[--wfa-text-muted]">{count} tasks</div>
        </div>
      ))}
    </div>
  );
}
