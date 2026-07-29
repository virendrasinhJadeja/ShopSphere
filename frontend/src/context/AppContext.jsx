import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const refreshCounts = async () => {
  try {
    console.log("Refreshing counts...");

    const [cartRes, wishlistRes] = await Promise.all([
      api.get("/cart"),
      api.get("/wishlist"),
    ]);

    console.log("Cart:", cartRes.data.cart?.items?.length);
    console.log("Wishlist:", wishlistRes.data.wishlist?.length);

    setCartCount(cartRes.data.cart?.items?.length || 0);
    setWishlistCount(wishlistRes.data.wishlist?.length || 0);
  } catch (err) {
    console.log(err);
  }
};

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    refreshCounts();
  }
}, []);

  const resetCounts = () => {
    setCartCount(0);
    setWishlistCount(0);
  };

  return (
    <AppContext.Provider
      value={{
        cartCount,
        wishlistCount,
        refreshCounts,
        resetCounts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);