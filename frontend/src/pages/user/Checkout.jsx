import { useState } from "react";

import { placeOrder } from "../../services/orderService";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const [shipping, setShipping] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setShipping({
      ...shipping,
      [e.target.name]: e.target.value,
    });
  };

  

  const handlePlaceOrder = async () => {
  try {
    await placeOrder(shipping);

    toast.success("Order placed successfully!");

    setTimeout(() => {
      navigate("/orders");
    }, 1500);

  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to place order."
    );
  }
};

  return (
    <div className="container mt-4">
      <ToastContainer />
      <h2 className="mb-4">Checkout</h2>

      <div className="card p-4">

        <div className="mb-3">
          <label>Full Name</label>
          <input
            type="text"
            className="form-control"
            name="fullName"
            value={shipping.fullName}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Phone</label>
          <input
            type="text"
            className="form-control"
            name="phone"
            value={shipping.phone}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Address</label>
          <textarea
            className="form-control"
            rows="3"
            name="address"
            value={shipping.address}
            onChange={handleChange}
          />
        </div>

        <div className="row">

          <div className="col-md-4">
            <label>City</label>
            <input
              className="form-control"
              name="city"
              value={shipping.city}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label>State</label>
            <input
              className="form-control"
              name="state"
              value={shipping.state}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label>Pincode</label>
            <input
              className="form-control"
              name="pincode"
              value={shipping.pincode}
              onChange={handleChange}
            />
          </div>

        </div>

        <button
  className="btn btn-success mt-4"
  onClick={handlePlaceOrder}
>
  Place Order
</button>

      </div>
    </div>
  );
}

export default Checkout;