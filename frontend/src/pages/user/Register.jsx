import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShoppingBag,
} from "react-icons/fa";

import api from "../../services/api";

function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getStrength = () => {
    const password = formData.password;

    if (password.length < 6)
      return {
        text: "Weak",
        color: "danger",
      };

    if (password.length < 10)
      return {
        text: "Medium",
        color: "warning",
      };

    return {
      text: "Strong",
      color: "success",
    };
  };

  const strength = getStrength();

  if (!/^[6-9]\d{9}$/.test(formData.phone)) {
  return toast.error("Please enter a valid 10-digit phone number.");
}

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);

    try {
      await api.post("/auth/register", {
  fullName: formData.fullName,
  email: formData.email,
  phone: formData.phone,
  password: formData.password,
});

      toast.success("Registration Successful 🎉");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed."
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
            width: "470px",
            borderRadius: "25px",
          }}
        >
          <div className="card-body p-5">

            <div className="text-center mb-4">

              <div
                className="rounded-circle bg-success text-white d-inline-flex justify-content-center align-items-center mb-3"
                style={{
                  width: 70,
                  height: 70,
                  fontSize: 28,
                }}
              >
                <FaShoppingBag />
              </div>

              <h2 className="fw-bold">
                Create Account
              </h2>

              <p className="text-muted">
                Join ShopSphere Today
              </p>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="mb-3">
                <label className="fw-semibold">
                  Full Name
                </label>

                <div className="input-group">
                  <span className="input-group-text">
                    <FaUser />
                  </span>

                  <input
                    type="text"
                    className="form-control"
                    name="fullName"
                    placeholder="Enter full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="fw-semibold">
                  Email
                </label>



                <div className="input-group">
                  <span className="input-group-text">
                    <FaEnvelope />
                  </span>

                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
  <label className="fw-semibold">Phone Number</label>

  <div className="input-group">
    <span className="input-group-text">
      +91
    </span>

    <input
      type="tel"
      className="form-control"
      name="phone"
      placeholder="9876543210"
      value={formData.phone}
      onChange={handleChange}
      maxLength={10}
      pattern="[0-9]{10}"
      required
    />
  </div>

  <small className="text-muted">
    Enter a valid 10-digit mobile number.
  </small>
</div>

              <div className="mb-3">
                <label className="fw-semibold">
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
                    className="form-control"
                    name="password"
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

                <small
                  className={`text-${strength.color}`}
                >
                  Password Strength:
                  {" "}
                  {strength.text}
                </small>

              </div>

              <div className="mb-3">
                <label className="fw-semibold">
                  Confirm Password
                </label>

                <div className="input-group">

                  <span className="input-group-text">
                    <FaLock />
                  </span>

                  <input
                    type={
                      showConfirm
                        ? "text"
                        : "password"
                    }
                    className="form-control"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() =>
                      setShowConfirm(!showConfirm)
                    }
                  >
                    {showConfirm ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>

                </div>
              </div>

              <div className="form-check mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  required
                />

                <label className="form-check-label">
                  I agree to the Terms &
                  Conditions
                </label>
              </div>

              <button
                className="btn btn-success w-100 py-2 fw-bold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Creating Account...
                  </>
                ) : (
                  "Register"
                )}
              </button>

            </form>

            <hr />

            <p className="text-center mb-0">
              Already have an account?

              <Link
                to="/login"
                className="ms-2 fw-bold text-decoration-none"
              >
                Login
              </Link>
            </p>

          </div>
        </div>
      </div>
    </>
  );
}

export default Register;