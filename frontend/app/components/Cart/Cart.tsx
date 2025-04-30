import { useAtomValue } from "jotai";
import { cartAtom } from "~/atoms/cartAtom";
import { CartItem } from "./CartItem";

const Cart = () => {
  const cart = useAtomValue(cartAtom);

  return (
    <div className="flex flex-col items-start justify-start">
      <h1 className="text-lg">Cart</h1>
      <div className="border-b w-[95%] mb-2" />

      {cart?.basketItems && cart.basketItems.length < 1 && <p>no items</p>}

      {cart?.basketItems.map((cartItem) => (
        <CartItem key={cartItem.id} cartItem={cartItem} />
      ))}

      <div className="border-b w-[95%] mb-2 mt-2" />

      <div className="w-full flex items-center justify-start">
        <button
          hidden={cart?.basketItems && cart?.basketItems.length < 1}
          className="border border-black  py-1 px-1.5 font-semibold drop-shadow-mg hover:cursor-pointer hover:scale-105 mt-2"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
