import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  getWishlist,
  removeFromWishlist,
} from "../../services/wishlistService";
import { addToCart } from "../../services/cartService";
import { useApp } from "../../context/AppContext";

function Wishlist() {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const { refreshCounts } = useApp();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const data = await getWishlist();
       console.log(data);
      setWishlist(data.wishlist);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);

await fetchWishlist();
await refreshCounts();

toast.success("Removed from wishlist");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to remove item"
      );
    }
  };

  const handleMoveToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
await removeFromWishlist(productId);

await fetchWishlist();
await refreshCounts();

toast.success("Moved to Cart");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to move item"
      );
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <h3>Loading Wishlist...</h3>
      </div>
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="container mt-5">
        <h3>Your Wishlist is Empty</h3>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <ToastContainer />

      <h2 className="mb-4">My Wishlist</h2>

      <div className="row">
        {wishlist.map((product) => (
          <div className="col-md-4 mb-4" key={product._id}>
            <div className="card h-100 shadow-sm">

              <img
                src={product.images[0]}
                alt={product.name}
                className="card-img-top"
                style={{ height: "250px", objectFit: "cover" }}
              />

              <div className="card-body">
                <h5>{product.name}</h5>

                <p className="text-success">
                  ₹{product.price}
                </p>

                <button
                  className="btn btn-primary w-100 mb-2"
                  onClick={() => handleMoveToCart(product._id)}
                >
                  Move to Cart
                </button>

                <button
                  className="btn btn-outline-danger w-100"
                  onClick={() => handleRemove(product._id)}
                >
                  Remove
                </button>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;