import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchServiceById, updateService, deleteService } from "../features/services/servicesSlice";
import { fetchBookings, createBooking } from "../features/bookings/bookingsSlice";
import { getImageUrl } from "../api/apiClient";
import Review from "../components/Review";
import BookingDrawer from "../components/BookingDrawer";

const ServiceDetails = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const openDrawer = () => setDrawerOpen(true);
    const [bookingDate, setBookingDate] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [pincode, setPincode] = useState("");
    const [notes, setNotes] = useState("");

    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { service, loading, error } = useSelector((s) => s.services);
    const authUser = useSelector((s) => s.auth.user);
    const { bookings } = useSelector((s) => s.bookings);

    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        image: null,
    });
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (authUser?.role === "customer") {
            dispatch(fetchBookings({ role: "customer", userId: authUser.id }));
        }
    }, [dispatch, authUser]);

    const completedBookings = service
        ? bookings.filter((b) => b.serviceId === service.id && b.status === "completed" && b.customerId === authUser?.id)
        : [];

    useEffect(() => {
        dispatch(fetchServiceById(Number(id)));
    }, [dispatch, id]);

    useEffect(() => {
        if (service) {
            setFormData({
                name: service.name,
                description: service.description,
                price: service.price,
                image: null,
            });
        }
    }, [service]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image") {
            const file = files[0];
            setFormData({ ...formData, image: file });
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setImagePreview(reader.result);
                reader.readAsDataURL(file);
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this service?")) return;

        try {
            await dispatch(deleteService({ serviceId: service.id, role: authUser.role })).unwrap();
            toast.success("Service deleted successfully!", { position: "top-right" });
            navigate("/services");
        } catch (error) {
            toast.error("Failed to delete the service. Please try again.", { position: "top-right" });
        }
    };

    const handleUpdate = async () => {
        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("description", formData.description);
            data.append("price", formData.price);
            if (formData.image) data.append("image", formData.image);

            await dispatch(
                updateService({
                    serviceId: service.id,
                    formData: data,
                    role: authUser.role,
                })
            );
            toast.success("Service updated successfully!", { position: "top-right" });
            setEditMode(false);
            setImagePreview(null);
        } catch (error) {
            toast.error("Failed to update service. Please try again.", { position: "top-right" });
        }
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setImagePreview(null);
        setFormData({
            name: service.name,
            description: service.description,
            price: service.price,
            image: null,
        });
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();

        if (!bookingDate || !street || !city || !pincode) {
            toast.warn("Please fill date/time and address fields.");
            return;
        }

        const payload = {
            serviceId: Number(id),
            bookingDate: new Date(bookingDate).toISOString(),
            street,
            city,
            pincode,
            notes,
        };

        try {
            await dispatch(createBooking(payload)).unwrap();
            toast.success("Service booked successfully!");
            setDrawerOpen(false);
        } catch (err) {
            toast.error(err?.message || "Failed to create booking.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                    <p className="mt-4 text-slate-600 font-medium">Loading service details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-red-100">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Error Loading Service</h3>
                    <p className="text-red-600 mb-6">{error}</p>
                    <Link
                        to="/services"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                    >
                        Back to Services
                    </Link>
                </div>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Service Not Found</h3>
                    <p className="text-slate-600 mb-6">The service you're looking for doesn't exist.</p>
                    <Link
                        to="/services"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                    >
                        Browse Services
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Back Button */}
                <Link
                    to="/services"
                    className="inline-flex items-center text-slate-600 hover:text-blue-600 mb-6 font-medium transition-colors group"
                >
                    <svg
                        className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>
                    Back to Services
                </Link>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Service Image */}
                    <div className="relative h-80 bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden">
                        <img
                            src={imagePreview || (service.imageUrl ? getImageUrl(service.imageUrl) : "/placeholder.png")}
                            alt={service.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8">
                        {editMode ? (
                            <div className="space-y-6">
                                <div className="border-b border-slate-200 pb-4">
                                    <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                                        <svg
                                            className="w-6 h-6 mr-2 text-blue-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                            />
                                        </svg>
                                        Edit Service
                                    </h2>
                                </div>

                                {/* Edit Form */}
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Service Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter service name"
                                            className="w-full border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-4 py-3 rounded-xl outline-none transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="Enter service description"
                                            rows="5"
                                            className="w-full border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-4 py-3 rounded-xl outline-none transition-all resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Price (₹)</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            placeholder="0.00"
                                            className="w-full border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-4 py-3 rounded-xl outline-none transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Service Image
                                        </label>
                                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                                            <input
                                                type="file"
                                                name="image"
                                                onChange={handleChange}
                                                accept="image/*"
                                                className="hidden"
                                                id="file-upload"
                                            />
                                            <label htmlFor="file-upload" className="cursor-pointer">
                                                <svg
                                                    className="w-12 h-12 mx-auto text-slate-400 mb-3"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                    />
                                                </svg>
                                                <p className="text-sm text-slate-600 font-medium">Click to upload image</p>
                                                <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 10MB</p>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4 border-t border-slate-200">
                                    <button
                                        onClick={handleUpdate}
                                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 flex items-center justify-center"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Service Info */}
                                <div className="mb-8">
                                    <h1 className="text-4xl font-bold text-slate-800 mb-4">{service.name}</h1>
                                    <p className="text-slate-600 text-lg leading-relaxed">{service.description}</p>
                                </div>

                                {/* Price and Actions */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6 border-y border-slate-200">
                                    <div className="flex items-baseline">
                                        <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                                            ₹{service.price}
                                        </span>
                                        <span className="text-slate-500 ml-2 text-lg">/service</span>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        {authUser?.role === "customer" && (
                                            <button
                                                onClick={openDrawer}
                                                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 
               text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg 
               shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 flex items-center"
                                            >
                                                <svg
                                                    className="w-5 h-5 mr-2"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                                Book Now
                                            </button>
                                        )}

                                        {(authUser?.role === "admin" || authUser?.role === "provider") && (
                                            <>
                                                <button
                                                    onClick={() => setEditMode(true)}
                                                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 flex items-center"
                                                >
                                                    <svg
                                                        className="w-5 h-5 mr-2"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                        />
                                                    </svg>
                                                    Edit
                                                </button>

                                                {authUser?.role === "admin" && (
                                                    <button
                                                        onClick={handleDelete}
                                                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 flex items-center"
                                                    >
                                                        <svg
                                                            className="w-5 h-5 mr-2"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                            />
                                                        </svg>
                                                        Delete
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <BookingDrawer
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    service={service}
                    bookingDate={bookingDate}
                    street={street}
                    city={city}
                    pincode={pincode}
                    notes={notes}
                    setBookingDate={setBookingDate}
                    setStreet={setStreet}
                    setCity={setCity}
                    setPincode={setPincode}
                    setNotes={setNotes}
                    //   loading={bookingsState.loading}
                    handleSubmit={handleBookingSubmit}
                />

                {/* Review Section */}
                {!editMode && (
                    <div className="mt-8">
                        <Review serviceId={service.id} completedBookings={completedBookings} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServiceDetails;
