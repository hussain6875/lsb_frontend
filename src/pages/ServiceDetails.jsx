import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchServiceById } from "../features/services/servicesSlice";
import { getImageUrl } from "../api/apiClient";

const ServiceDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { service, loading, error } = useSelector((s) => s.services);

  useEffect(() => {
    if (!service || service.id !== Number(id)) {
      dispatch(fetchServiceById(Number(id)));
    }
  }, [dispatch, id, service]);

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
      <h1 className="text-2xl font-bold mb-2">{service.name}</h1>
      <p className="text-slate-600 mb-4">{service.description}</p>
      <div className="flex items-center justify-between">
        <div className="text-2xl font-semibold">₹{service.price}</div>
        <Link
          to={`/services/${service.id}/book`}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default ServiceDetails;
