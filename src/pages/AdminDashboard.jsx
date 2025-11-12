import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookings, selectTopProviders } from "../features/bookings/bookingsSlice";
import SummaryCards from "../components/admin/SummaryCards";
import ChartFilters from "../components/admin/ChartFilters";
import BookingChart from "../components/admin/BookingChart";
import ProviderStats from "../components/admin/ProviderStats";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((s) => s.bookings);
  const topProviders = useSelector(selectTopProviders);

  const [filter, setFilter] = useState("total");
  const [chartFilter, setChartFilter] = useState("weekly");

  useEffect(() => {
    dispatch(fetchBookings({ role: "admin" }));
  }, [dispatch]);

  // 🧮 Summary counts
  const summary = useMemo(() => {
    const counts = { total: bookings.length, pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
    bookings.forEach((b) => {
      counts[b.status] = (counts[b.status] || 0) + 1;
    });
    return counts;
  }, [bookings]);

  // 📊 Chart data
  const chartData = useMemo(() => {
    const total = bookings.length || 1;
    const getPercent = (count) => Math.round((count / total) * 100);

    return [
      { status: "Pending", percentage: getPercent(summary.pending) },
      { status: "Confirmed", percentage: getPercent(summary.confirmed) },
      { status: "Completed", percentage: getPercent(summary.completed) },
      { status: "Cancelled", percentage: getPercent(summary.cancelled) },
    ];
  }, [summary,bookings]);

  // 🔍 Filtered bookings
  const filteredBookings = useMemo(() => {
    if (filter === "total") return bookings;
    return bookings.filter((b) => b.status === filter);
  }, [filter, bookings]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>

      {/* Summary Cards */}
      <SummaryCards summary={summary} activeFilter={filter} onFilterChange={setFilter} />

      {/* Chart Filters + Booking Chart */}
      <ChartFilters current={chartFilter} onChange={setChartFilter} />
      <BookingChart data={chartData} filter={chartFilter} />

      {/* Top Providers */}
      <ProviderStats providerStats={topProviders} />

      {/* Filtered Bookings */}
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
                  <div className="text-sm text-slate-600">On: {new Date(b.date).toLocaleString()}</div>
                  <div className="text-sm text-slate-600">{b.street}, {b.city} - {b.pincode}</div>
                  {b.notes && <div className="text-sm mt-1">Notes: {b.notes}</div>}
                  <div className="text-sm text-gray-500 mt-2">Customer: {b.customer?.name} ({b.customer?.email})</div>
                </div>
                <span className={`px-3 py-1 rounded text-sm capitalize ${
                  b.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                  b.status === "confirmed" ? "bg-blue-100 text-blue-800" :
                  b.status === "completed" ? "bg-green-100 text-green-800" :
                  "bg-red-100 text-red-800"
                }`}>{b.status}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
