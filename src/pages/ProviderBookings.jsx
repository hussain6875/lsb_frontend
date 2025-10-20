import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookings, updateBookingStatus } from "../features/bookings/bookingsSlice";

const ProviderBookings = () => {
    const dispatch = useDispatch();
    const { bookings, loading, error } = useSelector((s) => s.bookings);
    const authUser = useSelector((s) => s.auth.user); // logged-in user

    useEffect(() => {
        if (authUser) {
            dispatch(fetchBookings({ role: authUser.role }));
        }
    }, [dispatch, authUser]);

    const handleStatusChange = (bookingId, newStatus) => {
        dispatch(updateBookingStatus({ id: bookingId, status: newStatus }));
    };

    const handleCancelBooking = (bookingId) => {
        const message = prompt("Enter a reason for cancelling this booking:");
        if (message) {
            dispatch(updateBookingStatus({ id: bookingId, status: "cancelled", message }));
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">My Service Bookings (Provider)</h1>

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
                                    <div className="font-medium">{b.service?.name}</div>
                                    <div className="text-sm text-slate-600">On: {new Date(b.date).toLocaleString()}</div>
                                    <div className="text-sm text-slate-600">
                                        {b.street}, {b.city} - {b.pincode}
                                    </div>
                                    {b.notes && <div className="text-sm mt-1">Notes: {b.notes}</div>}
                                    <div className="text-sm text-gray-500 mt-2">
                                        Customer: {b.customer?.name} ({b.customer?.phone || "No phone"}) (
                                        {b.customer?.email})
                                    </div>
                                </div>

                                <div className="text-right space-y-2">
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

                                    {/* ✅ Show buttons only if provider owns this booking */}
                                    {authUser?.role === "provider" &&
                                        b.service?.providerId === authUser.id &&
                                        b.status !== "completed" && (
                                            <div className="flex gap-2 mt-2">
                                                {b.status === "pending" && (
                                                    <button
                                                        onClick={() => handleStatusChange(b.id, "confirmed")}
                                                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded"
                                                    >
                                                        Confirm
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleStatusChange(b.id, "completed")}
                                                    className="px-3 py-1 bg-green-600 text-white text-sm rounded"
                                                >
                                                    Complete
                                                </button>
                                                <button
                                                    onClick={() => handleCancelBooking(b.id)}
                                                    className="px-3 py-1 bg-red-600 text-white text-sm rounded"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProviderBookings;
