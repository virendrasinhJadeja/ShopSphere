import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast, ToastContainer } from "react-toastify";

function Brands() {
  const [brands, setBrands] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const { data } = await api.get("/brands");
      setBrands(data.brands);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = async () => {
    if (!name.trim()) {
      toast.error("Brand name is required.");
      return;
    }

    try {
      await api.post("/brands", { name });

      toast.success("Brand added successfully.");

      setName("");

      fetchBrands();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add brand."
      );
    }
  };

  return (
    <div className="container-fluid">
      <ToastContainer />

      <h2 className="mb-4">Brand Management</h2>

      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Enter brand name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          className="btn btn-primary"
          onClick={handleAdd}
        >
          Add Brand
        </button>
      </div>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Brand Name</th>
          </tr>
        </thead>

        <tbody>
          {brands.map((brand, index) => (
            <tr key={brand._id}>
              <td>{index + 1}</td>
              <td>{brand.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Brands;