import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../../services/productService";

import { toast, ToastContainer } from "react-toastify";
import { addToCart } from "../../services/cartService";
import { addToWishlist } from "../../services/wishlistService";

import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { FaStar } from "react-icons/fa";

import RecentlyViewed from "../../components/user/RecentlyViewed";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();

const [rating, setRating] = useState(5);
const [comment, setComment] = useState("");

const [relatedProducts, setRelatedProducts] = useState([]);
const [selectedImage, setSelectedImage] = useState("");
const [zoomStyle, setZoomStyle] = useState({});
const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleAddToCart = async () => {
  try {
   await addToCart(product._id, quantity);
    toast.success("Product added to cart!");
  } catch (error) {
    console.log(error.response);
console.log(error.response?.data);

toast.error(
  error.response?.data?.message || "Failed to add product."
);
  }
};

const handleAddToWishlist = async () => {
  try {
    await addToWishlist(product._id);
    toast.success("Product added to wishlist!");
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to add to wishlist."
    );
  }
};

const handleReviewSubmit = async (e) => {
  e.preventDefault();

  try {
    await api.post(`/products/${product._id}/reviews`, {
      rating,
      comment,
    });

    toast.success("Review submitted successfully.");

    setComment("");
    setRating(5);

    fetchProduct();
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Failed to submit review."
    );
  }
};

const handleMouseMove = (e) => {
  const { left, top, width, height } =
    e.target.getBoundingClientRect();

  const x = ((e.clientX - left) / width) * 100;
  const y = ((e.clientY - top) / height) * 100;

  setZoomStyle({
    transformOrigin: `${x}% ${y}%`,
    transform: "scale(2)",
  });
};

