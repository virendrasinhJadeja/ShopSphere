import { useEffect, useState } from "react";
import api from "../../services/api";

import SalesChart from "../../components/admin/SalesChart";

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    latestOrders: [],
    topProducts: [],
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get("/admin/dashboard");
      setStats(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container-fluid">

      <h2 className="mb-4">
        Admin Dashboard
      </h2>

      <div className="row">

        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white shadow">
            <div className="card-body">
              <h5>Total Users</h5>
              <h2>{stats.totalUsers}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white shadow">
            <div className="card-body">
              <h5>Total Products</h5>
              <h2>{stats.totalProducts}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-dark shadow">
            <div className="card-body">
              <h5>Total Orders</h5>
              <h2>{stats.totalOrders}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card bg-danger text-white shadow">
            <div className="card-body">
              <h5>Total Sales</h5>
              <h2
  className="fw-bold"
  style={{
    whiteSpace: "nowrap",
    fontSize: "2rem",
  }}
>
  ₹{stats.totalSales.toLocaleString("en-IN")}
</h2>
            </div>
          </div>
        </div>

      </div>

      <SalesChart monthlySales={stats.monthlySales} />

      <div className="card shadow mt-4">
  <div className="card-header">
    <h4>Top Selling Products</h4>
  </div>

  <div className="card-body">
    <table className="table table-hover">
      <thead>
        <tr>
          <th>Product</th>
          <th>Price</th>
          <th>Rating</th>
          <th>Reviews</th>
        </tr>
      </thead>

      <tbody>
        {stats.topProducts.map((product) => (
          <tr key={product._id}>
            <td>{product.name}</td>
            <td>₹{product.price}</td>
            <td>{product.ratings}</td>
            <td>{product.numReviews}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

      <div className="card shadow mt-4">

        <div className="card-header">
          <h4>Latest Orders</h4>
        </div>

        <div className="card-body">

          <table className="table table-bordered">

            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>

              {stats.latestOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order.user?.fullName}</td>
                  <td>{order.user?.email}</td>
                  <td>₹{order.totalPrice}</td>
                  <td>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>
          
    </div>
  );
}

export default Dashboard;