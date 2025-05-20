import { SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import useProducts from "./useProducts";
import ProductCard from "./ProductCard";
//skeleton
import ProductCardContainer from "./ProductCardContainer";


interface Props {
  selectedCategoryId?: string;
}

const ProductGrid = ({ selectedCategoryId }: Props) => {
  const { data, error, } = useProducts();
  console.log(data)

  if (error) return <Text color="tomato">{error.message}</Text>;


  // Filter products by category if selectedCategoryId is provided
  const filteredProducts = selectedCategoryId
    ? data?.filter((product) => product.category === selectedCategoryId)
    : data;

  return (
  
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
        spacing={4}
        paddingY={10}
      >
  
          {filteredProducts?.map((product) => (
            <ProductCardContainer key={product.id}>
              <ProductCard product={product} />
            </ProductCardContainer>
          ))}
       
       
      </SimpleGrid>

  );
};

export default ProductGrid;