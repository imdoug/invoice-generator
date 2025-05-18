import React from "react";

interface AnalyticsCardProps {
  totalInvoices: number;
  totalValue: number;
  topClients: Record<string, number>;
}

export default function AnalyticsCard({
  totalInvoices,
  totalValue,
  topClients,
}: AnalyticsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 text-primary">📊 Invoice Summary</h2>
      <div className="space-y-2 text-gray-800 text-sm">
        <p>
          <span className="font-semibold">Total Invoices:</span> {totalInvoices}
        </p>
        <p>
          <span className="font-semibold">Total Value:</span> ${totalValue.toFixed(2)}
        </p>
        <p>
          <span className="font-semibold">Top Clients:</span>{" "}
          {Object.entries(topClients)
            .map(([name, count]) => `${name} (${count})`)
            .join(", ")}
        </p>
      </div>
    </div>
  );
}
