import { memo } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { AIType } from "../../../types";
import { getAIColor } from "../../../utils/colors";

interface StackedBarChartProps {
  data: Array<{ label: string; agentic: number; generative: number; traditional: number; human: number }>;
  activeAIType: AIType;
  grouped?: boolean;
}

export const StackedBarChart = memo(function StackedBarChart({ data, activeAIType, grouped = false }: StackedBarChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis tickFormatter={(v) => `${v}%`} />
          <Tooltip formatter={(value) => `${String(value ?? 0)}%`} />
          <Legend />
          <Bar stackId={grouped ? undefined : "a"} dataKey="agentic" fill={getAIColor("agentic", activeAIType)} />
          <Bar stackId={grouped ? undefined : "a"} dataKey="generative" fill={getAIColor("generative", activeAIType)} />
          <Bar stackId={grouped ? undefined : "a"} dataKey="traditional" fill={getAIColor("traditional", activeAIType)} />
          <Bar stackId={grouped ? undefined : "a"} dataKey="human" fill={getAIColor("human", activeAIType)} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});
