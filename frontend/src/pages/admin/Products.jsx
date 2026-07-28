import { useEffect, useState } from "react";
import api from "../../services/api";
import { deleteProduct } from "../../services/adminService";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products");
      setProducts(data.products);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (productId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this product?"
  );

  if (!confirmDelete) return;

  try {
    await deleteProduct(productId);

    toast.success("Product deleted successfully.");

    fetchProducts();
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to delete product."
    );
  }
};

  return (
    <div className="container-fluid">
        <ToastContainer />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Products</h2>

        <button
  className="btn btn-primary"
  onClick={() => navigate("/admin/products/add")}
>
  + Add Product
</button>
      </div>

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Stock</th>
            <th width="180">Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product, index) => (
            <tr key={product._id}>
              <td>{index + 1}</td>

              <td>
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  width="60"
                  height="60"
                  style={{ objectFit: "cover" }}
                />
              </td>

              <td>{product.name}</td>
              <td>₹{product.price}</td>
              <td>{product.brand?.name}</td>
              <td>{product.category?.name}</td>
              <td>{product.stock}</td>

              <td>
                <button
  className="btn btn-warning btn-sm me-2"
  onClick={() => navigate(`/admin/products/edit/${product._id}`)}
>
  Edit
</button>

                <button
  className="btn btn-danger btn-sm"
  onClick={() => handleDelete(product._id)}
>
  Delete
</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Products;