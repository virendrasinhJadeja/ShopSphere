import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { useEffect } from "react";
import api from "../../services/api";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useCompare } from "../../context/CompareContext";
import "../../styles/navbar.css";

import {
  FaShoppingBag,
  FaHeart,
  FaShoppingCart,
  FaUserCircle,
  FaSignOutAlt,
  FaBalanceScale,
} from "react-icons/fa";

function Navbar() {
  const [keyword, setKeyword] = useState("");
  const [cartCount, setCartCount] = useState(0);
const [wishlistCount, setWishlistCount] = useState(0);

  const { user, logout, isLoggedIn } = useAuth();
  const { compareItems } = useCompare();
  const navigate = useNavigate();

  const handleSearch = (e) => {
  e.preventDefault();

  if (keyword.trim()) {
    navigate(`/products?search=${keyword}`);
  } else {
    navigate("/products");
  }
};

useEffect(() => {
  if (isLoggedIn) {
    fetchCounts();
  }
}, [isLoggedIn]);

const fetchCounts = async () => {
  try {
    const cartRes = await api.get("/cart");
    const wishlistRes = await api.get("/wishlist");

    setCartCount(cartRes.data.items?.length || 0);
    setWishlistCount(
      wishlistRes.data.wishlist?.length || 0
    );
  } catch (error) {
    console.log(error);
  }
};

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
  className="navbar navbar-expand-lg navbar-dark shadow-sm sticky-top"
  style={{
    backgroundColor: "#212529",
    zIndex: 1050,
  }}
>
      <div className="container-fluid px-3 px-lg-5">

        <NavLink className="navbar-brand fw-bold fs-2" to="/">
          <FaShoppingBag className="me-2 text-warning" />
          ShopSphere
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse mt-3 mt-lg-0" id="navbar">

  {/* Search Form */}
  <form
  className="d-flex flex-grow-1 mx-lg-4 my-3 my-lg-0"
  style={{ maxWidth: "550px", }}
    onSubmit={handleSearch}
  >
    <input
      type="search"
      className="form-control me-2"
      placeholder="Search products..."
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
    />

    <button className="btn btn-warning fw-bold px-4" type="submit">
      Search
    </button>
  </form>

  {/* Navbar Links */}
  <ul className="navbar-nav ms-auto align-items-center gap-lg-2">

    <li className="nav-item">
      <NavLink className="nav-link" to="/">
        Home
      </NavLink>
    </li>

   <li className="nav-item">
  <NavLink className="nav-link" to="/products">
    Products
  </NavLink>
</li>

{isLoggedIn ? (
  <>
<li className="nav-item">
  <NavLink className="nav-link" to="/compare">
    <FaBalanceScale className="me-1 text-primary" />
    Compare

    <span className="badge bg-primary ms-2">
      {compareItems.length}
    </span>
  </NavLink>
</li>

<li className="nav-item">
  <NavLink className="nav-link" to="/wishlist">
    <FaHeart className="me-1 text-danger" />
    Wishlist

    <span className="badge bg-danger ms-2">
      {wishlistCount}
    </span>
  </NavLink>
</li>

                <li className="nav-item">
                  <NavLink className="nav-link" to="/cart">
                    <FaShoppingCart className="me-1 text-info" />
Cart

<span  className="badge rounded-pill bg-warning text-dark ms-1">
  {cartCount}
</span>
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink className="nav-link" to="/my-orders">
                    Orders
                  </NavLink>
                </li>

                <li className="nav-item dropdown">

  <NavDropdown className="fw-semibold"
    title={
      <>
        <FaUserCircle className="me-2 text-warning" />
        {user?.fullName}
      </>
    }
    id="user-dropdown"
    align="end"
    menuVariant="dark"
  >
    <NavDropdown.Item as={Link} to="/profile">
      👤 My Profile
    </NavDropdown.Item>

    <NavDropdown.Item as={Link} to="/my-orders">
      📦 My Orders
    </NavDropdown.Item>

    <NavDropdown.Item as={Link} to="/wishlist">
      ❤️ Wishlist
    </NavDropdown.Item>

    <NavDropdown.Item as={Link} to="/cart">
      🛒 Cart
    </NavDropdown.Item>

    {user?.role === "admin" && (
  <>
    <NavDropdown.Divider />

    <NavDropdown.Item as={Link} to="/admin">
      ⚙️ Admin Dashboard
    </NavDropdown.Item>
  </>
)}

    <NavDropdown.Divider />

    <NavDropdown.Item onClick={handleLogout}>
      <FaSignOutAlt className="me-2" />
      Logout
    </NavDropdown.Item>
  </NavDropdown>

</li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">
                    Login
                  </NavLink>
                </li>

                <li className="nav-item ms-lg-2">
                  <NavLink
                    className="btn btn-primary btn-sm"
                    to="/register"
                  >
                    Register
                  </NavLink>
                </li>
              </>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;