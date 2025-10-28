# 🎨 LocalService Frontend (React)

## 🚀 Overview
The **LocalService Frontend** is a modern, responsive web application built using **React** and **Tailwind CSS**.  
It allows customers to book local services, providers to manage services, and admins to monitor platform activity.

---

## 🧩 Tech Stack
- ⚛️ React 18  
- 🧰 Redux Toolkit  
- 🧭 React Router DOM  
- 🎨 Tailwind CSS  
- 🔔 React Toastify  
- ⚡ Fetch API (no Axios)  

---

## 📁 Folder Structure
frontend/
├── api/
│ ├── apiClient.js
│ └── endpoints.js
├── app/
│ └── store.js
├── components/
│ ├── admin/
│ │ ├── BookingChart.jsx
│ │ ├── ChartFilters.jsx
│ │ ├── ProviderStats.jsx
│ │ └── SummaryCard.jsx
│ ├── Footer.jsx
│ ├── Navbar.jsx
│ ├── Pagination.jsx
│ ├── Profile.jsx
│ ├── ProtectedRoute.jsx
│ ├── Review.jsx
│ ├── ServiceFilter.jsx
│ └── ServiceGrid.jsx
├── features/
│ ├── auth/
│ │ └── authSlice.js
│ ├── bookings/
│ │ └── bookingSlice.js
│ ├── reviews/
│ │ └── reviewsSlice.js
│ └── services/
│ └── serviceSlice.js
├── pages/
│ ├── AdminDashboard.jsx
│ ├── BookingForm.jsx
│ ├── Home.jsx
│ ├── Login.jsx
│ ├── MyBooking.jsx
│ ├── ProfilePage.jsx
│ ├── ProviderBooking.jsx
│ ├── Register.jsx
│ ├── ServiceDetails.jsx
│ ├── ServiceForm.jsx
│ └── ServiceList.jsx
├── utils/
│ ├── helpers.js
│ └── statsHelpers.js
├── App.js
└── README.md


## ⚙️ Configuration
This project **does not use a `.env` file** for API configuration.  
The base API URL is defined directly inside `api/apiClient.js`:

🧠 Key Features

✅ Role-based Access

Customers can view and book services.

Providers can manage their own services.

Admin has full control over users, services, and bookings.

✅ Dynamic Service Listings

Filter, search, and paginate services using the ServiceGrid and ServiceFilter components.

✅ Booking Flow

Only Customers can create bookings.

Booking progress updates in real time via backend API.

✅ Admin Dashboard

View booking summaries, charts, and performance stats.

✅ Responsive UI

Tailwind CSS ensures full responsiveness across devices.

🧭 Upcoming Features

🔔 Booking time SMS notifications

💳 Payment gateway integration

🔐 OTP verification on registration

💼 Provider subscription plans

🧑‍💻 Developer Notes

Built and tested on Node.js v18+

Run locally with:

npm install
npm start


Backend API must be running on the same host or update baseURL accordingly.

👨‍💻 Author

Muhammed Hussain M.
📍 Malappuram, India
💼 Full Stack (MERN) Developer
🌐 LinkedIn Profile
 ([optional link](https://www.linkedin.com/in/muhammad-hussain-m/))
💻 GitHub Profile
 ([optional link](https://github.com/hussain6875))