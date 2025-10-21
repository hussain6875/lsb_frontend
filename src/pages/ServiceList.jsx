import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchServices } from "../features/services/servicesSlice";
import { Link } from "react-router-dom";
import { getImageUrl } from "../api/apiClient";

const ServiceList = () => {
  const dispatch = useDispatch();
  const { services, loading, error } = useSelector((s) => s.services);

  // role localStorageil ninn fetch cheyyuka (login cheythappol set cheythirikkum)
  const role = localStorage.getItem("role");

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Title and Create Button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Available Services</h1>

        {/* provider aanenkil mathram create button kanikkuka */}
        {role === "provider" && (
          <Link
            to="/services/create"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            + Create Service
          </Link>
        )}
      </div>

      {/* Loading & Error */}
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {/* Service List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s) => (
          <div
            key={s.id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition cursor-pointer"
          >
            <img
              src={getImageUrl(s.imageUrl)}
              alt={s.name}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <h2 className="text-lg font-medium mt-2">{s.name}</h2>
            <p className="text-sm text-slate-600 my-2">
              {s.description?.slice(0, 60)}
            </p>
            <div className="flex items-center justify-between mt-2">
              <div className="font-semibold">₹{s.price}</div>
              <Link
                to={`/services/${s.id}`}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceList;
