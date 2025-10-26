import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchServiceById } from "../features/services/servicesSlice";
import { createBooking } from "../features/bookings/bookingsSlice";

const BookingForm = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { service } = useSelector((s) => s.services);
    const bookingsState = useSelector((s) => s.bookings);
    const authUser = useSelector((s) => s.auth.user);

    const [bookingDate, setBookingDate] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [pincode, setPincode] = useState("");
    const [notes, setNotes] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!authUser) {
            navigate("/login");
            return;
        }
    }, [authUser, navigate]);

    useEffect(() => {
        if (!service || service.id !== Number(id)) {
            dispatch(fetchServiceById(Number(id)));
        }
    }, [dispatch, id, service]);

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  // ✅ 1. Validation
  if (!bookingDate || !street || !city || !pincode) {
    toast.warn("Please fill date/time and address fields."); // 🔸 warning toast
    return;
  }

  // ✅ 2. Payload prepare
  const payload = {
    serviceId: Number(id),
    bookingDate: new Date(bookingDate).toISOString(),
    street,
    city,
    pincode,
    notes,
  };

  // ✅ 3. Dispatch API call with toast notifications
  try {
    await dispatch(createBooking(payload)).unwrap();
    toast.success("Service booked successfully!"); // 🟢 success toast
    navigate("/my-bookings");
  } catch (err) {
    toast.error(err?.message || "Failed to create booking."); // 🔴 error toast
    console.error("Booking error:", err);
  }
};

    return (
        <div className="container mx-auto px-4 py-8 max-w-xl">
            <h2 className="text-xl font-semibold mb-4">Book Service</h2>
            <div className="mb-6">
                <div className="text-lg font-medium">{service?.name}</div>
                <div className="text-slate-600">₹{service?.price}</div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
                <input
                    type="datetime-local"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                />
                <input
                    placeholder="Street"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                />
                <div className="grid grid-cols-2 gap-4">
                    <input
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                    <input
                        placeholder="Pincode"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>
                <textarea
                    placeholder="Notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    rows="3"
                />
                {error && <div className="text-red-500">{error}</div>}
                <button
                    type="submit"
                    className={`w-full py-2 rounded text-white ${bookingsState.loading ? "bg-gray-400" : "bg-blue-600"}`}
                    disabled={bookingsState.loading}
                >
                    {bookingsState.loading ? "Booking..." : "Confirm Booking"}
                </button>
            </form>
        </div>
    );
};

export default BookingForm;
