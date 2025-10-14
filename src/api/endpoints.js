// src/api/endpoints.js

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const endpoints = {
  // Authentication
  auth: {
    register: `${API_BASE_URL}/api/users/register`,
    login: `${API_BASE_URL}/api/users/login`,
    profile: `${API_BASE_URL}/auth/profile`,
  },

  // Users (Admin & Provider Management)
  users: {
    list: `${API_BASE_URL}/users`,       // GET - Admin only
    details: (id) => `${API_BASE_URL}/users/${id}`, // GET
    update: (id) => `${API_BASE_URL}/users/${id}`,  // PUT
    delete: (id) => `${API_BASE_URL}/users/${id}`,  // DELETE
  },

  // Services
  services: {
    list: `${API_BASE_URL}/services`,          // GET
    create: `${API_BASE_URL}/services`,        // POST (Admin / Provider only)
    details: (id) => `${API_BASE_URL}/services/${id}`,  // GET
    update: (id) => `${API_BASE_URL}/services/${id}`,   // PUT (Admin / Provider only)
    delete: (id) => `${API_BASE_URL}/services/${id}`,   // DELETE (Admin only)
  },

  // Bookings
  bookings: {
    list: `${API_BASE_URL}/bookings`,           // GET - All bookings (Admin)
    myBookings: `${API_BASE_URL}/bookings/my`,  // GET - Logged-in customer bookings
    create: `${API_BASE_URL}/bookings`,         // POST - Customer
    details: (id) => `${API_BASE_URL}/bookings/${id}`, // GET
    updateStatus: (id) => `${API_BASE_URL}/bookings/${id}/status`, // PATCH
    cancel: (id) => `${API_BASE_URL}/bookings/${id}/cancel`, // PATCH
  },

  // Payments
  payments: {
    create: `${API_BASE_URL}/payments`,          // POST
    details: (id) => `${API_BASE_URL}/payments/${id}`, // GET
    myPayments: `${API_BASE_URL}/payments/my`,   // GET
  },

  // Reviews
  reviews: {
    list: `${API_BASE_URL}/reviews`,             // GET
    create: `${API_BASE_URL}/reviews`,           // POST
    details: (id) => `${API_BASE_URL}/reviews/${id}`,  // GET
    update: (id) => `${API_BASE_URL}/reviews/${id}`,   // PUT
    delete: (id) => `${API_BASE_URL}/reviews/${id}`,   // DELETE
  },
};

export default endpoints;
