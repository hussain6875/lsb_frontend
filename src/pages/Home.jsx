import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient,getImageUrl } from "../api/apiClient";

const Home = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await apiClient("/services", { method: "GET" });
        setServices(data);
      } catch (err) {
        setError("Failed to load services. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Auto slide every 3s
  useEffect(() => {
    if (services.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % services.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [services]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="text-center py-16 bg-white shadow-sm">
        <h1 className="text-4xl font-bold mb-4">Find Local Services Easily</h1>
        <p className="text-gray-700 text-lg">
          Book trusted service providers for all your home and business needs with just a few clicks.
        </p>
      </section>

      {/* Carousel Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
          Popular Services
        </h2>

        <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-xl shadow-lg">
          {/* Slides */}
          <div
            className="flex transition-transform duration-700"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {services.map((service) => (
              <div
                key={service.id}
               className="w-full h-80 flex-shrink-0 cursor-pointer"
                onClick={() => navigate(`/services/${service.id}`)}
              >
<img
    src={getImageUrl(service.imageUrl)}
    alt={service.name}
    className="w-full h-full object-cover rounded-xl"
  />
              </div>
            ))}
          </div>

          {/* Controls */}
          <button
            onClick={() =>
              setCurrentIndex((prev) =>
                prev === 0 ? services.length - 1 : prev - 1
              )
            }
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full"
          >
            ◀
          </button>
          <button
            onClick={() =>
              setCurrentIndex((prev) => (prev + 1) % services.length)
            }
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full"
          >
            ▶
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {services.map((_, index) => (
              <span
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full cursor-pointer ${
                  index === currentIndex ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid Section (original) */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
          Available Services
        </h2>
        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && services.length > 0 && (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {services.map((service) => (
              <div
                key={service.id}
                onClick={() => navigate(`/services/${service.id}`)}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
              >
<img src={getImageUrl(service.imageUrl)} alt={service.name} 
 className="w-full h-48 object-cover rounded-t-xl"/>

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
        )}
      </section>
    </div>
  );
};

export default Home;
