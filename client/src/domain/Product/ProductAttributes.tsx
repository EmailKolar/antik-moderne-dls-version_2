import {SimpleGrid, Text} from "@chakra-ui/react";
import { Product } from "./Product";
import DefinitionItem from "../../components/DefinitionItem";

interface Props {
  product: Product;
}
const ProductAttributes = ({ product }: Props) => {
    return (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={4}>
        <DefinitionItem term="Name">{product.name}</DefinitionItem>
        <DefinitionItem term="Description">
            {product.description}
        </DefinitionItem>
        <DefinitionItem term="Price">
            {product.price}
        </DefinitionItem>
        <DefinitionItem term="Category">
            {product.category}
        </DefinitionItem>
        <DefinitionItem term="Stock">
            {product.stock}
        </DefinitionItem>
        </SimpleGrid>
    );
    }
export default ProductAttributes;