const handleMouseLeave = () => {
  setZoomStyle({
    transform: "scale(1)",
    transformOrigin: "center",
  });
};

  const fetchProduct = async () => {
    try {
      const data = await getProductById(id);

       setProduct(data.product);

       const recent =
  JSON.parse(localStorage.getItem("recentProducts")) || [];

const filtered = recent.filter(
  (item) => item._id !== data.product._id
);

filtered.unshift(data.product);

localStorage.setItem(
  "recentProducts",
  JSON.stringify(filtered.slice(0, 8))
);

       setSelectedImage(data.product.images?.[0]);
       setRelatedProducts(data.relatedProducts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h3>Loading...</h3>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mt-5">
        <h3>Product not found.</h3>
      </div>
    );
  }

  return (
    <div className="container mt-5">
         <ToastContainer />
      <div className="row">

        <div className="col-md-5">
          <div
  style={{
    overflow: "hidden",
    borderRadius: "12px",
  }}
>
  <img
    src={selectedImage}
    alt={product.name}
    className="img-fluid rounded shadow"
    style={{
      width: "100%",
      height: "450px",
      objectFit: "cover",
    }}
  />
</div>

<div className="d-flex mt-3 gap-2 flex-wrap">
  {product.images?.map((img, index) => (
    <img
      key={index}
      src={img}
      alt=""
      onClick={() => setSelectedImage(img)}
      style={{
        width: "80px",
        height: "80px",
        objectFit: "cover",
        cursor: "pointer",
        border:
          selectedImage === img
            ? "3px solid #0d6efd"
            : "1px solid #ddd",
        borderRadius: "8px",
      }}
    />
  ))}
</div>

        </div>

        <div className="col-md-7">

          <h2>{product.name}</h2>

          <h3 className="text-success mt-3">
            ₹{product.price}
          </h3>

          <p className="mt-3">
            {product.description}
          </p>

          <p>
            <strong>Category:</strong>{" "}
            {product.category?.name}
          </p>

          <p>
            <strong>Brand:</strong>{" "}
            {product.brand?.name}
          </p>

          <p>
            <strong>Stock:</strong>{" "}
            {product.stock}
          </p>

          <div className="d-flex align-items-center my-4">

  <button
    className="btn btn-outline-secondary"
    onClick={() =>
      quantity > 1 && setQuantity(quantity - 1)
    }
  >
    -
  </button>

  <input
    type="text"
    className="form-control text-center mx-2"
    value={quantity}
    readOnly
    style={{ width: "70px" }}
  />

  <button
    className="btn btn-outline-secondary"
    onClick={() => {
      if (quantity < product.stock) {
        setQuantity(quantity + 1);
      }
    }}
  >
    +
  </button>

</div>

          <button
  className="btn btn-primary me-2"
  onClick={handleAddToCart}
>
  Add to Cart
</button>

          <button
  className="btn btn-outline-danger"
  onClick={handleAddToWishlist}
>
  ❤️ Add to Wishlist
</button>

<hr className="my-5" />

<h3 className="mb-4">
  ⭐ Customer Reviews
</h3>

<div className="d-flex align-items-center mb-4">

  <div className="me-3">
    {[1, 2, 3, 4, 5].map((star) => (
      <FaStar
        key={star}
        className={
          star <= Math.round(product.ratings)
            ? "text-warning"
            : "text-secondary"
        }
        size={24}
      />
    ))}
  </div>

  <div>
    <h5 className="mb-0">
      {product.ratings?.toFixed(1) || "0.0"} / 5
    </h5>

    <small className="text-muted">
      {product.numReviews} Reviews
    </small>
  </div>

</div>

{isLoggedIn && (
  <form
    onSubmit={handleReviewSubmit}
    className="card p-4 mb-5 shadow-sm"
  >
    <h5 className="mb-3">
      Write a Review
    </h5>

    <div className="mb-3">
      <label className="form-label">
        Rating
      </label>

      <select
        className="form-select"
        value={rating}
        onChange={(e) =>
          setRating(e.target.value)
        }
      >
        <option value={1}>1 ⭐</option>
        <option value={2}>2 ⭐⭐</option>
        <option value={3}>3 ⭐⭐⭐</option>
        <option value={4}>4 ⭐⭐⭐⭐</option>
        <option value={5}>5 ⭐⭐⭐⭐⭐</option>
      </select>
    </div>

    <div className="mb-3">
      <label className="form-label">
        Comment
      </label>

      <textarea
        className="form-control"
        rows="4"
        value={comment}
        onChange={(e) =>
          setComment(e.target.value)
        }
      />
    </div>

    <button className="btn btn-primary">
      Submit Review
    </button>
  </form>
)}

{product.reviews?.length === 0 ? (
  <p>No reviews yet.</p>
) : (
  product.reviews.map((review) => (
    <div
      key={review._id}
      className="card mb-3 shadow-sm"
    >
      <div className="card-body">

        <h5>
          {review.name}
        </h5>

        <div className="text-warning mb-2">
          {"⭐".repeat(review.rating)}
        </div>

        <p>
          {review.comment}
        </p>

        <small className="text-muted">
          {new Date(
            review.createdAt
          ).toLocaleDateString()}
        </small>

      </div>
    </div>
  ))
)}

<hr className="my-5" />

<h3 className="mb-4">
  Related Products
</h3>

<div className="row">
  {relatedProducts.length === 0 ? (
    <p>No related products found.</p>
  ) : (
    relatedProducts.map((item) => (
      <div className="col-md-3 mb-4" key={item._id}>
        <div className="card h-100 shadow-sm">

          <img
            src={item.images?.[0]}
            alt={item.name}
            className="card-img-top"
            style={{
              height: "180px",
              objectFit: "cover",
            }}
          />

          <div className="card-body">

            <h6 className="fw-bold">
              {item.name}
            </h6>

            <p className="text-primary fw-bold">
              ₹{item.price}
            </p>

            <button
              className="btn btn-outline-primary w-100"
              onClick={() => {
                window.location.href = `/product/${item._id}`;
              }}
            >
              View Details
            </button>

          </div>

        </div>
      </div>
    ))
  )}
</div>

        </div>

      </div>

      <hr className="my-5" />

<h3 className="mb-4">Related Products</h3>

<div className="row">
  {relatedProducts.length === 0 ? (
    <p>No related products found.</p>
  ) : (
    relatedProducts.map((item) => (
      <div className="col-md-3 mb-4" key={item._id}>
        <div className="card h-100 shadow-sm">

          <img
            src={item.images?.[0]}
            className="card-img-top"
            alt={item.name}
            style={{
              height: "220px",
              objectFit: "cover",
            }}
          />

          <div className="card-body">

            <h6 className="fw-bold">
              {item.name}
            </h6>

            <p className="text-success fw-bold">
              ₹{item.price}
            </p>

            <button
              className="btn btn-outline-primary w-100"
              onClick={() =>
                window.location.href = `/product/${item._id}`
              }
            >
              View Product
            </button>

          </div>
        </div>
      </div>
    ))
  )}
</div>

<RecentlyViewed />
    </div>
    
  );
}

export default ProductDetails;