import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data.order);
    } catch (error) {
      console.error(error);
    }
  };

  const downloadInvoice = async () => {
  try {
    const response = await api.get(`/orders/${id}/invoice`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(response.data);

    const link = document.createElement("a");
    link.href = url;
    link.download = `Invoice-${order._id}.pdf`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
    alert("Invoice download failed.");
  }
};

  if (!order) {
    return (
      <div className="container mt-5">
        <h3>Loading...</h3>
      </div>
    );
  }

 return (
  <div className="container py-5">

    <div className="card shadow-lg border-0">

      <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">

        <div>
          <h3 className="mb-0">🛍️ ShopSphere</h3>
          <small>Order Details</small>
        </div>

        <button
          className="btn btn-warning fw-bold"
          onClick={downloadInvoice}
        >
          📄 Download Invoice
        </button>

      </div>

      <div className="card-body">

        <div className="row mb-4">

          <div className="col-md-6">
            <h5>Order Information</h5>

            <p><strong>Order ID:</strong> {order._id}</p>

            <p>
              <strong>Status:</strong>

              <span className={`badge ms-2 ${
                order.orderStatus === "Delivered"
                  ? "bg-success"
                  : order.orderStatus === "Cancelled"
                  ? "bg-danger"
                  : "bg-warning text-dark"
              }`}>
                {order.orderStatus}
              </span>

            </p>

            <p>
              <strong>Payment:</strong> {order.paymentMethod}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>

          </div>

          <div className="col-md-6">
            <h5>Shipping Address</h5>

            <p>{order.shippingAddress?.fullName}</p>
            <p>{order.shippingAddress?.phone}</p>
            <p>{order.shippingAddress?.address}</p>
            <p>{order.shippingAddress?.city}</p>
            <p>{order.shippingAddress?.state}</p>
            <p>{order.shippingAddress?.postalCode}</p>

          </div>

        </div>

        <h5 className="mb-3">Products</h5>

        <table className="table table-bordered align-middle">

          <thead className="table-dark">

            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>

          </thead>

          <tbody>

            {order.orderItems.map((item) => (

              <tr key={item.product._id}>

                <td width="100">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    style={{
                      width: 70,
                      height: 70,
                      objectFit: "cover",
                    }}
                  />
                </td>

                <td>{item.product.name}</td>

                <td>{item.quantity}</td>

                <td>₹{item.price}</td>

                <td>₹{item.price * item.quantity}</td>

              </tr>

            ))}

          </tbody>

        </table>

        <div className="text-end mt-4">

          <h4 className="text-success">
            Grand Total : ₹{order.totalPrice}
          </h4>

        </div>

      </div>

    </div>

  </div>
);
}

export default OrderDetails;