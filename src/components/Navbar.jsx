import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";
import { Menu, X, User, LogOut, Home, Briefcase } from "lucide-react";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth.user);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
    setIsOpen(false);
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const activeClass =
    "text-blue-600 font-semibold relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r after:from-blue-600 after:to-blue-400 after:rounded-full after:transition-all after:duration-300";

  const inactiveClass =
    "text-slate-700 font-medium hover:text-blue-600 transition-colors duration-200 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-0 after:h-[3px] after:bg-gradient-to-r after:from-blue-600 after:to-blue-400 after:rounded-full hover:after:w-full after:transition-all after:duration-300";

  // Role-based booking link
  const getBookingLink = () => {
    if (authUser?.role === "provider") return "/provider-dashboard";
    if (authUser?.role === "admin") return "/admin-dashboard";
    return "/my-bookings";
  };

  // Get booking label based on role
  const getBookingLabel = () => {
    if (authUser?.role === "provider") return "Provider Dashboard";
    if (authUser?.role === "admin") return "Admin Dashboard";
    return "My Bookings";
  };

  // Common menu links
  const renderLinks = () => (
    <>
      <NavLink
        to="/services"
        onClick={() => setIsOpen(false)}
        className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
      >
        <span className="flex items-center gap-2">
          <Briefcase size={18} className="hidden lg:inline" />
          Services
        </span>
      </NavLink>

      {authUser ? (
        <>
          {/* My Bookings link */}
          <NavLink
            to={getBookingLink()}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
          >
            <span className="flex items-center gap-2">
              <Home size={18} className="hidden lg:inline" />
              {getBookingLabel()}
            </span>
          </NavLink>

          <NavLink
            to="/profile"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
          >
            <span className="flex items-center gap-2">
              <User size={18} />
              <span className="md:hidden">Profile</span>
            </span>
          </NavLink>

          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/30 flex items-center gap-2"
          >
            <LogOut size={16} />
            Logout
          </button>
        </>
      ) : (
        <>
          <NavLink
            to="/login"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
          >
            Login
          </NavLink>
          <NavLink
            to="/register"
            onClick={() => setIsOpen(false)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30"
          >
            Register
          </NavLink>
        </>
      )}
    </>
  );

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-slate-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="group flex items-center gap-2"
            onClick={() => setIsOpen(false)}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent">
              LocalService
            </span>
          </Link>

          {/* Hamburger Button */}
          <button
            className="md:hidden text-blue-700 focus:outline-none hover:bg-blue-50 p-2 rounded-lg transition-all duration-300"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {renderLinks()}
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden bg-gradient-to-b from-white to-slate-50 shadow-inner border-t border-slate-200 overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col space-y-4 px-6 py-6">
          {renderLinks()}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;