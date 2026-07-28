import { useEffect, useState } from "react";
import api from "../../services/api";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/auth/users");
      setUsers(data.users);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container-fluid">
      <h2 className="mb-4">User Management</h2>

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Created</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.phone || "-"}</td>
              <td>
                <span
                  className={`badge ${
                    user.role === "admin"
                      ? "bg-danger"
                      : "bg-primary"
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td>
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Users;