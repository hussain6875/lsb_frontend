import React from "react";

const SummaryCards = ({ summary = {}, activeFilter, onFilterChange }) => {
  const cards = [
    { label: "Total", name: "total", color: "gray" },
    { label: "Pending", name: "pending", color: "yellow" },
    { label: "Confirmed", name: "confirmed", color: "blue" },
    { label: "Completed", name: "completed", color: "green" },
    { label: "Cancelled", name: "cancelled", color: "red" },
  ];

  const colorStyle = {
    gray: "bg-white border-gray-200 text-gray-700 ring-gray-400",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700 ring-yellow-400",
    blue: "bg-blue-50 border-blue-200 text-blue-700 ring-blue-400",
    green: "bg-green-50 border-green-200 text-green-700 ring-green-400",
    red: "bg-red-50 border-red-200 text-red-700 ring-red-400",
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
      {cards.map(({ label, name, color }) => (
        <div
          key={name}
          role="button"
          onClick={() => onFilterChange(name)}
          className={`cursor-pointer rounded-lg shadow p-4 text-center transition transform hover:scale-105 border ${colorStyle[color]} ${activeFilter === name ? "ring-2 ring-offset-2" : ""}`}
        >
          <div className="text-sm">{label}</div>
          <div className="text-2xl font-semibold text-gray-900">{summary[name] || 0}</div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
