"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface CombinedAnalyticsChartProps {
  data: {
    day: string;
    total_usd: number;
    invoice_count: number;
  }[];
}

export default function CombinedAnalyticsChart({ data }: CombinedAnalyticsChartProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6 w-full">
      <h2 className="text-xl font-bold mb-4 text-primary">📈 Daily Invoice Trends</h2>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis yAxisId="left" tickFormatter={(v) => `$${v}`} />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip formatter={(value: number) => value.toFixed(2)} />
          <Legend />

          <Line
            yAxisId="left"
            type="natural" // ✅ use this instead
            dataKey="total_usd"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Total Value (USD)"
            dot
          />

          <Line
            yAxisId="right"
            type="natural" // ✅ same here
            dataKey="invoice_count"
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="4 4"
            name="Invoice Count"
            dot
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
