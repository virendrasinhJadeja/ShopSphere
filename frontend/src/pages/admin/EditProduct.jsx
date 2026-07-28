import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { toast, ToastContainer } from "react-toastify";

function EditProduct() {
  const { id } = useParams();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${id}`);

      setProduct({
        name: data.product.name,
        description: data.product.description,
        price: data.product.price,
        stock: data.product.stock,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/products/${id}`, product);

      toast.success("Product updated successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Update failed."
      );
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer />

      <h2>Edit Product</h2>

      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label>Name</label>
          <input
            className="form-control"
            name="name"
            value={product.name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Description</label>
          <textarea
            className="form-control"
            name="description"
            value={product.description}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Price</label>
          <input
            className="form-control"
            name="price"
            value={product.price}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Stock</label>
          <input
            className="form-control"
            name="stock"
            value={product.stock}
            onChange={handleChange}
          />
        </div>

        <button className="btn btn-success">
          Update Product
        </button>

      </form>
    </div>
  );
}

export default EditProduct;