import { createContext, useContext, useState } from "react";

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareItems, setCompareItems] = useState([]);

  const addToCompare = (product) => {
    const exists = compareItems.find(
      (item) => item._id === product._id
    );

    if (exists) return;

    if (compareItems.length >= 4) {
      alert("You can compare only 4 products.");
      return;
    }

    setCompareItems([...compareItems, product]);
  };

  const removeFromCompare = (id) => {
    setCompareItems(
      compareItems.filter((item) => item._id !== id)
    );
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        clearCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => useContext(CompareContext);