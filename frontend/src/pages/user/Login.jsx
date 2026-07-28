import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShoppingBag,
} from "react-icons/fa";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", formData);

      login(data.user, data.token);

      toast.success("Login Successful 🎉");

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" />

      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg,#0f172a,#2563eb,#38bdf8)",
        }}
      >
        <div
          className="card border-0 shadow-lg"
          style={{
            width: "430px",
            borderRadius: "25px",
            backdropFilter: "blur(15px)",
          }}
        >
          <div className="card-body p-5">

            <div className="text-center mb-4">

              <div
                className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3"
                style={{
                  width: "70px",
                  height: "70px",
                  fontSize: "28px",
                }}
              >
                <FaShoppingBag />
              </div>

              <h2 className="fw-bold">
                Welcome Back
              </h2>

              <p className="text-muted">
                Login to ShopSphere
              </p>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="mb-3">

                <label className="form-label fw-semibold">
                  Email
                </label>

                <div className="input-group">

                  <span className="input-group-text">
                    <FaEnvelope />
                  </span>

                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

              <div className="mb-3">

                <label className="form-label fw-semibold">
                  Password
                </label>

                <div className="input-group">

                  <span className="input-group-text">
                    <FaLock />
                  </span>

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    className="form-control"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>

                </div>

              </div>

              <div className="d-flex justify-content-between mb-4">

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                  />

                  <label className="form-check-label">
                    Remember Me
                  </label>
                </div>

                <Link
                  to="/forgot-password"
                  className="text-decoration-none"
                >
                  Forgot Password?
                </Link>

              </div>

              <button
                className="btn btn-primary w-100 py-2 fw-bold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Logging In...
                  </>
                ) : (
                  "Login"
                )}
              </button>

            </form>

            <hr />

            <p className="text-center mb-0">

              Don't have an account?

              <Link
                to="/register"
                className="ms-2 fw-bold text-decoration-none"
              >
                Register
              </Link>

            </p>

          </div>
        </div>
      </div>
    </>
  );
}

export default Login;