import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function RecentlyViewed() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const recent =
      JSON.parse(localStorage.getItem("recentProducts")) || [];

    setProducts(recent);
  }, []);

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-5">
      <h3 className="mb-4">Recently Viewed</h3>

      <div className="row">
        {products.map((product) => (
          <div
            className="col-md-3 mb-4"
            key={product._id}
          >
            <div className="card h-100 shadow-sm">

              <img
                src={product.images?.[0]}
                alt={product.name}
                className="card-img-top"
                style={{
                  height: "220px",
                  objectFit: "cover",
                }}
              />

              <div className="card-body">
                <h6>{product.name}</h6>

                <h5 className="text-primary">
                  ₹{product.price}
                </h5>

                <Link
                  to={`/product/${product._id}`}
                  className="btn btn-outline-primary w-100"
                >
                  View Again
                </Link>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentlyViewed;