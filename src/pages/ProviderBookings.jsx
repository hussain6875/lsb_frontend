import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookings, updateBookingStatus } from "../features/bookings/bookingsSlice";

const ProviderBookings = () => {
    const dispatch = useDispatch();
    const { bookings, loading, error } = useSelector((s) => s.bookings);
    const authUser = useSelector((s) => s.auth.user);

    const [updatingId, setUpdatingId] = useState(null); // track which booking is updating

    useEffect(() => {
        if (authUser) {
            dispatch(fetchBookings({ role: authUser.role, userId: authUser.id }));
        }
    }, [dispatch, authUser]);

    // 🔹 Optimistic UI update
    const handleStatusChange = async (bookingId, newStatus) => {
        // Immediately update UI
        dispatch({
            type: "bookings/optimisticStatusUpdate",
            payload: { id: bookingId, status: newStatus },
        });

        setUpdatingId(bookingId);
        try {
            await dispatch(updateBookingStatus({ id: bookingId, status: newStatus })).unwrap();
        } catch (err) {
            alert("Failed to update status. Refreshing list...");
            dispatch(fetchBookings({ role: authUser.role, userId: authUser.id }));
        }
        setUpdatingId(null);
    };

    const handleCancelBooking = async (bookingId) => {
        const message = prompt("Enter a reason for cancelling this booking:");
        if (!message) return;

        // Optimistic UI
        dispatch({
            type: "bookings/optimisticStatusUpdate",
            payload: { id: bookingId, status: "cancelled" },
        });

        setUpdatingId(bookingId);
        try {
            await dispatch(updateBookingStatus({ id: bookingId, status: "cancelled", message })).unwrap();
        } catch (err) {
            alert("Failed to cancel booking. Refreshing list...");
            dispatch(fetchBookings({ role: authUser.role, userId: authUser.id }));
        }
        setUpdatingId(null);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">My Service Bookings (Provider)</h1>

            {/* Page-level spinner */}
            {loading && (
                <div className="flex justify-center items-center my-8">
                    <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                    <span className="ml-4 text-blue-600 font-medium">Loading bookings...</span>
                </div>
            )}

            {error && <div className="text-red-500">{error}</div>}

            <div className="space-y-4">
                {bookings.length === 0 && !loading ? (
                    <div className="text-center text-gray-500">No bookings found.</div>
                ) : (
                    bookings.map((b) => {
                        const isUpdating = updatingId === b.id;
                        return (
                            <div key={b.id} className="border rounded p-4 bg-white shadow">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-medium">{b.service?.name}</div>
                                        <div className="text-sm text-slate-600">
                                            On: {new Date(b.date).toLocaleString()}
                                        </div>
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

                                        {authUser?.role === "provider" &&
                                            b.service?.providerId === authUser.id &&
                                            b.status !== "completed" && (
                                                <div className="flex gap-2 mt-2">
                                                    {b.status === "pending" && (
                                                        <button
                                                            onClick={() => handleStatusChange(b.id, "confirmed")}
                                                            disabled={isUpdating}
                                                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded flex items-center justify-center"
                                                        >
                                                            {isUpdating && (
                                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                            )}
                                                            {isUpdating ? "Updating..." : "Confirm"}
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleStatusChange(b.id, "completed")}
                                                        disabled={isUpdating}
                                                        className="px-3 py-1 bg-green-600 text-white text-sm rounded flex items-center justify-center"
                                                    >
                                                        {isUpdating && (
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                        )}
                                                        {isUpdating ? "Updating..." : "Complete"}
                                                    </button>
                                                    <button
                                                        onClick={() => handleCancelBooking(b.id)}
                                                        disabled={isUpdating}
                                                        className="px-3 py-1 bg-red-600 text-white text-sm rounded flex items-center justify-center"
                                                    >
                                                        {isUpdating && (
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                        )}
                                                        {isUpdating ? "Updating..." : "Cancel"}
                                                    </button>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ProviderBookings;
