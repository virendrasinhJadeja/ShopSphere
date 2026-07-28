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
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/api/orders/${id}/invoice`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to download invoice");
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `Invoice-${order._id}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();

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
    <div className="container mt-4">

      <h2>Order Details</h2>

      <div className="card p-4">

        <h5>Order ID</h5>
        <p>{order._id}</p>

        <h5>Status</h5>
        <p>{order.orderStatus}</p>

        <h5>Total</h5>
        <p>₹{order.totalPrice}</p>

        <div className="mt-4">
  <button
    className="btn btn-success"
    onClick={downloadInvoice}
  >
    📄 Download Invoice
  </button>
</div>

      </div>

    </div>
  );
}

export default OrderDetails;