import { useQuery } from "@tanstack/react-query";
import ApiClient from "../../services/api-client";

export interface Category {
  id: string;
  name: string;
}

const apiClient = new ApiClient<Category>("/products/categories");

const useCategory = () =>
  useQuery<Category[], Error>(["categories"], () => apiClient.getAll());

export default useCategory;
