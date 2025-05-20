import { HStack, Box, Flex } from "@chakra-ui/react";
import { useState } from "react";

import CategorySidebar from "../domain/Category/CategorySidebar";
import ProductGrid from "../domain/Product-domain/ProductGrid";
import useCategory from "../domain/Category/useCategory";

function HomePage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();

  return (
    <HStack align="start" spacing={0}>
      <Box minW="200px" maxW="220px" width="5%">
        <CategorySidebar
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
          useCategoryHook={useCategory}
        />
      </Box>
      <Box flex="1" p={4}>
        <ProductGrid selectedCategoryId={selectedCategoryId} />
      </Box>
    </HStack>
  );
}

export default HomePage;