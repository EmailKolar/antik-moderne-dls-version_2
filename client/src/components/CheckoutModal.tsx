import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton,
  Button, List, ListItem, Text, useToast, Spinner
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { io, Socket } from "socket.io-client";

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
  const [orderId, setOrderId] = useState<string | null>(null);
  const { user } = useUser();
  const socketRef = useRef<Socket | null>(null);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const res = await checkoutBasket(basketId); // Should return { orderId }
      setOrderId(res.orderId);

      // Use Socket.IO client
      socketRef.current = io("ws://localhost:3007", {
        query: { userId: user?.id }
      });

      socketRef.current.on("connect", () => {
        socketRef.current?.emit("subscribe", { orderId: res.orderId });
        console.log("✅ Connected to ws server!");
      });

      socketRef.current.on("order-update", (data) => {
        if (data.type === "order-confirmed") {
          toast({
            title: "Order confirmed!",
            description: "Your order is ready for pickup.",
            status: "success",
            duration: 4000,
            isClosable: true,
          });
          socketRef.current?.disconnect();
          onClose();
        } else if (data.type === "order-rejected") {
          toast({
            title: "Order rejected",
            description: data.reason || "Some items may be out of stock.",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
          socketRef.current?.disconnect();
          onClose();
        }
      });
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