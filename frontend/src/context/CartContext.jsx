import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const fetchCounts = async () => {
  console.log("Fetching latest counts...");
    try {
      const cartRes = await api.get("/cart");
      const wishlistRes = await api.get("/wishlist");

      setCartCount(cartRes.data.cart?.items?.length || 0);
      setWishlistCount(wishlistRes.data.wishlist?.length || 0);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetchCounts();
    }
  }, []);

  useEffect(() => {
  console.log("Cart Count Changed:", cartCount);
  console.log("Wishlist Count Changed:", wishlistCount);
}, [cartCount, wishlistCount]);

  return (
    <CartContext.Provider
      value={{
        cartCount,
        wishlistCount,
        fetchCounts,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);