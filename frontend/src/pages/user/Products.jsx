import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { getAllProducts } from "../../services/productService";
import { getAllCategories } from "../../services/categoryService";
import { getAllBrands } from "../../services/brandService";
import { addToWishlist } from "../../services/wishlistService";
import { addToCart } from "../../services/cartService";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useCompare } from "../../context/CompareContext";

import {
  FaHeart,
  FaShoppingCart,
  FaStar,
  FaEye,
} from "react-icons/fa";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [loading, setLoading] = useState(true);
const { addToCompare } = useCompare();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [sortPrice, setSortPrice] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const [searchParams] = useSearchParams();

  const keyword = searchParams.get("search") || "";

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data.products || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data.categories || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBrands = async () => {
    try {
      const data = await getAllBrands();
      setBrands(data.brands || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId);
      toast.success("Product added to cart!");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to add to cart."
      );
    }
  };

  const handleWishlist = async (productId) => {
    try {
      await addToWishlist(productId);
      toast.success("Added to Wishlist ❤️");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to add wishlist."
      );
    }
  };

  const filteredProducts = products
    .filter((product) => {
      const searchTerm = (keyword || search).toLowerCase();

      return (
        (product.name
          ?.toLowerCase()
          .includes(searchTerm) ||
          product.description
            ?.toLowerCase()
            .includes(searchTerm)) &&
        (selectedCategory === "" ||
          product.category?.name ===
            selectedCategory) &&
        (selectedBrand === "" ||
          product.brand?.name === selectedBrand)
      );
    })
    .sort((a, b) => {
      if (sortPrice === "low")
        return a.price - b.price;

      if (sortPrice === "high")
        return b.price - a.price;

      return 0;
    });

  const lastIndex =
    currentPage * productsPerPage;

  const firstIndex =
    lastIndex - productsPerPage;

  const currentProducts =
    filteredProducts.slice(
      firstIndex,
      lastIndex
    );

  const totalPages = Math.ceil(
    filteredProducts.length /
      productsPerPage
  );

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div
          className="spinner-border text-primary"
          role="status"
        ></div>

        <p className="mt-3">
          Loading Products...
        </p>
      </div>
    );
  }
  
  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" />

     <div className="row mb-4">

  <div className="col-lg-3 col-md-6 mb-2">
    <input
      type="text"
      className="form-control"
      placeholder="Search Products..."
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
      }}
    />
  </div>

  <div className="col-lg-3 col-md-6 mb-2">
    <select
      className="form-select"
      value={selectedCategory}
      onChange={(e) => {
        setSelectedCategory(e.target.value);
        setCurrentPage(1);
      }}
    >
      <option value="">All Categories</option>

      {categories.map((category) => (
        <option
          key={category._id}
          value={category.name}
        >
          {category.name}
        </option>
      ))}
    </select>
  </div>

  <div className="col-lg-3 col-md-6 mb-2">
    <select
      className="form-select"
      value={selectedBrand}
      onChange={(e) => {
        setSelectedBrand(e.target.value);
        setCurrentPage(1);
      }}
    >
      <option value="">All Brands</option>

      {brands.map((brand) => (
        <option
          key={brand._id}
          value={brand.name}
        >
          {brand.name}
        </option>
      ))}
    </select>
  </div>

  <div className="col-lg-3 col-md-6 mb-2">
    <select
      className="form-select"
      value={sortPrice}
      onChange={(e) => {
        setSortPrice(e.target.value);
        setCurrentPage(1);
      }}
    >
      <option value="">Sort Price</option>
      <option value="low">Price: Low → High</option>
      <option value="high">Price: High → Low</option>
    </select>
  </div>

</div>

<h2 className="fw-bold mb-4">
  Products ({filteredProducts.length})
</h2>

<div className="row">

  {currentProducts.map((product) => (

    <div
      className="col-xl-3 col-lg-4 col-md-6 mb-4"
      key={product._id}
    >

      <div
        className="card h-100 shadow border-0 product-card"
        style={{
          borderRadius: "18px",
          overflow: "hidden",
          transition: "0.3s",
        }}
      >

        <div className="position-relative">

          <img
            src={product.images?.[0]}
            alt={product.name}
            className="card-img-top"
            style={{
              height: "240px",
              objectFit: "cover",
            }}
          />

          <span
            className="badge bg-danger position-absolute"
            style={{
              top: 15,
              left: 15,
            }}
          >
            NEW
          </span>

          {product.stock <= 5 && (
            <span
              className="badge bg-warning text-dark position-absolute"
              style={{
                bottom: 15,
                left: 15,
              }}
            >
              Only {product.stock} Left
            </span>
          )}

          <button
            className="btn btn-light rounded-circle position-absolute shadow"
            style={{
              top: 10,
              right: 10,
            }}
            onClick={() =>
              handleWishlist(product._id)
            }
          >
            <FaHeart className="text-danger" />
          </button>

        </div>

        <div className="card-body d-flex flex-column">

          <div className="mb-2">
  {[1, 2, 3, 4, 5].map((star) => (
    <FaStar
      key={star}
      className={
        star <= Math.round(product.ratings)
          ? "text-warning"
          : "text-secondary"
      }
    />
  ))}

  <span className="ms-2 fw-bold">
    {product.ratings?.toFixed(1) || "0.0"}
  </span>

  <small className="text-muted ms-2">
    ({product.numReviews})
  </small>
</div>

          <h5 className="fw-bold">
            {product.name}
          </h5>

          <p
            className="text-muted"
            style={{
              minHeight: "48px",
            }}
          >
            {product.description}
          </p>

          <h4 className="fw-bold text-primary">
            ₹{product.price}
          </h4>

          <div className="mt-auto">

            <button
              className="btn btn-success w-100 mb-2"
              onClick={() =>
                handleAddToCart(product._id)
              }
            >
              <FaShoppingCart className="me-2" />
              Add To Cart
            </button>

            <Link
              to={`/product/${product._id}`}
              className="btn btn-outline-primary w-100"
            >
              <FaEye className="me-2" />
              View Details
            </Link>

            <button
  className="btn btn-outline-dark"
  onClick={() => addToCompare(product)}
>
  Compare
</button>

          </div>

        </div>

      </div>

    </div>

  ))}

</div>

{currentProducts.length === 0 && (

  <div className="text-center py-5">

    <h2>No Products Found 😔</h2>

    <p className="text-muted">
      Try another search keyword.
    </p>

  </div>

)}

{totalPages > 1 && (

  <div className="d-flex justify-content-center mt-4">

    {Array.from(
      { length: totalPages },
      (_, i) => (

        <button
          key={i}
          className={`btn mx-1 ${
            currentPage === i + 1
              ? "btn-primary"
              : "btn-outline-primary"
          }`}
          onClick={() =>
            setCurrentPage(i + 1)
          }
        >
          {i + 1}
        </button>

      )
    )}

  </div>

)}

    </div>
  );
}

export default Products;