// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ServiceList from "./pages/ServiceList";
import ServiceDetails from "./pages/ServiceDetails";
import MyBookings from "./pages/MyBookings";

// Auth pages (you already have)
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import BookingForm from "./pages/BookingForm";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ServiceForm from "./pages/ServiceForm";

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">
                    <Routes>
                        <Route path="/home" element={<Home />} />
                        <Route path="/services" element={<ServiceList />} />
                        <Route path="/services/:id" element={<ServiceDetails />} />
                        <Route
                            path="/services/:id/book"
                            element={
                                <ProtectedRoute>
                                    <BookingForm />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/my-bookings"
                            element={
                                <ProtectedRoute>
                                    <MyBookings />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/services/new"
                            element={
                                <ProtectedRoute allowedRoles={["admin", "provider"]}>
                                    <ServiceForm />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/services/:id/edit"
                            element={
                                <ProtectedRoute allowedRoles={["admin", "provider"]}>
                                    <ServiceForm />
                                </ProtectedRoute>
                            }
                        />

                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        {/* fallback */}
                        <Route path="*" element={<div className="p-8">Page not found</div>} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;
