import api from "./api";

export const getAllBrands = async () => {
  const { data } = await api.get("/brands");
  return data;
};