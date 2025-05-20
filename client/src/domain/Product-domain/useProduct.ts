import ApiClient from "../../services/api-client";
import { useQuery } from "@tanstack/react-query";
import { Product } from "./Product";



const apiClient = new ApiClient<Product>("/products/");

const useProduct = (id?: string) =>
  useQuery<Product, Error>(
    ["product", id],
    () => apiClient.get(id!),
    { enabled: !!id }
  );

export default useProduct;