import { useCompare } from "../../context/CompareContext";

function CompareProducts() {
  const {
    compareItems,
    removeFromCompare,
    clearCompare,
  } = useCompare();

  if (compareItems.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <h2>No Products Selected</h2>
        <p>Add products to compare.</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between mb-4">
        <h2>Compare Products</h2>

        <button
          className="btn btn-danger"
          onClick={clearCompare}
        >
          Clear All
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered text-center align-middle">

          <thead className="table-dark">
            <tr>
              <th>Feature</th>

              {compareItems.map((item) => (
                <th key={item._id}>
                  {item.name}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>

            <tr>
              <th>Image</th>

              {compareItems.map((item) => (
                <td key={item._id}>
                  <img
                    src={item.images?.[0]}
                    alt={item.name}
                    width="150"
                    className="img-fluid rounded"
                  />
                </td>
              ))}
            </tr>

            <tr>
              <th>Price</th>

              {compareItems.map((item) => (
                <td key={item._id}>
                  ₹{item.price}
                </td>
              ))}
            </tr>

            <tr>
              <th>Category</th>

              {compareItems.map((item) => (
                <td key={item._id}>
                  {item.category?.name}
                </td>
              ))}
            </tr>

            <tr>
              <th>Brand</th>

              {compareItems.map((item) => (
                <td key={item._id}>
                  {item.brand?.name}
                </td>
              ))}
            </tr>

            <tr>
              <th>Stock</th>

              {compareItems.map((item) => (
                <td key={item._id}>
                  {item.stock}
                </td>
              ))}
            </tr>

            <tr>
              <th>Rating</th>

              {compareItems.map((item) => (
                <td key={item._id}>
                  ⭐ {item.ratings}
                </td>
              ))}
            </tr>

            <tr>
              <th>Remove</th>

              {compareItems.map((item) => (
                <td key={item._id}>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() =>
                      removeFromCompare(item._id)
                    }
                  >
                    Remove
                  </button>
                </td>
              ))}
            </tr>

          </tbody>

        </table>
      </div>
    </div>
  );
}

export default CompareProducts;