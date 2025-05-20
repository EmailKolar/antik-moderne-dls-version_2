import create from "zustand";
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

export const useBasketStore = create<BasketState>((set, get) => ({
  items: [],
  fetchBasket: async (userId) => {
    const res = await axios.get(`/api/basket?userId=${userId}`);
    set({ items: res.data.items });
  },
  addToBasket: async (userId, item) => {
    const idempotencyKey = uuidv4();
    await axios.post(
      "/api/basket/add",
      { ...item, userId },
      { headers: { "Idempotency-Key": idempotencyKey } }
    );
    await get().fetchBasket(userId);
  },
  clearBasket: async (userId) => {
    await axios.post("/api/basket/clear", { userId });
    set({ items: [] });
  },
}));
