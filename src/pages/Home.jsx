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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await apiClient("/services", { method: "GET" });
        setServices(data);
        const uniqueCategories = [...new Set(data.map((s) => s.category))];
        setCategories(uniqueCategories);
      } catch {
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
    setCurrentPage(1); // Reset page when filters change
  }, [services, selectedCategory, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentServices = filteredServices.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-100">
      <section className="text-center py-16 bg-white shadow-sm">
        <h1 className="text-4xl font-bold mb-4">Find Local Services Easily</h1>
        <p className="text-gray-700 text-lg">
          Book trusted service providers for all your home and business needs.
        </p>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
          Available Services
        </h2>

        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

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
