import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookings } from "../features/bookings/bookingsSlice";

const AdminBookings = () => {
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((s) => s.bookings);
  const role = "admin";

  useEffect(() => {
    dispatch(fetchBookings({ role }));
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">All Bookings (Admin)</h1>

      {loading && <div>Loading bookings...</div>}
      {error && <div className="text-red-500">Error: {error}</div>}

      <div className="space-y-4">
        {bookings.length === 0 && !loading ? (
          <div>No bookings found.</div>
        ) : (
          bookings.map((b) => (
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
                }`}>
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

export default AdminBookings;
