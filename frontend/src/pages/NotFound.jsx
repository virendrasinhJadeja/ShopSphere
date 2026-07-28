import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div
      className="container d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <h1 className="display-1 fw-bold text-danger">404</h1>

      <h3>Page Not Found</h3>

      <p className="text-muted">
        The page you are looking for does not exist.
      </p>

      <Link to="/" className="btn btn-primary mt-3">
        Go to Home
      </Link>
    </div>
  );
}

export default NotFound;