import { Heading, Spinner, Image, Modal, ModalOverlay, ModalContent, ModalBody, useDisclosure, Button, useToast, Link} from "@chakra-ui/react";
import { useParams, useNavigate} from "react-router-dom";
import useProduct from "../domain/Product-domain/useProduct";
import ProductAttributes from "../domain/Product-domain/ProductAttributes";
import { useBasketStore } from "../domain/Basket/useBasketStore";
import { useUser } from "@clerk/clerk-react";

const PosterDetailPage = () => {
  const { id } = useParams();
  const { data: product, error, isLoading } = useProduct(id);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { user } = useUser();
  const addToBasket = useBasketStore((state) => state.addToBasket);
  const navigate = useNavigate();
  const basketId = useBasketStore((state) => state.items[0]?.basketId);

  if (!id) return <Spinner />;
  if (isLoading) return <Spinner />;
  if (error || !product) throw error;

  const imageUrl = product.imageUrl !== "" ? product.imageUrl : "https://placehold.co/600x400";

  const handleAddToBasket = () => {
      if (!user) {
    toast({
      title: "Please sign in",
      description: "You must be signed in to add items to your basket.",
      status: "warning",
      duration: 3000,
      isClosable: true,
    });
    return;
  }
    if (user && product) {
      addToBasket(user.id, { productId: product.id, quantity: 1 , basketId: basketId });
      toast({
        title: "Added to basket",
        description: `${product.name} was added to your basket.`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Heading as="h1" size="2xl" mb={4}>
        {product.name}
      </Heading>
      <Image
        src={imageUrl}
        alt={product.name}
        maxW="400px"
        maxH="400px"
        objectFit="contain"
        mb={4}
        borderRadius="md"
        boxShadow="md"
        cursor="pointer"
        onClick={onOpen}
      />
      <ProductAttributes product={product} />
      <Button colorScheme="teal" size="lg" mb={6} onClick={handleAddToBasket}>
        Add to Basket
      </Button>
      <Button
          marginLeft={1}
          mb={6} 
          colorScheme="gray"
          size="lg"
          variant="outline"
          onClick={() => navigate("/basket")}
        >
          Go to Basket
      </Button>
     
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
        <ModalOverlay />
        <ModalContent bg="transparent" boxShadow="none" maxW="90vw" maxH="90vh">
          <ModalBody display="flex" justifyContent="center" alignItems="center" p={0}>
            <Image
              src={imageUrl}
              alt={product.name}
              maxW="90vw"
              maxH="80vh"
              objectFit="contain"
              borderRadius="md"
              boxShadow="lg"
              onClick={onClose}
              cursor="zoom-out"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PosterDetailPage;