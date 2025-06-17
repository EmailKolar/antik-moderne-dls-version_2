import { useQuery } from "@tanstack/react-query";
import ApiClient from "../../services/api-client";
import { Product } from "./Product";


const apiClient = new ApiClient<Product>("/products");

const useProducts = (search?: string) =>
  useQuery<Product[], Error>(
    ["products", search],
    () => apiClient.getAll({ params: search ? { search } : {} }),
    { staleTime: Infinity }
  );

export default useProducts;