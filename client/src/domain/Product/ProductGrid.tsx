import { SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import useProducts from "./useProducts";
import ProductCard from "./ProductCard";
//skeleton
import ProductCardContainer from "./ProductCardContainer";


const ProductGrid = () => {
  //const skeletons = [...Array(20).keys()];

  const { data, error, } = useProducts();
  console.log(data)

  if (error) return <Text color="tomato">{error.message}</Text>;


  return (
  
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
        spacing={4}
        paddingY={10}
      >
  
          {data?.map((product) => (
            <ProductCardContainer key={product.id}>
              <ProductCard product={product} />
            </ProductCardContainer>
          ))}
       
       
      </SimpleGrid>

  );
};

export default ProductGrid;