import { useEffect, useState } from "react";
import { getCart, removeFromCart, updateCart } from "../../services/cartService";
import { toast, ToastContainer } from "react-toastify";

import { useNavigate } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCart(data.cart);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      toast.success("Item removed from cart");
      fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove item");
    }
  };

    const handleQuantity = async (productId, quantity) => {
  if (quantity < 1) return;

  try {
    await updateCart(productId, quantity);

    // Reload cart after updating quantity
    fetchCart();
  } catch (error) {
    console.error(error);

    toast.error(
      error.response?.data?.message || "Failed to update quantity."
    );
  }
};

  if (loading) {
    return (
      <div className="container mt-5">
        <h3>Loading Cart...</h3>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mt-5">
        <h3>Your Cart is Empty</h3>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <ToastContainer />

      <h2 className="mb-4">My Cart</h2>

      {cart.items.map((item) => (
        <div className="card mb-3" key={item.product._id}>
          <div className="row g-0">
            <div className="col-md-3">
              <img
                src={item.product.images[0]}
                alt={item.product.name}
                className="img-fluid rounded-start"
                style={{ height: "180px", objectFit: "cover" }}
              />
            </div>

            <div className="col-md-9">
              <div className="card-body">
                <h5>{item.product.name}</h5>

                <p>Price: ₹{item.product.price}</p>

                <div className="d-flex align-items-center mb-3">
  <button
    className="btn btn-outline-secondary btn-sm"
    onClick={() =>
      handleQuantity(item.product._id, item.quantity - 1)
    }
  >
    -
  </button>

  <span className="mx-3 fw-bold">
    {item.quantity}
  </span>

  <button
    className="btn btn-outline-secondary btn-sm"
    onClick={() =>
      handleQuantity(item.product._id, item.quantity + 1)
    }
  >
    +
  </button>
</div>

                <button
                  className="btn btn-danger"
                  onClick={() => handleRemove(item.product._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="d-flex justify-content-between align-items-center mt-4">

  <h3>
    Total: ₹{cart.totalPrice}
  </h3>

  <button
    className="btn btn-success btn-lg"
    onClick={() => navigate("/checkout")}
  >
    Proceed to Checkout
  </button>

</div>
    </div>
  );
}

export default Cart;