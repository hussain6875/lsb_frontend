import React from "react";

const ChartFilters = ({ current, onChange }) => {
  const filters = ["weekly", "monthly", "yearly", "all"];
  return (
    <div className="flex gap-2 mb-4 justify-end">
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`px-4 py-1 rounded-full text-sm border transition ${
            current === f ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
          }`}
        >
          {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default ChartFilters;
