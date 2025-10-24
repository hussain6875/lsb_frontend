import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const BookingChart = ({ data = [], filter = "weekly" }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Booking Status Overview ({filter})</h3>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis unit="%" />
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
          <Bar dataKey="percentage" fill="#3b82f6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BookingChart;
