import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const ProductCardContainer = ({ children }: Props) => {
  return (
    <Box
      _hover={{ transform: "scale(1.05)", transition: "0.2s" }}
      overflow="hidden"
      borderRadius={10}
    >
      {children}
    </Box>
  );
};

export default ProductCardContainer;