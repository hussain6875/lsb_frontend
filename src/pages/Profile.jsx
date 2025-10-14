// src/pages/Profile.js  (page-level component)
import React from "react";
import ProfileComponent from "../components/Profile";

const ProfilePage = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <ProfileComponent />
    </div>
  );
};

export default ProfilePage;
