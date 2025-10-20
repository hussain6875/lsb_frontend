// src/pages/MyBookings.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookings } from "../features/bookings/bookingsSlice";

const MyBookings = () => {
    const dispatch = useDispatch();
    const { bookings, loading, error } = useSelector((s) => s.bookings);
    const role = localStorage.getItem("role") || "customer";

    useEffect(() => {
        dispatch(fetchBookings({ role }));
    }, [dispatch, role]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">My Bookings</h1>

            {loading && <div>Loading bookings...</div>}
            {error && <div className="text-red-500">Error: {error}</div>}

            <div className="space-y-4">
                {bookings?.length === 0 && !loading ? (
                    <div>No bookings yet.</div>
                ) : (
                    bookings.map((b) => (
                        <div key={b.id} className="border rounded p-4 bg-white shadow">
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-medium">{b.service?.name || "Service"}</div>
                                    <div className="text-sm text-slate-600">
                                        On: {b.date ? new Date(b.date).toLocaleString() : "No Date"}
                                    </div>{" "}
                                </div>
                                <div>
                                    <span
                                        className={`px-3 py-1 rounded text-sm ${
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
                                    {b.cancelMessage && (
                                        <div className="text-sm text-red-500 mt-1">Reason: {b.cancelMessage}</div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-2 text-sm text-slate-600">
                                {b.street}, {b.city} - {b.pincode}
                            </div>{" "}
                            {b.notes && <div className="mt-2 text-sm">Notes: {b.notes}</div>}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyBookings;
