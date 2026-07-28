import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaShoppingBag,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-dark text-white pt-5 pb-3 mt-5">
      <div className="container">
        <div className="row">

          {/* Logo & About */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h3 className="fw-bold">
              <FaShoppingBag className="text-warning me-2" />
              ShopSphere
            </h3>

            <p className="text-light mt-3">
              ShopSphere is a modern MERN Stack E-Commerce
              website where customers can shop securely with
              fast delivery and premium products.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="fw-bold mb-3">
              Quick Links
            </h5>

            <ul className="list-unstyled">

              <li className="mb-2">
                <Link
                  className="text-decoration-none text-light"
                  to="/"
                >
                  Home
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  className="text-decoration-none text-light"
                  to="/products"
                >
                  Products
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  className="text-decoration-none text-light"
                  to="/cart"
                >
                  Cart
                </Link>
              </li>

              <li>
                <Link
                  className="text-decoration-none text-light"
                  to="/wishlist"
                >
                  Wishlist
                </Link>
              </li>

            </ul>
          </div>

          {/* Contact */}
          <div className="col-12 col-sm-6 col-md-6 col-lg-3 mb-4">
            <h5 className="fw-bold mb-3">
              Contact
            </h5>

            <p>
              <FaEnvelope className="me-2 text-warning" />
              support@shopsphere.com
            </p>

            <p>
              <FaPhone className="me-2 text-warning" />
              +91 9876543210
            </p>

            <p>
              <FaMapMarkerAlt className="me-2 text-warning" />
              Ahmedabad, Gujarat
            </p>
          </div>

          {/* Social */}
          <div className="col-12 col-sm-6 col-md-6 col-lg-3 mb-4">
            <h5 className="fw-bold mb-3">
              Follow Us
            </h5>

            <div className="d-flex gap-3 fs-4">

              <a href="#" className="text-white">
                <FaFacebookF />
              </a>

              <a href="#" className="text-white">
                <FaInstagram />
              </a>

              <a href="#" className="text-white">
                <FaLinkedinIn />
              </a>

              <a href="#" className="text-white">
                <FaGithub />
              </a>

            </div>
          </div>

        </div>

        <hr className="border-secondary" />

        <div className="text-center">
          © 2026 <strong>ShopSphere</strong>. All Rights Reserved.
          <br />
          <small className="text-secondary">
            Developed by Virendrasinh Jadeja
          </small>
        </div>
      </div>
    </footer>
  );
}

export default Footer;