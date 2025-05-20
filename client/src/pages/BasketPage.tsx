import { Heading, Box, Text } from "@chakra-ui/react";

const BasketPage = () => {
  // You would fetch basket items from state or API here
  return (
    <Box p={6}>
      <Heading mb={4}>Your Basket</Heading>
      <Text>Your basket is empty.</Text>
    </Box>
  );
};

export default BasketPage;