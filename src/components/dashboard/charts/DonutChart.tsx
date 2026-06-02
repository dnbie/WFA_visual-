import { memo } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { AIType } from "../../../types";
import { getAIColor } from "../../../utils/colors";

interface DonutChartProps {
  data: Array<{ name: string; value: number; key: Exclude<AIType, "all"> }>;
  activeAIType: AIType;
  onLegendClick: (key: Exclude<AIType, "all">) => void;
}

export const DonutChart = memo(function DonutChart({ data, activeAIType, onLegendClick }: DonutChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={65} outerRadius={100}>
            {data.map((entry) => (
              <Cell key={entry.key} fill={getAIColor(entry.key, activeAIType)} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${String(value ?? 0)}%`} />
          <Legend
            onClick={(payload) => {
              const item = data.find((d) => d.name === payload.value);
              if (item) onLegendClick(item.key);
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
});
