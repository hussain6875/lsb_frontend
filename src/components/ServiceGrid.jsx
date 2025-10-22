import React from "react";
import { getImageUrl } from "../api/apiClient";

const ServiceGrid = ({ services, navigate }) => {
  if (services.length === 0)
    return <p className="text-center text-gray-600">No services found.</p>;

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {services.map((service) => (
        <div
          key={service.id}
          onClick={() => navigate(`/services/${service.id}`)}
          className="bg-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
        >
          <img
            src={getImageUrl(service.imageUrl)}
            alt={service.name}
            className="w-full h-48 object-cover rounded-t-xl"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold">{service.name}</h3>
            <p className="text-sm text-gray-600">
              {service.description?.slice(0, 60) || "No description"}
            </p>
            <p className="mt-3 text-blue-600 font-bold">₹{service.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceGrid;
