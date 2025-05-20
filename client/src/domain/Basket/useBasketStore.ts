import {create} from "zustand";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { UserResource } from "@clerk/types";

interface BasketItem {
  productId: string;
  quantity: number;
  // Add other fields as needed
}

interface BasketState {
  items: BasketItem[];
  fetchBasket: (userId: string) => Promise<void>;
  addToBasket: (userId: string, item: BasketItem) => Promise<void>;
  clearBasket: (userId: string) => Promise<void>;
}

// Create a custom axios instance for the basket API
const basketApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_PORT_BASKET}`,
});

export const useBasketStore = create<BasketState>((set, get) => ({
  items: [],
fetchBasket: async (userId) => {
  const res = await basketApi.post('/api/basket', { userId });
  set({ items: res.data.items });
  
},
addToBasket: async (userId, item) => {
  const idempotencyKey = uuidv4();
  await basketApi.post(
    "/api/basket/item",
    { ...item, userId },
    { headers: { "Idempotency-Key": idempotencyKey } }
  );
  await get().fetchBasket(userId);
},
clearBasket: async (userId) => {
  await basketApi.delete("/api/basket", { data: { userId } });
  set({ items: [] });
},
}));
