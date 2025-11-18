import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../api/apiClient";
import ServiceFilter from "../components/ServiceFilter";
import ServiceGrid from "../components/ServiceGrid";
import Pagination from "../components/Pagination";

const Home = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await apiClient("/services", { method: "GET" });
        setServices(data);
        const uniqueCategories = [...new Set(data.map((s) => s.category))];
        setCategories(uniqueCategories);
      } catch (err) {
        setError("Failed to load services.");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = services;
    if (selectedCategory)
      filtered = filtered.filter((s) => s.category === selectedCategory);
    if (searchTerm)
      filtered = filtered.filter((s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    setFilteredServices(filtered);
    setCurrentPage(1);
  }, [services, selectedCategory, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentServices = filteredServices.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Find Local Services
            <span className="block text-yellow-300">Effortlessly</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto mb-8">
            Book trusted service providers for all your home and business needs
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
            {[
              "Verified Professionals",
              "Best Prices",
              "Quick Booking",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
            Available Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of professional services tailored to your needs
          </p>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-2xl text-center">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <ServiceFilter
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />

            <ServiceGrid services={currentServices} navigate={navigate} />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </section>
    </div>
  );
};

export default Home;
