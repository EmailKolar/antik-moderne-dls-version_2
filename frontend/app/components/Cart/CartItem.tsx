import type { types } from "~/lib/client";
import { MdRemoveCircle } from "react-icons/md";
import useCart from "~/hooks/useCart";

interface CartItemProps {
  cartItem: types.BasketItemDto;
}

export const CartItem = ({ cartItem }: CartItemProps) => {
  const { removeItemFromCart } = useCart();

  return (
    <div className="relative flex items-center justify-start w-full mt-2">
      <MdRemoveCircle
        onClick={() => removeItemFromCart(cartItem.id)}
        className="absolute -left-1 -top-1 rounded-full w-4 h-4 text-red-500 cursor-pointer font-semibold z-50"
      />
      <img src={cartItem.poster.posterImageUrl} alt={cartItem.poster.title} className="rounded-md w-12 h-12" />
      <div className="flex flex-col items-start justify-start w-full ml-2">
        <h2 className="text-sm font-semibold">{cartItem.poster.title}</h2>
        <h2 className="text-sm">Format</h2>
      </div>
      <p className="text-xs">Price {cartItem.poster.formatPrices[0].price} DKK,-</p>
    </div>
  );
};
