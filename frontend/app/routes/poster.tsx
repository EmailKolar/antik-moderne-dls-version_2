import getRequestClient from "~/lib/getRequestClient";
import type { Route } from "./+types/poster";
import { CiShoppingBasket } from "react-icons/ci";
import useCart from "~/hooks/useCart";
import { Button } from "~/components/ui/button";
import { Heart, Minus, Plus, RefreshCw, Share, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import type { types } from "~/lib/client";
import { toast } from "sonner";

export function loader({ params }: Route.LoaderArgs) {
  const posterId = Number(params.posterId);
  if (isNaN(posterId)) {
    throw new Error("Invalid poster ID");
  }

  return (async () => {
    const poster = await getRequestClient(undefined, true).product.getPoster(posterId);
    return poster;
  })();
}

export default function Poster({ loaderData }: Route.ComponentProps) {
  const { poster } = loaderData;
  const { addItemToCart } = useCart();
  const [quantities, setQuantities] = useState<{ format: types.Format; quantity: number }[]>([]);

  useEffect(() => {
    setQuantities(poster.formatPrices.map((curPoster) => ({ format: curPoster.format, quantity: 0 })));
  }, []);

  const handleUpdateQuantity = (formatToUpdate: types.Format, shouldIncrease: boolean) => {
    setQuantities((cur) => {
      const updatedMap = cur.map((formatQuant) => {
        if (formatQuant.format === formatToUpdate) {
          return {
            ...formatQuant,
            quantity: shouldIncrease ? formatQuant.quantity + 1 : Math.max(0, formatQuant.quantity - 1),
          };
        }
        return formatQuant;
      });
      return updatedMap;
    });
  };

  const handleAddItemsCart = () => {
    quantities.forEach((formatQuant) => {
      if (formatQuant.quantity !== 0) {
        addItemToCart({
          posterId: poster.id,
          quantity: formatQuant.quantity,
        });
      }
    });
    toast.info("The posters have been added to your shopping cart");
  };

  return (
    <div className="grid p-4 grid-cols-1 md:grid-cols-2 gap-12 mb-16">
      {/* Product Image */}
      <div className="overflow-hidden rounded-lg border bg-white">
        <img src={poster.posterImageUrl} alt={poster.title} className="w-full h-full object-cover " />
      </div>

      {/* Product Info */}
      <div className="flex flex-col">
        <div className="mb-1">
          <span className="text-sm text-muted-foreground">{poster.title}</span>
        </div>

        <h1 className="text-3xl font-bold mb-3">{poster.artistFullName}</h1>

        {/* <div className="mb-6">
          <p className="text-2xl font-medium">${poster.formatPrices[0].price.toFixed(2)}</p>
        </div> */}

        {poster.formatPrices.map((formatPrice) => {
          return (
            <div key={formatPrice.id} className="flex justify-center items-center">
              <p>{formatPrice.format}</p>
              <button
                onClick={() => addItemToCart({ posterId: poster.id, quantity: 1 })}
                className="flex items-center justify-center border border-black p-1 hover:cursor-pointer hover:scale-105 m-2 relative group h-8 w-28"
              >
                <CiShoppingBasket className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out" />
                <span className="absolute transition-opacity duration-300 ease-in-out opacity-100 group-hover:opacity-0">
                  {formatPrice.price.toFixed(2)}.-
                </span>
              </button>

              {/* Quantity Selector */}
              <div className="flex items-center">
                <span className="text-sm font-medium mr-4">Quantity</span>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-none"
                    onClick={() => handleUpdateQuantity(formatPrice.format, false)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="w-12 text-center">
                    {quantities.find((formatQuant) => formatQuant.format === formatPrice.format)?.quantity ?? 0}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleUpdateQuantity(formatPrice.format, true)}
                    className="h-10 w-10 rounded-none"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <Button className="gap-2 flex-1" onClick={() => handleAddItemsCart()}>
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
          <Button variant="outline" size="icon">
            <Heart className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => console.log("IMPLEMENT ME handleShare")}>
            <Share className="h-4 w-4" />
          </Button>
        </div>

        {/* Product Features */}
        <div className="space-y-4 border-t pt-6">
          <div className="flex items-start gap-3">
            <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Free Shipping</h4>
              <p className="text-sm text-muted-foreground">Free shipping on orders over $50</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Secure Payment</h4>
              <p className="text-sm text-muted-foreground">100% secure payment processing</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <RefreshCw className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Easy Returns</h4>
              <p className="text-sm text-muted-foreground">14-day easy return policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    // <div className="w-full h-full flex items-center justify-around mt-8">
    //   <div className="w-[70%] flex flex-col items-center justify-center">
    //     <h1 className="text-6xl text-black text-left font-bold mb-2">{poster.title}</h1>
    //     <p className="italic text-lg">
    //       By: <span className="underline">{poster.artistFullName}</span>
    //     </p>
    //     <img className="w-[50%] mt-4" src={poster.posterImageUrl} alt={poster.title} />
    //   </div>
    //   <div className="w-[30%] h-[80%] flex flex-col items-start">
    //     <h2 className="text-2xl font-semibold mb-6">Select size:</h2>

    //     {poster.formatPrices.map((formatPrice) => {
    //       return (
    //         <div key={formatPrice.id} className="w-[65%] flex items-center justify-between space-x-2 mt-4">
    //           <p>{formatPrice.format}</p>
    //           <button
    //             onClick={() => {
    //               addItemToCart({ posterId: poster.id, quantity: 1 });
    //             }}
    //             className="flex items-center justify-center border border-black p-1 hover:cursor-pointer hover:scale-105 mt-2 relative group h-8 w-28"
    //           >
    //             <CiShoppingBasket className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out" />
    //             <span className="absolute transition-opacity duration-300 ease-in-out opacity-100 group-hover:opacity-0">
    //               {formatPrice.price.toFixed(2)}.-
    //             </span>
    //           </button>
    //         </div>
    //       );
    //     })}
    //   </div>
    // </div>
  );
}
