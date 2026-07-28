import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast, ToastContainer } from "react-toastify";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(data.categories);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = async () => {
    if (!name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    try {
      await api.post("/categories", { name });

      toast.success("Category added successfully.");

      setName("");

      fetchCategories();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add category."
      );
    }
  };

  return (
    <div className="container-fluid">
      <ToastContainer />

      <h2 className="mb-4">Category Management</h2>

      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Enter category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          className="btn btn-primary"
          onClick={handleAdd}
        >
          Add Category
        </button>
      </div>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Category Name</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((category, index) => (
            <tr key={category._id}>
              <td>{index + 1}</td>
              <td>{category.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Categories;