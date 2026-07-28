import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../../services/orderService";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data.orders);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <h3>Loading Orders...</h3>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mt-5">
        <h3>No Orders Found</h3>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Orders</h2>

      {orders.map((order) => (
        <div className="card mb-3" key={order._id}>
          <div className="card-body">

            <h5>Order ID</h5>
            <p>{order._id}</p>

            <h6>Status</h6>
            <span className="badge bg-success">
              {order.orderStatus}
            </span>

            <h5 className="mt-3">
              Total: ₹{order.totalPrice}
            </h5>

            <p className="text-muted">
              {new Date(order.createdAt).toLocaleString()}
            </p>

            <div className="mt-3 d-flex gap-2">

  <Link
    to={`/orders/${order._id}`}
    className="btn btn-primary"
  >
    View Details
  </Link>

</div>

          </div>
        </div>
      ))}
    </div>
  );
}

export default MyOrders;