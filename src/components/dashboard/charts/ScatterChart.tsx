import { memo } from "react";
import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";

interface ScatterChartProps {
  data: Array<{ x: number; y: number; z: number; name: string }>;
  bubble?: boolean;
}

export const OpportunityScatterChart = memo(function OpportunityScatterChart({ data, bubble = true }: ScatterChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" dataKey="x" name="AI Disruption" unit="%" />
          <YAxis type="number" dataKey="y" name="Human Necessity" unit="%" />
          <ZAxis type="number" dataKey="z" range={bubble ? [50, 500] : [120, 120]} />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter data={data} fill="#00A3E0" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
});
