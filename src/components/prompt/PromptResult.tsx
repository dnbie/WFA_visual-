import { memo } from "react";
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
  Scatter,
  ScatterChart,
  Treemap,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis
} from "recharts";

interface PromptResultProps {
  title: string;
  subtitle: string;
  chartType:
    | "bar"
    | "horizontal-bar"
    | "line"
    | "area"
    | "pie"
    | "donut"
    | "stacked-bar"
    | "grouped-bar"
    | "bubble"
    | "scatter"
    | "treemap";
  data: Array<Record<string, number | string>>;
}

const PIE_COLORS = ["#86BC25", "#00A3E0", "#0D8390", "#404040"];

export const PromptResult = memo(function PromptResult({ title, subtitle, chartType, data }: PromptResultProps) {
  return (
    <div className="mb-4 rounded-xl border border-[--wfa-border] bg-white p-4">
      <h4 className="text-sm font-bold text-[--wfa-text]">{title}</h4>
      <p className="mb-2 text-sm text-[--wfa-text-secondary]">{subtitle}</p>
      <p className="mb-2 text-xs text-[--wfa-text-muted]">Chart type: {chartType}</p>
      <div className="h-72 w-full">
        <ResponsiveContainer>
          {chartType === "bubble" || chartType === "scatter" ? (
            <ScatterChart margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="x" name="AI Disruption" unit="%" />
              <YAxis type="number" dataKey="y" name="Human Work" unit="%" />
              {chartType === "bubble" ? <ZAxis type="number" dataKey="z" range={[60, 420]} /> : null}
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter data={data as Array<{ x: number; y: number; z: number }>} fill="#00A3E0" />
            </ScatterChart>
          ) : chartType === "pie" || chartType === "donut" ? (
            <PieChart>
              <Pie
                data={data as Array<{ name: string; value: number }>}
                dataKey="value"
                nameKey="name"
                innerRadius={chartType === "donut" ? 65 : 0}
                outerRadius={100}
              >
                {(data as Array<{ name: string; value: number }>).map((entry, index) => (
                  <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
              <Legend />
            </PieChart>
          ) : chartType === "line" ? (
            <LineChart data={data} margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#86BC25" strokeWidth={2} dot={{ r: 2 }} />
            </LineChart>
          ) : chartType === "area" ? (
            <AreaChart data={data} margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#86BC25" fill="#86BC2555" strokeWidth={2} />
            </AreaChart>
          ) : chartType === "stacked-bar" || chartType === "grouped-bar" ? (
            <BarChart data={data} margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `${String(value ?? 0)}%`} />
              <Legend />
              <Bar stackId={chartType === "stacked-bar" ? "a" : undefined} dataKey="agentic" fill="#86BC25" />
              <Bar stackId={chartType === "stacked-bar" ? "a" : undefined} dataKey="generative" fill="#00A3E0" />
              <Bar stackId={chartType === "stacked-bar" ? "a" : undefined} dataKey="traditional" fill="#0D8390" />
              <Bar stackId={chartType === "stacked-bar" ? "a" : undefined} dataKey="human" fill="#404040" />
            </BarChart>
          ) : chartType === "treemap" ? (
            <Treemap
              data={data as Array<{ name: string; value: number }>}
              dataKey="value"
              stroke="#fff"
              fill="#86BC25"
              nameKey="name"
            >
              <Tooltip formatter={(value) => [`${value} tasks`, "Task count"]} />
            </Treemap>
          ) : chartType === "horizontal-bar" ? (
            <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={190} />
              <Tooltip />
              <Bar dataKey="value" fill="#86BC25" radius={[4, 4, 4, 4]} />
            </BarChart>
          ) : (
            <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={190} />
              <Tooltip />
              <Bar dataKey="value" fill="#86BC25" radius={[4, 4, 4, 4]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
});
