import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ApiClient from "../../services/api-client";
import { Product } from "./Product";

const apiClient = new ApiClient<Product>("/products");

export function useAdminProducts() {
  const queryClient = useQueryClient();

  const productsQuery = useQuery(["admin-products"], () => apiClient.getAll());

  const addMutation = useMutation((data: Partial<Product>) => apiClient.post(data), {
    onSuccess: () => queryClient.invalidateQueries(["admin-products"]),
  });

  const editMutation = useMutation(
    ({ id, ...data }: Product) => apiClient.put(id, data),
    { onSuccess: () => queryClient.invalidateQueries(["admin-products"]) }
  );

  const deleteMutation = useMutation((id: string) => apiClient.delete(id), {
    onSuccess: () => queryClient.invalidateQueries(["admin-products"]),
  });

  return {
    products: productsQuery.data,
    isLoading: productsQuery.isLoading,
    addProduct: addMutation.mutateAsync,
    editProduct: editMutation.mutateAsync,
    deleteProduct: deleteMutation.mutateAsync,
  };
}