import { Heading, Spinner } from "@chakra-ui/react";
//import useProduct from "../domain/product/useProduct";
import useProducts from "../domain/product/useProducts";
import { useParams } from "react-router-dom";
//import ExpandableText from "../components/ExpandableText";
import ProductAttributes from "../domain/product/ProductAttributes";
const PosterDetailPage = () => {
    console.log("PosterDetailPage!!!!");
  const { id } = useParams();
  console.log(id);
  //const { data: product, error, isLoading } = useProduct(id!);
    const {data, error} = useProducts();
    const product = data?.find((product) => product.id === (id!));

  //if (isLoading) return <Spinner />;
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


//TODO: get the correct endpoint
//TODO: add a add to cart button