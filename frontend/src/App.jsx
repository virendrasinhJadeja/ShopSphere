import { Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AdminLayout from "./components/layout/AdminLayout";

import ProtectedRoute from "./routes/ProtectedRoute";

// User Pages
import Home from "./pages/user/Home";
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import Products from "./pages/user/Products";
import ProductDetails from "./pages/user/ProductDetails";
import Cart from "./pages/user/Cart";
import Wishlist from "./pages/user/Wishlist";
import Profile from "./pages/user/Profile";
import MyOrders from "./pages/user/MyOrders";
import Checkout from "./pages/user/Checkout";
import CompareProducts from "./pages/user/CompareProducts";
import UserOrderDetails from "./pages/user/OrderDetails";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import Categories from "./pages/admin/Categories";
import Brands from "./pages/admin/Brands";
import Orders from "./pages/admin/Orders";
import Users from "./pages/admin/Users";
import Reports from "./pages/admin/Reports";
import OrderDetails from "./pages/admin/OrderDetails";

// Other
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <main className="flex-grow-1">
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />

          <Route path="/compare" element={<CompareProducts />} />

          {/* Protected User Routes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />

          <Route
  path="/orders/:id"
  element={
    <ProtectedRoute>
      <UserOrderDetails />
    </ProtectedRoute>
  }
/>

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />

            <Route path="products" element={<AdminProducts />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/edit/:id" element={<EditProduct />} />

            <Route path="categories" element={<Categories />} />
            <Route path="brands" element={<Brands />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetails />} />
            <Route path="users" element={<Users />} />
            <Route path="reports" element={<Reports />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;