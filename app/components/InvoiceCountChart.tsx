"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface InvoiceCountChartProps {
  data: {
    month: string;
    invoice_count: number;
  }[];
}

export default function InvoiceCountChart({ data }: InvoiceCountChartProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 text-primary">📦 Monthly Invoice Count</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="invoice_count" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
