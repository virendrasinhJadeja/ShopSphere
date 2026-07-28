import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { getAllCategories } from "../../services/categoryService";

import {
  FaShippingFast,
  FaLock,
  FaUndo,
  FaHeadset,
} from "react-icons/fa";

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products");
      setProducts(data.products.slice(0, 8));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data.categories);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* ================= HERO SECTION ================= */}

      <div
        id="heroCarousel"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
        data-bs-interval="4000"
      >
        <div className="carousel-inner">

          {/* Slide 1 */}

          <div className="carousel-item active">
            <img
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600"
              className="d-block w-100 hero-image"
              alt="Shopping"
            />

            <div className="carousel-caption text-start">

              <h1 className="display-4 fw-bold">
                Big Shopping Sale
              </h1>

              <p className="lead">
                Up to 70% OFF on Electronics
              </p>

              <Link
                to="/products"
                className="btn btn-warning btn-lg"
              >
                Shop Now
              </Link>

            </div>
          </div>

          {/* Slide 2 */}

          <div className="carousel-item">

            <img
              src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1600"
              className="d-block w-100 hero-image"
              alt="Fashion"
            />

            <div className="carousel-caption">

              <h1 className="display-4 fw-bold">
                Latest Fashion Collection
              </h1>

              <p className="lead">
                Premium Fashion for Everyone
              </p>

              <Link
                to="/products"
                className="btn btn-primary btn-lg"
              >
                Explore
              </Link>

            </div>

          </div>

          {/* Slide 3 */}

          <div className="carousel-item">

            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600"
              className="d-block w-100 hero-image"
              alt="Shoes"
            />

            <div className="carousel-caption">

              <h1 className="display-4 fw-bold">
                Premium Shoes
              </h1>

              <p className="lead">
                Discover Trending Collections
              </p>

              <Link
                to="/products"
                className="btn btn-success btn-lg"
              >
                Buy Now
              </Link>

            </div>

          </div>

        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon"></span>
        </button>

        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon"></span>
        </button>

      </div>

            {/* ================= FEATURED PRODUCTS ================= */}

      <section className="py-5">
        <div className="container-fluid px-4">

          <div className="d-flex justify-content-between align-items-center mb-4">

            <h2 className="fw-bold">
              🔥 Featured Products
            </h2>

            <Link
              to="/products"
              className="btn btn-outline-primary"
            >
              View All
            </Link>

          </div>

          <div className="row g-4">

            {products.map((product) => (

              <div
                key={product._id}
                className="col-12 col-sm-6 col-md-4 col-lg-3"
              >

                <div className="card h-100 shadow border-0 rounded-4">

                  <img
                    src={product.images?.[0]}
                    className="card-img-top"
                    alt={product.name}
                    style={{
                      height: "250px",
                      objectFit: "cover",
                    }}
                  />

                  <div className="card-body d-flex flex-column">

                    <h5 className="fw-bold">
                      {product.name}
                    </h5>

                    <p
                      className="text-muted"
                      style={{
                        minHeight: "50px",
                      }}
                    >
                      {product.description.substring(0, 60)}...
                    </p>

                    <h4 className="text-primary mb-3">
                      ₹{product.price}
                    </h4>

                    <Link
                      to={`/products/${product._id}`}
                      className="btn btn-primary mt-auto"
                    >
                      View Details
                    </Link>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>
      </section>

      {/* ================= OFFER BANNER ================= */}

      <section className="py-5">
        <div className="container-fluid px-4">

          <div
            className="rounded-4 p-5 text-center text-white"
            style={{
              background:
                "linear-gradient(135deg,#ff6a00,#ee0979)",
            }}
          >

            <h2 className="fw-bold">
              🎉 Mega Sale is Live
            </h2>

            <p className="lead">
              Get up to <strong>50% OFF</strong> on selected
              products.
            </p>

            <Link
              to="/products"
              className="btn btn-light btn-lg"
            >
              Shop Now
            </Link>

          </div>

        </div>
      </section>

      {/* ================= FEATURES ================= */}

      <section className="py-5 bg-light">

        <div className="container-fluid px-4">

          <h2 className="text-center fw-bold mb-5">
            Why Choose ShopSphere?
          </h2>

          <div className="row text-center">

            <div className="col-6 col-md-3 mb-4">

              <FaShippingFast
                size={45}
                className="text-primary mb-3"
              />

              <h5>Fast Delivery</h5>

              <p>
                Quick delivery across India.
              </p>

            </div>

            <div className="col-6 col-md-3 mb-4">

              <FaLock
                size={45}
                className="text-success mb-3"
              />

              <h5>Secure Payment</h5>

              <p>
                Safe & secure payment.
              </p>

            </div>

            <div className="col-6 col-md-3 mb-4">

              <FaUndo
                size={45}
                className="text-warning mb-3"
              />

              <h5>Easy Returns</h5>

              <p>
                7 Days Return Policy.
              </p>

            </div>

            <div className="col-6 col-md-3 mb-4">

              <FaHeadset
                size={45}
                className="text-danger mb-3"
              />

              <h5>24×7 Support</h5>

              <p>
                Always ready to help.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ================= CATEGORIES ================= */}

      <section className="py-5">

        <div className="container-fluid px-4">

          <h2 className="fw-bold text-center mb-5">
            Shop by Category
          </h2>

          <div className="row g-4">

            {categories.map((category) => (

              <div
                key={category._id}
                className="col-6 col-sm-6 col-md-4 col-lg-3"
              >

                <div className="card border-0 shadow rounded-4 text-center p-4 h-100">

                  <h1>📦</h1>

                  <h5 className="mt-3">
                    {category.name}
                  </h5>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

            {/* ================= NEWSLETTER ================= */}

      <section className="py-5 bg-dark text-white">

        <div className="container-fluid px-4">

          <div className="text-center">

            <h2 className="fw-bold">
              Subscribe to our Newsletter
            </h2>

            <p className="text-light">
              Get updates about new products, offers and discounts.
            </p>

          </div>

          <div className="row justify-content-center mt-4">

            <div className="col-12 col-md-8 col-lg-6">

              <div className="input-group">

                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                />

                <button className="btn btn-warning">
                  Subscribe
                </button>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================= CTA ================= */}

      <section className="py-5">

        <div className="container-fluid px-4 text-center">

          <h2 className="fw-bold">
            Ready to Start Shopping?
          </h2>

          <p className="text-muted fs-5">
            Browse thousands of quality products at the best prices.
          </p>

          <Link
            to="/products"
            className="btn btn-primary btn-lg mt-3"
          >
            Explore Products
          </Link>

        </div>

      </section>

    </>
  );
}

export default Home;