import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ApiClient from "../../services/api-client";
import { Product } from "./Product";
import { useAuth } from "@clerk/clerk-react"


const apiClient = new ApiClient<Product>("/products");

export function useAdminProducts() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const productsQuery = useQuery(["admin-products"], () => apiClient.getAll());

  const addMutation = useMutation(
    async (data: Partial<Product>) => {
      const token = (await getToken()) ?? undefined;
      return await apiClient.post(data, token);
    },
    {
      onSuccess: () => queryClient.invalidateQueries(["admin-products"]),
    }
  );

  const editMutation = useMutation(
    async ({ id, ...data }: Product) => {
      const url = `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_PORT_PRODUCT}/products/${id}`;
      console.log("Calling apiClient.put", id, data);
      console.log("Full URL:", url);
      const token = (await getToken()) ?? undefined;
      return await apiClient.put(id, data, token);
    },
    { onSuccess: () => queryClient.invalidateQueries(["admin-products"]) }
  );

  const deleteMutation = useMutation(
    async (id: string) => {
      const token = (await getToken()) ?? undefined;
      return await apiClient.delete(id, token);
    },
    {
      onSuccess: () => queryClient.invalidateQueries(["admin-products"]),
    }
  );

  return {
    products: productsQuery.data,
    isLoading: productsQuery.isLoading,
    addProduct: addMutation.mutateAsync,
    editProduct: editMutation.mutateAsync,
    deleteProduct: deleteMutation.mutateAsync,
  };
}