import {create} from "zustand";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { UserResource } from "@clerk/types";


interface BasketItem {
  productId: string;
  quantity: number;
  basketId: string;
}

interface BasketState {
  items: BasketItem[];
  fetchBasket: (userId: string) => Promise<void>;
  addToBasket: (userId: string, item: BasketItem) => Promise<void>;
  clearBasket: (userId: string) => Promise<void>;
  updateQuantity: (userId: string, productId: string, quantity: number) => Promise<void>;
  removeItem: (userId: string, productId: string) => Promise<void>;
  checkoutBasket: (basketId: string) => Promise<any>;
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
  const res = await basketApi.post(
    "/api/basket/item",
    { ...item, userId },
    { headers: { "Idempotency-Key": idempotencyKey } }
  );
  // The backend now returns { item, basket }
  if (res.data && res.data.basket && res.data.basket.items) {
    set({ items: res.data.basket.items });
  } else {
    await get().fetchBasket(userId);
  }
},
clearBasket: async (userId) => {
  await basketApi.delete("/api/basket", { data: { userId } });
  set({ items: [] });
},
updateQuantity: async (userId: string, productId: string, quantity: number) => {
  console.log("Updating quantity for product:", productId, "to", quantity, "for user:", userId);
  await basketApi.post("/api/basket/item", { userId, productId, quantity });
  await get().fetchBasket(userId);
},
removeItem: async (userId: string, productId: string) => {
  await basketApi.delete("/api/basket/item", { data: { userId, productId } });
  await get().fetchBasket(userId);
},

checkoutBasket: async (basketId: string) => {
  const res = await basketApi.post(`/api/baskets/${basketId}/checkout`);
  set({ items: [] });
  console.log("Checkout response:", res.data);
  return {orderId: res.data};
}

}));
