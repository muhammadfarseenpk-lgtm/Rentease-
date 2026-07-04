import { Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Public Pages
import Home from "@/pages/Home";
import Plans from "@/pages/Plans";
import Category from "@/pages/Category";
import ProductDetails from "@/pages/ProductDetails";
import Search from "@/pages/Search";
import Support from "@/pages/Support";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";

// User Protected Pages
import Wishlist from "@/pages/Wishlist";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Profile from "@/pages/Profile";
import Orders from "@/pages/Orders";
import OrderTracking from "@/pages/OrderTracking";
import UserDashboard from "@/pages/user/UserDashboard";

// Vendor Protected Pages
import VendorDashboard from "@/pages/vendor/VendorDashboard";
import VendorAddProduct from "@/pages/vendor/VendorAddProduct";

// Admin Protected Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/furniture" element={<Category />} />
        <Route path="/appliances" element={<Category />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/search" element={<Search />} />
        <Route path="/support" element={<Support />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected User Dashboard */}
        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route path="/user-dashboard" element={<UserDashboard />} />
        </Route>

        {/* Protected User Routes (user, vendor, admin can access) */}
        <Route element={<ProtectedRoute allowedRoles={["user", "vendor", "admin"]} />}>
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/track/:orderId" element={<OrderTracking />} />
        </Route>

        {/* Vendor Routes */}
        <Route element={<ProtectedRoute allowedRoles={["vendor"]} />}>
          <Route path="/vendor-dashboard" element={<VendorDashboard />} />
          <Route path="/vendor-add-product" element={<VendorAddProduct />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>

        {/* 404 Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
