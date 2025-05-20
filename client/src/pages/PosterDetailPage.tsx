import { Heading, Spinner, Image, Modal, ModalOverlay, ModalContent, ModalBody, useDisclosure, Button, useToast } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import useProduct from "../domain/Product-domain/useProduct";
import ProductAttributes from "../domain/Product-domain/ProductAttributes";

const PosterDetailPage = () => {
  const { id } = useParams();
  const { data: product, error, isLoading } = useProduct(id);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  if (!id) return <Spinner />;
  if (isLoading) return <Spinner />;
  if (error || !product) throw error;

  const imageUrl = product.imageUrl !== "" ? product.imageUrl : "https://placehold.co/600x400";

  const handleAddToBasket = () => {
    toast({
      title: "Added to basket",
      description: `${product.name} was added to your basket.`,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
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