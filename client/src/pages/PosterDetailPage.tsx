import { Heading, Spinner, Image } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import useProduct from "../domain/Product-domain/useProduct";
import ProductAttributes from "../domain/Product-domain/ProductAttributes";

const PosterDetailPage = () => {
  const { id } = useParams();
  const { data: product, error, isLoading } = useProduct(id!);

  if (isLoading) return <Spinner />;
  if (error || !product) throw error;

  return (
    <>
      <Heading as="h1" size="2xl" mb={4}>
        {product.name}
      </Heading>
      <Image
        src={product.imageUrl !== "" ? product.imageUrl : "https://placehold.co/600x400"}
        alt={product.name}
        maxW="400px"
        maxH="400px"
        objectFit="contain"
        mb={4}
        borderRadius="md"
        boxShadow="md"
      />
      <ProductAttributes product={product} />
    </>
  );
};

export default PosterDetailPage;