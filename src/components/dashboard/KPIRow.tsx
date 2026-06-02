interface KPIRowProps {
  totalFte: number;
  avgHuman: number;
  avgAi: number;
  roles: number;
  clusters: number;
}

const cardStyles = [
  "border-t-[4px] border-t-[--wfa-green]",
  "border-t-[4px] border-t-[--wfa-teal]",
  "border-t-[4px] border-t-[--wfa-orange]",
  "border-t-[4px] border-t-[--wfa-purple]",
  "border-t-[4px] border-t-[--wfa-green]"
];

export function KPIRow({ totalFte, avgHuman, avgAi, roles, clusters }: KPIRowProps) {
  const items = [
    { label: "Total FTE", value: Math.round(totalFte).toLocaleString() },
    { label: "Avg Human Work Split", value: `${Math.round(avgHuman * 100)}%` },
    { label: "Total AI Automatable", value: `${Math.round(avgAi * 100)}%` },
    { label: "Roles Analyzed", value: String(roles) },
    { label: "Task Clusters", value: String(clusters) }
  ];

  return (
    <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {items.map((item, idx) => (
        <div key={item.label} className={`rounded-xl border border-[--wfa-border] bg-white p-4 ${cardStyles[idx]}`}>
          <div className="text-2xl font-bold text-[--wfa-text]">{item.value}</div>
          <div className="text-xs font-semibold uppercase tracking-wide text-[--wfa-text-muted]">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
