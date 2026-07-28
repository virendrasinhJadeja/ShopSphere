import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [images, setImages] = useState([]);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    brand: "",
  });

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(data.categories);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBrands = async () => {
    try {
      const { data } = await api.get("/brands");
      setBrands(data.brands);
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

    const formData = new FormData();

    Object.keys(product).forEach((key) => {
      formData.append(key, product[key]);
    });

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      await api.post("/products", formData);

      toast.success("Product added successfully!");

      setTimeout(() => {
        navigate("/admin/products");
      }, 1500);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add product."
      );
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer />

      <h2>Add Product</h2>

      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label>Name</label>
          <input
            className="form-control"
            name="name"
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Description</label>
          <textarea
            className="form-control"
            name="description"
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Price</label>
          <input
            type="number"
            className="form-control"
            name="price"
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Stock</label>
          <input
            type="number"
            className="form-control"
            name="stock"
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Category</label>
          <select
            className="form-select"
            name="category"
            onChange={handleChange}
          >
            <option value="">Select Category</option>

            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Brand</label>
          <select
            className="form-select"
            name="brand"
            onChange={handleChange}
          >
            <option value="">Select Brand</option>

            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Product Images</label>

          <input
            type="file"
            className="form-control"
            multiple
            accept="image/*"
            onChange={(e) => setImages([...e.target.files])}
          />

          <small className="text-muted">
            You can select up to 5 images.
          </small>
        </div>

        <button className="btn btn-success">
          Add Product
        </button>

      </form>
    </div>
  );
}

export default AddProduct;