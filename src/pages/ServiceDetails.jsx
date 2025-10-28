import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchServiceById, updateService, deleteService } from "../features/services/servicesSlice";
import { fetchBookings } from "../features/bookings/bookingsSlice"; // ✅ make sure this thunk exists
import { getImageUrl } from "../api/apiClient";
import Review from "../components/Review";

const ServiceDetails = () => {
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

    useEffect(() => {
        if (authUser?.role === "customer") {
            dispatch(fetchBookings({ role: "customer", userId: authUser.id }));
        }
    }, [dispatch, authUser]);

    const completedBookings = bookings.filter(
        (b) => b.serviceId === service.id && b.status === "completed" && b.customerId === authUser?.id
    );

    useEffect(() => {
        if (!service || service.id !== Number(id)) {
            dispatch(fetchServiceById(Number(id)));
        } else {
            setFormData({
                name: service.name,
                description: service.description,
                price: service.price,
                image: null,
            });
        }
    }, [dispatch, id, service]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image") {
            setFormData({ ...formData, image: files[0] });
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
        } catch (error) {
            toast.error("Failed to update service. Please try again.", { position: "top-right" });
        }
    };

    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;
    if (!service) return <div className="p-4">No service found.</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <img
                src={service.imageUrl ? getImageUrl(service.imageUrl) : "/placeholder.png"}
                alt={service.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
            />

            {editMode ? (
                <div className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Service Name"
                        className="w-full border px-3 py-2 rounded"
                    />
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Service Description"
                        className="w-full border px-3 py-2 rounded"
                    />
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Price"
                        className="w-full border px-3 py-2 rounded"
                    />
                    <input type="file" name="image" onChange={handleChange} className="w-full" />
                    <div className="flex gap-2">
                        <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-2 rounded">
                            Save
                        </button>
                        <button onClick={() => setEditMode(false)} className="bg-gray-300 px-4 py-2 rounded">
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <h1 className="text-2xl font-bold mb-2">{service.name}</h1>
                    <p className="text-slate-600 mb-4">{service.description}</p>
                    <div className="flex items-center justify-between">
                        <div className="text-2xl font-semibold">₹{service.price}</div>
                        <div className="flex gap-2">
                            {authUser?.role === "customer" && (
                            <Link to={`/services/${service.id}/book`} className="bg-green-600 text-white px-4 py-2 rounded">
                                Book Now
                            </Link>
                            )}

                            {(authUser?.role === "admin" || authUser?.role === "provider") && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setEditMode(true)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded"
                                    >
                                        Edit
                                    </button>

                                    {authUser?.role === "admin" && (
                                        <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">
                                            Delete
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
            {/* Review section: placed after service info */}
            <Review serviceId={service.id} completedBookings={completedBookings} />
        </div>
    );
};

export default ServiceDetails;
