import { Heading, Box, Text, List, ListItem, Button, HStack, Image, Spinner } from "@chakra-ui/react";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useBasketStore } from "../domain/Basket/useBasketStore";
import axios from "axios";
import {Link} from "react-router-dom";



interface Product {
  id: string;
  name: string;
  imageUrl: string;
}

const PLACEHOLDER_IMAGE = "https://placehold.co/64x64";

const BasketPage = () => {
  const { user } = useUser();
  const { items, fetchBasket, clearBasket , updateQuantity, removeItem} = useBasketStore();
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) fetchBasket(user.id);
  }, [user, fetchBasket]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const productIds = items.map((item) => item.productId);
      const uniqueIds = Array.from(new Set(productIds));
      const productData: Record<string, Product> = {};
      await Promise.all(
        uniqueIds.map(async (id) => {
          try {
            // Adjust the URL/port as needed for your product service
            const res = await axios.get(
              `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_PORT_PRODUCT}/products/${id}`
            );
            productData[id] = res.data;
          } catch {
            productData[id] = {
              id,
              name: "Unknown product",
              imageUrl: PLACEHOLDER_IMAGE,
            };
          }
        })
      );
      setProducts(productData);
      setLoading(false);
    };
    if (items.length > 0) fetchProducts();
  }, [items]);

  if (!user) return <Text>Please sign in to view your basket.</Text>;

  return (
    <Box p={6}>
      <Heading mb={4}>Your Basket</Heading>
      {items.length === 0 ? (
        <Text>Your basket is empty.</Text>
      ) : loading ? (
        <Spinner />
      ) : (
        <List spacing={3} mb={4}>
          {items.map((item) => {
            const product = products[item.productId];
            return (
            <ListItem key={item.productId}>
              <HStack>
                <Image
                  src={product?.imageUrl || PLACEHOLDER_IMAGE}
                  alt={product?.name}
                  boxSize="48px"
                  borderRadius={8}
                  objectFit="cover"
                />
                <Link to={`/products/${product?.id}`}>
                  <Text fontWeight="bold" _hover={{ textDecoration: "underline", color: "teal.500" }}>
                    {product?.name || "Unknown product"}
                  </Text>
                </Link>
               <Button
  size="sm"
  onClick={() =>
    item.quantity <= 1
      ? removeItem(user.id, item.productId)
      : updateQuantity(user.id, item.productId, item.quantity - 1)
  }
>-</Button>
                <Text color="gray.500" minW="24px" textAlign="center">x {item.quantity}</Text>
                <Button size="sm" onClick={() => updateQuantity(user.id, item.productId, item.quantity + 1)}>+</Button>
              </HStack>
            </ListItem>
            );
          })}
        </List>
      )}
      <Button
        colorScheme="red"
        onClick={() => clearBasket(user.id)}
        disabled={items.length === 0}
      >
        Clear Basket
      </Button>
    </Box>
  );
};

export default BasketPage;