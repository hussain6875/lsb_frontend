import React, { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });

  const handleSubmit = (e) => {
  e.preventDefault();

  // 1️⃣ Password mismatch check
  if (formData.password !== formData.confirmPassword) {
    toast.error("Passwords do not match!"); // ✅ alert -> toast
    return;
  }

  // 2️⃣ Prepare payload
  const { confirmPassword, ...payload } = formData;

  // 3️⃣ Dispatch register action
  dispatch(registerUser(payload)).then((res) => {
    if (!res.error) {
      toast.success("Registration successful!"); // ✅ Success toast
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        address: "",
      });
      navigate("/login");
    } else {
      toast.error(res.error?.message || "Registration failed! Try again."); // ✅ Error toast
    }
  });
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        autoComplete="off" // 🚫 disable form-level autofill
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-green-700">
          Create Account
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            autoComplete="new-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            autoComplete="new-email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="new-password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            autoComplete="new-phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            required
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            autoComplete="new-address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
