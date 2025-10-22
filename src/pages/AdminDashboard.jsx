import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookings } from "../features/bookings/bookingsSlice";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((s) => s.bookings);
  const role = "admin";

  const [filter, setFilter] = useState("total"); // 👈 current active filter

  useEffect(() => {
    dispatch(fetchBookings({ role }));
  }, [dispatch]);

  // 🧮 Compute summary counts
  const summary = useMemo(() => {
    const counts = {
      total: bookings.length,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    };
    bookings.forEach((b) => {
      if (b.status === "pending") counts.pending++;
      else if (b.status === "confirmed") counts.confirmed++;
      else if (b.status === "completed") counts.completed++;
      else if (b.status === "cancelled") counts.cancelled++;
    });
    return counts;
  }, [bookings]);

  // 🔍 Filter bookings based on active card
  const filteredBookings = useMemo(() => {
    if (filter === "total") return bookings;
    return bookings.filter((b) => b.status === filter);
  }, [filter, bookings]);

  // 🎨 Card component helper
  const SummaryCard = ({ label, value, color, name }) => (
    <div
      onClick={() => setFilter(name)}
      className={`cursor-pointer border rounded-lg shadow p-4 text-center transition transform hover:scale-105 
      ${
        filter === name
          ? "ring-2 ring-offset-2 ring-" +
            (color === "yellow"
              ? "yellow-400"
              : color === "blue"
              ? "blue-400"
              : color === "green"
              ? "green-400"
              : color === "red"
              ? "red-400"
              : "gray-400")
          : ""
      }
      ${color === "yellow" ? "bg-yellow-50 border-yellow-200" : ""}
      ${color === "blue" ? "bg-blue-50 border-blue-200" : ""}
      ${color === "green" ? "bg-green-50 border-green-200" : ""}
      ${color === "red" ? "bg-red-50 border-red-200" : ""}
      ${color === "gray" ? "bg-white border-gray-200" : ""}
    `}
    >
      <div
        className={`text-sm ${
          color === "yellow"
            ? "text-yellow-600"
            : color === "blue"
            ? "text-blue-600"
            : color === "green"
            ? "text-green-600"
            : color === "red"
            ? "text-red-600"
            : "text-gray-600"
        }`}
      >
        {label}
      </div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">All Bookings (Admin)</h1>

      {/* 🧾 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
        <SummaryCard label="Total" value={summary.total} color="gray" name="total" />
        <SummaryCard label="Pending" value={summary.pending} color="yellow" name="pending" />
        <SummaryCard label="Confirmed" value={summary.confirmed} color="blue" name="confirmed" />
        <SummaryCard label="Completed" value={summary.completed} color="green" name="completed" />
        <SummaryCard label="Cancelled" value={summary.cancelled} color="red" name="cancelled" />
      </div>

      {/* 🔍 Active Filter Label */}
      {filter !== "total" && (
        <div className="mb-4 text-sm text-gray-600">
          Showing <span className="font-medium">{filter}</span> bookings
          <button
            onClick={() => setFilter("total")}
            className="ml-2 text-blue-600 underline hover:text-blue-800"
          >
            View All
          </button>
        </div>
      )}

      {loading && <div>Loading bookings...</div>}
      {error && <div className="text-red-500">Error: {error}</div>}

      <div className="space-y-4">
        {filteredBookings.length === 0 && !loading ? (
          <div>No bookings found.</div>
        ) : (
          filteredBookings.map((b) => (
            <div key={b.id} className="border rounded p-4 bg-white shadow">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{b.service?.name || "Service"}</div>
                  <div className="text-sm text-slate-600">
                    On: {new Date(b.date).toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-600">
                    {b.street}, {b.city} - {b.pincode}
                  </div>
                  {b.notes && <div className="text-sm mt-1">Notes: {b.notes}</div>}
                  <div className="text-sm text-gray-500 mt-2">
                    Customer: {b.customer?.name} ({b.customer?.email})
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded text-sm capitalize ${
                    b.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : b.status === "confirmed"
                      ? "bg-blue-100 text-blue-800"
                      : b.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {b.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
