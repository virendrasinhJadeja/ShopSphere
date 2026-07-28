
import { NavLink, Outlet } from "react-router-dom";
import { FaChartBar } from "react-icons/fa";

import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

import {
  FaTachometerAlt,
  FaBoxOpen,
  FaTags,
  FaShoppingCart,
  FaUsers,
} from "react-icons/fa";

function AdminLayout() {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="container-fluid p-0">
      <div className="row g-0">

        {/* Sidebar */}
        <div
          className="col-lg-2 col-md-3 bg-dark text-white p-0"
          style={{ minHeight: "100vh" }}
        >
          <div className="text-center py-4 border-bottom">
            <h3 className="fw-bold mb-0">
              ShopSphere
            </h3>

            <small className="text-secondary">
              Admin Panel
            </small>
          </div>

          <div className="list-group list-group-flush">

            <NavLink
              to="/admin/dashboard"
              className="list-group-item list-group-item-action bg-dark text-white"
            >
              <FaTachometerAlt className="me-2" />
              Dashboard
            </NavLink>

            <NavLink
              to="/admin/products"
              className="list-group-item list-group-item-action bg-dark text-white"
            >
              <FaBoxOpen className="me-2" />
              Products
            </NavLink>

            <NavLink
              to="/admin/categories"
              className="list-group-item list-group-item-action bg-dark text-white"
            >
              <FaTags className="me-2" />
              Categories
            </NavLink>

            <NavLink
              to="/admin/orders"
              className="list-group-item list-group-item-action bg-dark text-white"
            >
              <FaShoppingCart className="me-2" />
              Orders
            </NavLink>

            <NavLink
              to="/admin/users"
              className="list-group-item list-group-item-action bg-dark text-white"
            >
              <FaUsers className="me-2" />
              Users
            </NavLink>

            <NavLink
  to="/admin/reports"
  className="list-group-item list-group-item-action bg-dark text-white"
>
  <FaChartBar className="me-2" />
  Reports
</NavLink>

          </div>
        </div>

        {/* Main Content */}
        <div className="col-lg-10 col-md-9 p-0">

          {/* Topbar */}
          <div
            className="d-flex justify-content-between align-items-center px-4 py-3 shadow-sm bg-white"
          >
            <h4 className="fw-bold mb-0">
              Admin Dashboard
            </h4>

            <div className="d-flex align-items-center">

              <span className="fw-semibold me-3">
                Welcome, Admin
              </span>

              <img
                src="https://ui-avatars.com/api/?name=Admin&background=0d6efd&color=fff"
                alt="Admin"
                className="rounded-circle"
                width="45"
                height="45"
              />

            </div>
          </div>

          {/* Page Content */}
          <div className="p-4">
            <Outlet />
          </div>

        </div>

      </div>
    </div>
  );
}

export default AdminLayout;

