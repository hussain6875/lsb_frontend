import { X } from "lucide-react";
import React from "react";

export default function BookingDrawer({
  open,
  onClose,
  service,
  bookingDate,
  street,
  city,
  pincode,
  notes,
  setBookingDate,
  setStreet,
  setCity,
  setPincode,
  setNotes,
  loading,
  handleSubmit,
}) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-xl 
        transition-transform duration-300 transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Book Service</h2>
          <button onClick={onClose} className="p-2">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto h-full">
          {/* Service Header */}
          <div className="mb-5">
            <div className="text-lg font-medium">{service?.name}</div>
            <div className="text-gray-600">₹{service?.price}</div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

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
              rows={3}
              className="w-full border rounded px-3 py-2"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded text-white ${
                loading ? "bg-gray-400" : "bg-blue-600"
              }`}
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
