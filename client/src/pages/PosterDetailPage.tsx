import { Heading, Spinner } from "@chakra-ui/react";
import useProduct from "../domain/product/useProduct";
import { useParams } from "react-router-dom";
//import ExpandableText from "../components/ExpandableText";
import ProductAttributes from "../domain/product/ProductAttributes";
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
        <img
            src={
            product.imageUrl !== ""
                ? product.imageUrl
                : "https://placehold.co/600x400"
            }
            alt={product.name}
        />
        <ProductAttributes product={product}></ProductAttributes>

      
    </>
  );
};

export default PosterDetailPage;