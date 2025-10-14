import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";
import { Menu, X } from "lucide-react";

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

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const activeClass =
    "text-blue-600 font-semibold relative after:content-[''] after:block after:w-full after:h-[2px] after:bg-blue-600 after:scale-x-100 after:transition-transform after:duration-300";

  const inactiveClass =
    "text-slate-700 font-medium hover:text-blue-600 transition relative after:content-[''] after:block after:w-full after:h-[2px] after:bg-blue-600 after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-300";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/home"
          className="text-2xl font-bold text-blue-700 tracking-wide"
          onClick={() => setIsOpen(false)}
        >
          LocalService
        </Link>

        {/* Hamburger Button */}
        <button
          className="md:hidden text-blue-700 focus:outline-none transition-transform duration-300"
          onClick={toggleMenu}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          <NavLink
            to="/services"
            className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
          >
            Services
          </NavLink>

          {authUser ? (
            <>
              <NavLink
                to="/my-bookings"
                className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
              >
                My Bookings
              </NavLink>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-300 transform hover:scale-105"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-300 transform hover:scale-105"
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu with Animation */}
      <div
        className={`md:hidden bg-white shadow-md border-t overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col space-y-4 px-4 py-4">
          <NavLink
            to="/services"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
          >
            Services
          </NavLink>

          {authUser ? (
            <>
              <NavLink
                to="/my-bookings"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
              >
                My Bookings
              </NavLink>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-300 transform hover:scale-105"
              >
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-300 transform hover:scale-105"
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
