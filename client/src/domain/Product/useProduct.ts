import ApiClient from "../../services/api-client";
import { useQuery } from "@tanstack/react-query";
import { Product } from "./Product";


const apiClient = new ApiClient<Product>("/products/:id");

const useProduct = (productId: string) =>
  useQuery<Product, Error>({
    queryKey: ["product", productId],
    queryFn: () => apiClient.get(productId),
    staleTime: Infinity,
  });

export default useProduct;