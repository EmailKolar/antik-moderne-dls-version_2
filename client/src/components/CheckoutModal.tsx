import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton,
  Button, List, ListItem, Text, useToast, Spinner
} from "@chakra-ui/react";
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

interface Product {
  id: string;
  name: string;
  imageUrl: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: { productId: string; quantity: number }[];
  products: Record<string, Product>;
  basketId: string;
  checkoutBasket: (basketId: string) => Promise<{ orderId: string }>;
}

const CheckoutModal = ({
  isOpen,
  onClose,
  items,
  products,
  basketId,
  checkoutBasket,
}: CheckoutModalProps) => {
  const toast = useToast();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [, setOrderId] = useState<string | null>(null);
  const { user } = useUser();

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const res = await checkoutBasket(basketId); // Should return { orderId }
      setOrderId(res.orderId);

      // Start polling for order status
      const poll = async () => {
        if (!user || !res.orderId) {
          console.error("User or orderId is not defined", user, res.orderId);
          return;
        }
        try {
          const statusRes =await axios.get(`${import.meta.env.VITE_API_URL}3005/orders/${user.id}/${res.orderId}`);
          const status = statusRes.data.status;
          // Accept both string and enum values
          if (status === "confirmed" || status === "CONFIRMED") {
            toast({
              title: "Order confirmed!",
              description: "Your order is ready for pickup.",
              status: "success",
              duration: 4000,
              isClosable: true,
            });
            onClose();
          } else if (status === "rejected" || status === "REJECTED" || status === "cancelled" || status === "CANCELLED") {
            toast({
              title: "Order rejected",
              description: statusRes.data.reason || "Some items may be out of stock.",
              status: "error",
              duration: 4000,
              isClosable: true,
            });
            onClose();
          } else {
            setTimeout(poll, 2000);
          }
        } catch (e) {
          setTimeout(poll, 2000);
        }
      };
      poll();
    } catch (error: any) {
      toast({
        title: "Checkout failed",
        description: error?.response?.data?.error || "Unknown error.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm Your Order</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={2}>You are about to place an order for pickup:</Text>
          <List spacing={2}>
            {items.map((item) => (
              <ListItem key={item.productId}>
                {products[item.productId]?.name || "Unknown product"} x {item.quantity}
              </ListItem>
            ))}
          </List>
          <Text mt={4} fontWeight="bold">Pickup only – no payment required.</Text>
          {isCheckingOut && <Spinner mt={4} />}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} mr={3} variant="ghost" disabled={isCheckingOut}>
            Cancel
          </Button>
          <Button
            colorScheme="teal"
            onClick={handleCheckout}
            isLoading={isCheckingOut}
            disabled={isCheckingOut}
          >
            Confirm Order
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CheckoutModal;