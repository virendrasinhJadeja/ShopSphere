import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast, ToastContainer } from "react-toastify"; 

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

const [formData, setFormData] = useState({
  fullName: "",
  phone: "",
});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/auth/profile");
      setUser(data.user);
      setFormData({
  fullName: data.user.fullName || "",
  phone: data.user.phone || "",
});
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
  try {
    const { data } = await api.put("/auth/profile", formData);

    setUser(data.user);

    toast.success("Profile updated successfully");

    setEditing(false);
  } catch (error) {
    console.log(error.response);
    console.log(error.response?.data);

    toast.error(
      error.response?.data?.message || "Failed to update profile"
    );
  }
};
  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h3>Loading Profile...</h3>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-7">

          <div className="card shadow-lg border-0 rounded-4">

            <div className="card-header bg-dark text-white text-center py-4">
              <h2>👤 My Profile</h2>
            </div>

            <div className="card-body p-4">

              <table className="table table-bordered">

                <tbody>

                  <tr>
  <th>Full Name</th>

  <td>
    {editing ? (
      <input
        className="form-control"
        value={formData.fullName}
        onChange={(e) =>
          setFormData({
            ...formData,
            fullName: e.target.value,
          })
        }
      />
    ) : (
      user.fullName
    )}
  </td>
</tr>
                  <tr>
                    <th>Email</th>
                    <td>{user.email}</td>
                  </tr>

                  <tr>
  <th>Phone</th>

  <td>
    {editing ? (
      <input
        className="form-control"
        value={formData.phone}
        onChange={(e) =>
          setFormData({
            ...formData,
            phone: e.target.value,
          })
        }
      />
    ) : (
      user.phone || "Not Added"
    )}
  </td>
</tr>

                  <tr>
                    <th>Role</th>
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
                  </tr>

                  <tr>
                    <th>Joined On</th>
                    <td>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>

                </tbody>

              </table>

              <div className="text-end mt-3">

  {editing ? (
    <button
      className="btn btn-success"
      onClick={handleUpdate}
    >
      Save Changes
    </button>
  ) : (
    <button
      className="btn btn-primary"
      onClick={() => setEditing(true)}
    >
      Edit Profile
    </button>
  )}

</div>

<ToastContainer />

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;