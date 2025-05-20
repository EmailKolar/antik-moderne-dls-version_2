import { useQuery } from "@tanstack/react-query";
import ApiClient from "../../services/api-client";
import { Product } from "./Product";


const apiClient = new ApiClient<Product>("/products");

const useProducts = () =>
  useQuery<Product[], Error>(
    ["products"],
    () => apiClient.getAll(),
    { staleTime: Infinity }
  );

export default useProducts;