import { Card, CardBody, Heading, HStack, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Product } from "./Product";

const PLACEHOLDER_IMAGE = "https://placehold.co/600x400";

interface Props {
    product: Product;
}

const ProductCard = ({ product }: Props) => {
    return (
        <Card overflow={"hidden"} borderRadius={10}>
            <Link to={`/products/${product.id}`}>
                <Image
                    src={product.imageUrl !== "" ? product.imageUrl : PLACEHOLDER_IMAGE}
                    alt={product.name}
                    maxW="400px"
                    maxH="400px"
                    objectFit="contain"
                    display="block"
                    mx="auto"
                    width="100%"
                />
            </Link>
            <CardBody>
                <Heading fontSize="2xl">
                    <HStack>
                        <Link to={`/products/${product.id}`}>
                            {product.name}
                        </Link>
                        <span style={{ fontSize: "1.2em", color: "gray" }}>
                            {product.price} kr
                        </span>
                    </HStack>
                </Heading>
                <HStack justifyContent={"space-between"}></HStack>
            </CardBody>
        </Card>
    );
};

export default ProductCard;