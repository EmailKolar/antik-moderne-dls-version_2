import { HStack, Box } from "@chakra-ui/react";
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import CategorySidebar from "../domain/Category/CategorySidebar";
import ProductGrid from "../domain/Product-domain/ProductGrid";
import useCategory from "../domain/Category/useCategory";



function HomePage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
  const { user,  } = useUser();
  const navigate = useNavigate();
  const isAdmin = user?.publicMetadata?.role === "admin";

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
        {isAdmin && (
          <Button colorScheme="purple" mb={4} onClick={() => navigate("/admin/products")}>Admin: Manage Products</Button>
        )}
        <ProductGrid selectedCategoryId={selectedCategoryId} />
      </Box>
      
    </HStack>
  );
}

export default HomePage;