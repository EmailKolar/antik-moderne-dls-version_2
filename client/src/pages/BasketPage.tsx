import { Heading, Box, Text, List, ListItem, Button } from "@chakra-ui/react";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useBasketStore } from "../domain/Basket/useBasketStore";

const BasketPage = () => {
  const { user } = useUser();
  const { items, fetchBasket, clearBasket } = useBasketStore();

  useEffect(() => {
    if (user) fetchBasket(user.id);
  }, [user, fetchBasket]);

  if (!user) return <Text>Please sign in to view your basket.</Text>;

  return (
    <Box p={6}>
      <Heading mb={4}>Your Basket</Heading>
      {items.length === 0 ? (
        <Text>Your basket is empty.</Text>
      ) : (
        <List spacing={3} mb={4}>
          {items.map((item) => (
            <ListItem key={item.productId}>
              Product: {item.productId} | Quantity: {item.quantity}
            </ListItem>
          ))}
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