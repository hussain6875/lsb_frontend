import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { addService, fetchServiceById, updateService } from "../features/services/servicesSlice";

const ServiceForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { service, loading, error } = useSelector((s) => s.services);
  const { user } = useSelector((s) => s.auth);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // ✅ category options array
  const categories = ["Cleaning", "Plumbing", "Electrical", "Installation", "Service"];

  useEffect(() => {
    if (id) dispatch(fetchServiceById(Number(id)));
  }, [id, dispatch]);

  useEffect(() => {
    if (id && service) {
      setFormData({
        name: service.name,
        description: service.description,
        price: service.price,
        category: service.category,
      });
      if (service.imageUrl) setPreview(service.imageUrl);
    }
  }, [service, id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => dataToSend.append(key, value));
    dataToSend.append("providerId", user?.id);
    if (selectedImage) dataToSend.append("image", selectedImage);

    id
      ? dispatch(updateService({ id, data: dataToSend }))
      : dispatch(addService(dataToSend));

    navigate("/services");
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4">{id ? "Edit Service" : "Create New Service"}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {["name", "description", "price"].map((field) => (
          <div key={field}>
            <label className="block text-gray-700 mb-1 capitalize">
              {field === "price" ? "Price (₹)" : field}
            </label>
            {field === "description" ? (
              <textarea
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            ) : (
              <input
                type={field === "price" ? "number" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            )}
          </div>
        ))}

        {/* ✅ Category dropdown via map */}
        <div>
          <label className="block text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat.toLowerCase()}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 mb-1">Service Image (optional)</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="w-full" />
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="mt-3 w-48 h-32 object-cover rounded border"
            />
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {id ? "Update Service" : "Create Service"}
        </button>
      </form>
    </div>
  );
};

export default ServiceForm;
