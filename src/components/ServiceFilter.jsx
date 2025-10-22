import React from "react";

const ServiceFilter = ({ categories, selectedCategory, setSelectedCategory, searchTerm, setSearchTerm }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
      {/* Category Filter */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="border p-2 rounded-md w-full md:w-1/4"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* Search Filter */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by title..."
        className="border p-2 rounded-md w-full md:w-1/3"
      />
    </div>
  );
};

export default ServiceFilter;
