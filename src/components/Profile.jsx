// src/components/Profile.js (reusable component)
import React, { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch("http://localhost:5000/users/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setUser(data);
    };
    fetchProfile();
  }, []);

  const requestProviderRole = async () => {
    const res = await fetch("http://localhost:5000/users/request-provider", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    alert(data.message);
    setUser({ ...user, status: "pending" });
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-green-700">My Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Phone:</strong> {user.phone || "Not provided"}</p>
      <p><strong>Address:</strong> {user.address || "Not provided"}</p>
      <p><strong>Status:</strong> {user.status || "N/A"}</p>

      {user.role === "customer" && user.status !== "pending" && (
        <button
          onClick={requestProviderRole}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Request Provider Role
        </button>
      )}
    </div>
  );
};

export default Profile;
