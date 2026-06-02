import { useMemo } from "react";
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { AITypeFilter } from "../components/dashboard/AITypeFilter";
import { CascadingFilters } from "../components/dashboard/CascadingFilters";
import { EditModeControls } from "../components/dashboard/EditModeControls";
import { KPIRow } from "../components/dashboard/KPIRow";
import { DraggableCard } from "../components/dashboard/DraggableCard";
import { DonutChart } from "../components/dashboard/charts/DonutChart";
import { HorizontalBarChart } from "../components/dashboard/charts/HorizontalBarChart";
import { OpportunityScatterChart } from "../components/dashboard/charts/ScatterChart";
import { StackedBarChart } from "../components/dashboard/charts/StackedBarChart";
import { RoleTable } from "../components/dashboard/RoleTable";
import { ClusterGrid } from "../components/dashboard/ClusterGrid";
import { RiskAssessment } from "../components/dashboard/RiskAssessment";
import { useDataStore } from "../store/dataStore";
import { useFilterStore } from "../store/filterStore";
import { useLayoutStore } from "../store/layoutStore";
import { useConfigStore } from "../store/configStore";
import { averageSplitByGroup, getKpis } from "../utils/aggregations";
import { getAIColor } from "../utils/colors";
import type { AIType, RoleSummary } from "../types";

const ALL_CARD_IDS = [
  "ai-split",
  "top-disrupted",
  "risk",
  "opportunity-quadrant",
  "work-split",
  "dept-split",
  "level-split",
  "subdept-split",
  "role-table",
  "clusters",
  "hours-role"
];

const CARD_TO_SECTION: Record<string, string> = {
  "ai-split": "distribution",
  "top-disrupted": "topDisrupted",
  "opportunity-quadrant": "quadrant",
  "work-split": "workSplit",
  "dept-split": "aiDept",
  "level-split": "aiLevel",
  "subdept-split": "workSplit",
  "role-table": "roleTable",
  clusters: "clusters",
  risk: "risk",
  "hours-role": "hours"
};

const FULL_WIDTH_CARDS = new Set(["role-table", "hours-role"]);

function cardTitleMap(id: string): string {
  const map: Record<string, string> = {
    "ai-split": "AI Work Split Distribution",
    "top-disrupted": "Top Disrupted Roles",
    "opportunity-quadrant": "Opportunity Quadrant",
    "work-split": "Work Split Breakdown",
    "dept-split": "AI Split by Department",
    "level-split": "AI Adoption Potential by Level",
    "subdept-split": "Human vs AI Split by Sub-Department",
    "role-table": "Role-Level AI Work Split Table",
    clusters: "Top Super Clusters",
    risk: "Risk Assessment Summary",
    "hours-role": "Hours-Weighted AI Type Distribution by Role"
  };
  return map[id] ?? id;
}

function getAIMetric(row: RoleSummary, active: AIType): number {
  if (active === "agentic") return row.agentic;
  if (active === "generative") return row.generative;
  if (active === "traditional") return row.traditional;
  if (active === "human") return row.human;
  return row.agentic + row.generative + row.traditional;
}

