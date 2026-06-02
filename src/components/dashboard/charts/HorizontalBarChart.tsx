import { memo } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { AIType } from "../../../types";
import { getAIColor } from "../../../utils/colors";

interface HorizontalBarChartProps {
  data: Array<{ label: string; agentic: number; generative: number; traditional: number; human: number }>;
  activeAIType: AIType;
}

export const HorizontalBarChart = memo(function HorizontalBarChart({ data, activeAIType }: HorizontalBarChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tickFormatter={(v) => `${v}%`} />
          <YAxis type="category" dataKey="label" width={145} />
          <Tooltip formatter={(value) => `${String(value ?? 0)}%`} />
          <Legend />
          <Bar stackId="a" dataKey="agentic" fill={getAIColor("agentic", activeAIType)} />
          <Bar stackId="a" dataKey="generative" fill={getAIColor("generative", activeAIType)} />
          <Bar stackId="a" dataKey="traditional" fill={getAIColor("traditional", activeAIType)} />
          <Bar stackId="a" dataKey="human" fill={getAIColor("human", activeAIType)} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});
