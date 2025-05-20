import { useQuery } from "@tanstack/react-query";
import ApiClient from "../../services/api-client";

export interface Category {
  id: string;
  name: string;
}

const apiClient = new ApiClient<string>("/products/categories");

const useCategory = () =>
  useQuery<Category[], Error>(["categories"], async () => {
    const categories = await apiClient.getAll();
    // Map string categories to objects with id and name
    return categories.map((cat) => ({ id: cat, name: cat }));
  });

export default useCategory;