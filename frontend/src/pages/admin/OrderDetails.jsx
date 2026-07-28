import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data.order);
      setStatus(data.order.orderStatus);
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async () => {
  try {
    const { data } = await api.put(`/orders/${id}/status`, {
      orderStatus: status,
    });

    setOrder(data.order); // <-- Immediately update UI

    toast.success("Order status updated successfully.");
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to update order."
    );
  }
};

const downloadInvoice = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/api/orders/${id}/invoice`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `Invoice-${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
  }
};

  if (!order) {
    return (
      <div className="container mt-5 text-center">
        <h4>Loading...</h4>
      </div>
    );
  }

  return (
    <div className="container mt-4">

      <h2 className="mb-4">
        Order Details
      </h2>

      <div className="card shadow border-0">

        <div className="card-body">

          <div className="row">

            <div className="col-md-6">
              <h5>Customer</h5>
              <p>{order.user?.fullName}</p>
            </div>

            <div className="col-md-6">
              <h5>Email</h5>
              <p>{order.user?.email}</p>
            </div>

            <div className="col-md-6">
              <h5>Total Amount</h5>
              <h4 className="text-success">
                ₹{order.totalPrice}
              </h4>
            </div>

            <div className="col-md-6">
              <h5>Status</h5>

              <span
                className={`badge fs-6 ${
                  order.orderStatus === "Delivered"
                    ? "bg-success"
                    : order.orderStatus === "Cancelled"
                    ? "bg-danger"
                    : order.orderStatus === "Shipped"
                    ? "bg-primary"
                    : "bg-warning text-dark"
                }`}
              >
                {order.orderStatus}
              </span>
            </div>

            <div className="col-md-6 mt-3">
              <h5>Payment Method</h5>
              <p>{order.paymentMethod}</p>
            </div>

            <div className="col-md-6 mt-3">
              <h5>Order Date</h5>
              <p>
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

          </div>

          <hr className="my-4" />

          <h4 className="mb-3">
            Ordered Products
          </h4>

          <div className="table-responsive">

            <table className="table table-bordered align-middle">

              <thead className="table-dark">

                <tr>
                  <th>Image</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Total</th>
                </tr>

              </thead>

              <tbody>

                {order.orderItems.map((item) => (

                  <tr key={item._id}>

                    <td width="90">

                      <img
                        src={item.image || item.product?.images?.[0]}
                        alt={item.name}
                        style={{
                          width: 70,
                          height: 70,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />

                    </td>

                    <td>
                      {item.name || item.product?.name}
                    </td>

                    <td>
                      ₹{item.price}
                    </td>

                    <td>
                      {item.quantity}
                    </td>

                    <td className="fw-bold">
                      ₹{item.price * item.quantity}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          <div className="card mt-4 border-0 bg-light">

            <div className="card-body">

              <h4 className="mb-3">
                Order Summary
              </h4>

              <div className="d-flex justify-content-between">
                <span>Total Items</span>

                <strong>
                  {order.orderItems.length}
                </strong>
              </div>

              <div className="mt-4">
  <button
    className="btn btn-primary"
    onClick={downloadInvoice}
  >
    📄 Download Invoice
  </button>
</div>

              <hr />

              <div className="d-flex justify-content-between">

                <h5>Grand Total</h5>

                <h4 className="text-success">
                  ₹{order.totalPrice}
                </h4>

              </div>

              <hr className="my-4" />

<h4 className="mb-3">
  Update Order Status
</h4>

<div className="row">

  <div className="col-md-6">

    <select
      className="form-select"
      value={status}
      onChange={(e) => setStatus(e.target.value)}
    >
      <option value="Pending">Pending</option>
      <option value="Confirmed">Confirmed</option>
      <option value="Shipped">Shipped</option>
      <option value="Delivered">Delivered</option>
      <option value="Cancelled">Cancelled</option>
    </select>

  </div>

  <div className="col-md-3">

    <button
      className="btn btn-success w-100"
      onClick={updateStatus}
    >
      Save Status
    </button>

  </div>

</div>

<ToastContainer position="top-right" />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default OrderDetails;