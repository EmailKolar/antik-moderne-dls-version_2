//import { Box, Grid, GridItem, HStack, Show } from "@chakra-ui/react";
import { useState } from "react";

import CategorySidebar from "../domain/Category/CategorySidebar";
import ProductGrid from "../domain/Product-domain/ProductGrid";
import useCategory from "../domain/Category/useCategory"

//import useGameQueryStore from "../state";


function HomePage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();

  return (
    <>
      <CategorySidebar
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
        useCategoryHook={useCategory}
      />
      <ProductGrid selectedCategoryId={selectedCategoryId} />
    </>
  );
}

export default HomePage;