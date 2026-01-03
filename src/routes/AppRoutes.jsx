import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Layouts
import Layout from "../layouts/Layout";

// Pages (Implemented)
import Login from "../pages/Login";
// import Dashboard from "../pages/Dashboard"; // Removed as requested
import NotFound from "../pages/NotFound";
import Diamonds from "../pages/admin/Diamonds";
import Metals from "../pages/admin/Metals";
import Products from "../pages/admin/Products";
import ProductVariants from "../pages/admin/ProductVariants";
import Orders from "../pages/admin/Orders";
import Coupons from "../pages/admin/Coupons";
import Images from "../pages/admin/Images";
import Contacts from "../pages/admin/Contacts";

// Placeholder for missing pages
const Placeholder = ({ title }) => (
  <div className="p-6">
    <div className="bg-white rounded-xl border border-slate-200 p-8 flex flex-col items-center justify-center text-center h-[60vh]">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
        <span className="text-2xl">🚧</span>
      </div>
      <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
      <p className="text-slate-500 mt-2 max-w-md">
        This module is currently under development. Check back later for
        updates.
      </p>
    </div>
  </div>
);

// --- ROUTE CONFIGURATION ---
export const appRoutes = [
  // --- Overview (Redirect root to Diamonds) ---
  {
    path: "/",
    element: <Navigate to="/diamonds" replace />, // ✅ Redirects immediately
    title: "Redirect to Inventory",
  },

  // --- Catalog ---
  {
    path: "/diamonds",
    element: <Diamonds />,
    title: "Diamond Inventory",
  },
  {
    path: "/metals",
    element: <Metals />,
    title: "Metal Rates",
  },
  {
    path: "/products",
    element: <Products />,
    title: "All Products",
  },
  {
    path: "/products/:productId/variants",
    element: <ProductVariants />,
    title: "Manage Variants",
  },
  {
    path: "/categories",
    element: <Placeholder title="Categories" />,
    title: "Category Management",
  },

  // --- Sales ---
  {
    path: "/orders",
    element: <Orders />,
    title: "Sales Orders",
  },
  {
    path: "/coupons",
    element: <Coupons />,
    title: "Coupon Management",
  },

  // --- Content ---
  {
    path: "/banners",
    element: <Placeholder title="Banner Management" />,
    title: "Website Banners",
  },
  {
    path: "/images",
    element: <Images />,
    title: "Image Gallery",
  },

  // --- Users ---
  {
    path: "/customers",
    element: <Contacts />,
    title: "Customers",
  },

  // --- System ---
  {
    path: "/settings",
    element: <Placeholder title="System Settings" />,
    title: "Settings",
  },
  {
    path: "/support",
    element: <Placeholder title="Support Center" />,
    title: "Support",
  },
];

// --- AUTH GUARDS ---

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  // If authenticated, go to / which will redirect to /diamonds
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
};

// --- MAIN COMPONENT ---

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Login Route */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Protected Admin Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Map all defined routes */}
        {appRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
