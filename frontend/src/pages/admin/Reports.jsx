import { useEffect, useState } from "react";
import api from "../../services/api";

function Reports() {
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    orders: 0,
    revenue: 0,
  });

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const [productsRes, usersRes, ordersRes] = await Promise.all([
        api.get("/products"),
        api.get("/auth/users"),
        api.get("/orders"),
      ]);

      const products = productsRes.data.products || [];
      const users = usersRes.data.users || [];
      const orders = ordersRes.data.orders || [];

      const revenue = orders.reduce(
        (sum, order) => sum + (order.totalPrice || 0),
        0
      );

      setStats({
        products: products.length,
        users: users.length,
        orders: orders.length,
        revenue,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container-fluid">

      <h2 className="mb-4 fw-bold">
        Sales Report
      </h2>

      <table className="table table-bordered">

        <tbody>

          <tr>
            <th>Total Products</th>
            <td>{stats.products}</td>
          </tr>

          <tr>
            <th>Total Users</th>
            <td>{stats.users}</td>
          </tr>

          <tr>
            <th>Total Orders</th>
            <td>{stats.orders}</td>
          </tr>

          <tr>
            <th>Total Revenue</th>
            <td>₹{stats.revenue}</td>
          </tr>

        </tbody>

      </table>

    </div>
  );
}

export default Reports;