export function DashboardPage() {
  const roles = useDataStore((s) => s.roles);
  const filter = useFilterStore();
  const layout = useLayoutStore();
  const config = useConfigStore();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const normalizedDraftOrder = useMemo(() => {
    const merged = [...layout.draftOrder, ...ALL_CARD_IDS.filter((id) => !layout.draftOrder.includes(id))];
    return merged.filter((id) => ALL_CARD_IDS.includes(id));
  }, [layout.draftOrder]);

  const visibleOrder = useMemo(() => {
    const enabledCards = normalizedDraftOrder.filter((cardId) => {
      const sectionId = CARD_TO_SECTION[cardId];
      if (!sectionId) return true;
      return config.sections[sectionId]?.enabled !== false;
    });

    if (!enabledCards.includes("risk")) return enabledCards;

    const cardsWithoutRisk = enabledCards.filter((id) => id !== "risk");
    cardsWithoutRisk.splice(2, 0, "risk");
    return cardsWithoutRisk;
  }, [normalizedDraftOrder, config.sections]);

  const filteredRows = useMemo(() => {
    return roles.filter((r) => {
      if (filter.department !== "All" && r.department !== filter.department) return false;
      if (filter.subDepartment !== "All" && r.subDepartment !== filter.subDepartment) return false;
      if (filter.role !== "All" && r.role !== filter.role) return false;
      if (filter.level !== "All" && r.level !== filter.level) return false;
      return true;
    });
  }, [roles, filter.department, filter.subDepartment, filter.role, filter.level]);

  const kpis = getKpis(filteredRows);

  const deptData = averageSplitByGroup(filteredRows, "department").map((x) => ({
    ...x,
    agentic: Math.round(x.agentic * 100),
    generative: Math.round(x.generative * 100),
    traditional: Math.round(x.traditional * 100),
    human: Math.round(x.human * 100)
  }));

  const levelData = averageSplitByGroup(filteredRows, "level").map((x) => ({
    ...x,
    agentic: Math.round(x.agentic * 100),
    generative: Math.round(x.generative * 100),
    traditional: Math.round(x.traditional * 100),
    human: Math.round(x.human * 100)
  }));

  const subDeptData = averageSplitByGroup(filteredRows, "subDepartment").map((x) => ({
    ...x,
    agentic: Math.round(x.agentic * 100),
    generative: Math.round(x.generative * 100),
    traditional: Math.round(x.traditional * 100),
    human: Math.round(x.human * 100)
  }));

  const deptPieData = deptData
    .map((d) => ({
      name: d.label,
      value: d.agentic + d.generative + d.traditional
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const levelLineData = levelData.map((d) => ({
    label: d.label,
    shortLabel: d.label.replace(/\s*\(.*?\)/g, ""),
    agentic: d.agentic,
    generative: d.generative,
    traditional: d.traditional,
    human: d.human
  }));

  const subDeptAreaData = subDeptData
    .map((d) => ({
      label: d.label,
      ai: d.agentic + d.generative + d.traditional,
      human: d.human
    }))
    .sort((a, b) => b.ai - a.ai)
    .slice(0, 10);

  const avgAgentic = filteredRows.length ? filteredRows.reduce((s, r) => s + r.agentic, 0) / filteredRows.length : 0;
  const avgGenerative = filteredRows.length ? filteredRows.reduce((s, r) => s + r.generative, 0) / filteredRows.length : 0;
  const avgTraditional = filteredRows.length ? filteredRows.reduce((s, r) => s + r.traditional, 0) / filteredRows.length : 0;
  const avgHuman = filteredRows.length ? filteredRows.reduce((s, r) => s + r.human, 0) / filteredRows.length : 0;

  const donutData = [
    { key: "agentic" as const, name: config.terminology["Agentic AI"], value: Math.round(avgAgentic * 100) },
    { key: "generative" as const, name: config.terminology["Generative AI"], value: Math.round(avgGenerative * 100) },
    { key: "traditional" as const, name: config.terminology["Traditional AI"], value: Math.round(avgTraditional * 100) },
    { key: "human" as const, name: config.terminology["Human Work"], value: Math.round(avgHuman * 100) }
  ];

  const topHoursRoles = [...filteredRows]
    .sort((a, b) => b.totalHours - a.totalHours)
    .slice(0, 15)
    .map((r) => ({
      label: r.role,
      agentic: Math.round(r.agentic * 100),
      generative: Math.round(r.generative * 100),
      traditional: Math.round(r.traditional * 100),
      human: Math.round(r.human * 100)
    }));

  const topDisruptedRoles = [...filteredRows]
    .sort((a, b) => getAIMetric(b, filter.activeAIType) - getAIMetric(a, filter.activeAIType))
    .slice(0, 15)
    .map((r) => ({
      role: r.role,
      score: Math.round(getAIMetric(r, filter.activeAIType) * 100)
    }));

  const quadrantPoints = filteredRows.slice(0, 70).map((row) => ({
    x: Math.round((row.agentic + row.generative + row.traditional) * 100),
    y: Math.round(row.human * 100),
    z: Math.max(4, Math.min(30, row.fteCount * 2)),
    name: row.role
  }));

  const distributionChartType = config.sections.distribution?.chartType ?? "Donut Chart";
  const topDisruptedChartType = config.sections.topDisrupted?.chartType ?? "Horizontal Bar";
  const quadrantChartType = config.sections.quadrant?.chartType ?? "Scatter";
  const workSplitChartType = config.sections.workSplit?.chartType ?? "Stacked Bar";

  function onDragEnd(event: DragEndEvent) {
    if (!layout.editMode) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = normalizedDraftOrder.indexOf(String(active.id));
    const newIndex = normalizedDraftOrder.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    layout.setDraftOrder(arrayMove(normalizedDraftOrder, oldIndex, newIndex));
  }

  function renderCard(id: string) {
    switch (id) {
      case "ai-split":
        return (
          <DraggableCard id={id} editMode={layout.editMode} title={cardTitleMap(id)}>
            {distributionChartType === "Bar Chart" ? (
              <StackedBarChart
                data={[
                  {
                    label: "Average",
                    agentic: Math.round(avgAgentic * 100),
                    generative: Math.round(avgGenerative * 100),
                    traditional: Math.round(avgTraditional * 100),
                    human: Math.round(avgHuman * 100)
                  }
                ]}
                activeAIType={filter.activeAIType}
              />
            ) : (
              <DonutChart data={donutData} activeAIType={filter.activeAIType} onLegendClick={(key) => filter.setActiveAIType(key)} />
            )}
          </DraggableCard>
        );

      case "top-disrupted":
        return (
          <DraggableCard id={id} editMode={layout.editMode} title={cardTitleMap(id)}>
            {topDisruptedChartType === "Table" ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[--wfa-border] text-left text-[--wfa-text-muted]">
                      <th className="py-2">Role</th>
                      <th className="py-2">Disruption Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topDisruptedRoles.map((row) => (
                      <tr key={row.role} className="border-b border-[--wfa-border] last:border-0">
                        <td className="py-2 text-[--wfa-text]">{row.role}</td>
                        <td className="py-2 font-semibold text-[--wfa-text]">{row.score}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer>
                  <BarChart data={topDisruptedRoles} layout="vertical" margin={{ left: 8, right: 18 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(v) => `${v}%`} />
                    <YAxis type="category" dataKey="role" width={180} />
                    <Tooltip formatter={(value) => `${String(value ?? 0)}%`} />
                    <Bar
                      dataKey="score"
                      fill={getAIColor(filter.activeAIType === "all" ? "agentic" : filter.activeAIType, filter.activeAIType)}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </DraggableCard>
        );

      case "opportunity-quadrant":
        return (
          <DraggableCard id={id} editMode={layout.editMode} title={cardTitleMap(id)}>
            <OpportunityScatterChart data={quadrantPoints} bubble={quadrantChartType === "Bubble"} />
          </DraggableCard>
        );

      case "work-split":
        return (
          <DraggableCard id={id} editMode={layout.editMode} title={cardTitleMap(id)}>
            <StackedBarChart
              data={deptData.map((d) => ({ ...d, label: d.label }))}
              activeAIType={filter.activeAIType}
              grouped={workSplitChartType === "Grouped Bar"}
            />
          </DraggableCard>
        );

      case "dept-split":
        return (
          <DraggableCard id={id} editMode={layout.editMode} title={cardTitleMap(id)}>
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={deptPieData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={95}>
                    {deptPieData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={[
                          "#86BC25",
                          "#00A3E0",
                          "#0D8390",
                          "#404040",
                          "#6FA845",
                          "#208AB5",
                          "#5E6F7A",
                          "#9CB45B"
                        ][index % 8]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${String(value ?? 0)}% AI automatable`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </DraggableCard>
        );

      case "level-split":
        return (
          <DraggableCard id={id} editMode={layout.editMode} title={cardTitleMap(id)}>
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <LineChart data={levelLineData} margin={{ top: 8, right: 16, left: 4, bottom: 42 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="shortLabel"
                    angle={-12}
                    textAnchor="end"
                    interval={0}
                    height={72}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tickFormatter={(v) => `${v}%`} />
                  <Tooltip labelFormatter={(_, payload) => payload?.[0]?.payload?.label ?? ""} formatter={(value) => `${String(value ?? 0)}%`} />
                  <Legend verticalAlign="top" align="center" wrapperStyle={{ paddingBottom: 8 }} />
                  <Line type="monotone" dataKey="agentic" stroke={getAIColor("agentic", filter.activeAIType)} strokeWidth={2} dot={false} />
                  <Line
                    type="monotone"
                    dataKey="generative"
                    stroke={getAIColor("generative", filter.activeAIType)}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="traditional"
                    stroke={getAIColor("traditional", filter.activeAIType)}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line type="monotone" dataKey="human" stroke={getAIColor("human", filter.activeAIType)} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </DraggableCard>
        );

      case "subdept-split":
        return (
          <DraggableCard id={id} editMode={layout.editMode} title={cardTitleMap(id)}>
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <AreaChart data={subDeptAreaData} margin={{ top: 8, right: 16, left: 4, bottom: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" angle={-20} textAnchor="end" interval={0} height={58} />
                  <YAxis tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(value) => `${String(value ?? 0)}%`} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="ai"
                    name="AI Automatable"
                    stroke={getAIColor("agentic", filter.activeAIType)}
                    fill={`${getAIColor("agentic", filter.activeAIType)}55`}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="human"
                    name="Human"
                    stroke={getAIColor("human", filter.activeAIType)}
                    fill={`${getAIColor("human", filter.activeAIType)}44`}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </DraggableCard>
        );

      case "role-table":
        return (
          <DraggableCard id={id} full editMode={layout.editMode} title={cardTitleMap(id)}>
            <RoleTable rows={filteredRows} activeAIType={filter.activeAIType} />
          </DraggableCard>
        );

      case "clusters":
        return (
          <DraggableCard id={id} editMode={layout.editMode} title={cardTitleMap(id)}>
            <ClusterGrid rows={filteredRows} />
          </DraggableCard>
        );

      case "risk":
        return (
          <DraggableCard id={id} editMode={layout.editMode} title={cardTitleMap(id)}>
            <RiskAssessment rows={filteredRows} activeAIType={filter.activeAIType} />
          </DraggableCard>
        );

      case "hours-role":
        return (
          <DraggableCard id={id} full editMode={layout.editMode} title={cardTitleMap(id)}>
            <HorizontalBarChart data={topHoursRoles} activeAIType={filter.activeAIType} />
          </DraggableCard>
        );

      default:
        return null;
    }
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6">
      <div className="mb-2 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[--wfa-text]">{config.clientName}</h2>
          <p className="text-sm text-[--wfa-text-secondary]">AI Disruption Analysis - Simulation only</p>
        </div>
        <button
          type="button"
          className="rounded-md border border-[--wfa-border] bg-white px-3 py-1.5 text-xs font-semibold text-[--wfa-text-secondary]"
          onClick={() => {
            const blob = new Blob([document.documentElement.outerHTML], { type: "text/html" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "workforce_analyzer_export.html";
            link.click();
            URL.revokeObjectURL(link.href);
          }}
        >
          Export as HTML
        </button>
      </div>

      <AITypeFilter activeAIType={filter.activeAIType} onSelect={filter.setActiveAIType} />

      <CascadingFilters
        rows={roles}
        department={filter.department}
        subDepartment={filter.subDepartment}
        role={filter.role}
        level={filter.level}
        onDepartment={filter.setDepartment}
        onSubDepartment={filter.setSubDepartment}
        onRole={filter.setRole}
        onLevel={filter.setLevel}
        actions={
          <EditModeControls
            editMode={layout.editMode}
            onEdit={() => layout.setEditMode(true)}
            onSave={() => {
              layout.setDraftOrder(normalizedDraftOrder);
              layout.saveDraft();
            }}
            onCancel={layout.cancelDraft}
          />
        }
      />

      {layout.editMode ? (
        <div className="mb-3 rounded-lg border border-[#d8eebe] bg-[#f5faea] p-2 text-xs font-semibold text-[#517218]">
          Edit mode - drag and drop sections to rearrange.
        </div>
      ) : null}

      {config.sections.kpi?.enabled !== false ? (
        <KPIRow
          totalFte={kpis.totalFte}
          avgHuman={kpis.avgHuman}
          avgAi={
            filter.activeAIType === "all"
              ? kpis.avgAi
              : filter.activeAIType === "agentic"
                ? avgAgentic
                : filter.activeAIType === "generative"
                  ? avgGenerative
                  : filter.activeAIType === "traditional"
                    ? avgTraditional
                    : avgHuman
          }
          roles={kpis.roles}
          clusters={kpis.clusters}
        />
      ) : null}

      {visibleOrder.length === 0 && config.sections.kpi?.enabled === false ? (
        <div className="rounded-lg border border-[--wfa-border] bg-white p-4 text-sm text-[--wfa-text-secondary]">
          All dashboard sections are currently disabled. Re-enable sections in Configure to view dashboard content.
        </div>
      ) : null}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={visibleOrder} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {visibleOrder.map((id) => {
              const node = renderCard(id);
              if (!node) return null;
              return (
                <div key={id} className={FULL_WIDTH_CARDS.has(id) ? "lg:col-span-2" : ""}>
                  {node}
                </div>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
