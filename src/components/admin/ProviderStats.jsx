import React from "react";

/**
 * providerStats: [{ provider, total, pending, confirmed, completed, cancelled, topService }]
 */
const ProviderStats = ({ providerStats = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 mt-6">
      <h2 className="text-lg font-semibold mb-4">Provider Summary (Top)</h2>

      <div className="grid gap-3">
        {providerStats.slice(0, 10).map((p) => {
          const pendingPct = Math.round((p.pending / (p.total || 1)) * 100);
          const completedPct = Math.round((p.completed / (p.total || 1)) * 100);
          return (
            <div key={p.provider} className="border rounded p-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{p.provider}</div>
                  <div className="text-sm text-gray-500">{p.topService ? `Top service: ${p.topService}` : ""}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Total</div>
                  <div className="text-xl font-semibold">{p.total}</div>
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-600">
                <div>Pending: {p.pending} ({pendingPct}%)</div>
                <div>Completed: {p.completed} ({completedPct}%)</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProviderStats;
