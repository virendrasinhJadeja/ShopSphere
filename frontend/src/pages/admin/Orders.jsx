import { useEffect, useState } from "react";
import api from "../../services/api";

import { Link } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders");
      setOrders(data.orders);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container-fluid">
      <h2 className="mb-4">Order Management</h2>

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order, index) => (
            <tr key={order._id}>
              <td>{index + 1}</td>
              <td>{order.user?.fullName}</td>
              <td>₹{order.totalPrice}</td>
              <td>{order.orderStatus}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td> 
                <Link 
                to={`/admin/orders/${order._id}`} 
                className="btn btn-sm btn-primary"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Orders;