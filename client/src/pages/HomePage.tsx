//import { Box, Grid, GridItem, HStack, Show } from "@chakra-ui/react";

import ProductGrid from "../domain/Product/ProductGrid";

//import useGameQueryStore from "../state";


function HomePage() {
/*   const {genreId, storeId} = 
    useGameQueryStore((s) => s.gameQuery);
  const setGenreId = useGameQueryStore((s) => s.setGenreId);
  const setStoreId = useGameQueryStore((s) => s.setStoreId);
   */


  return (
   <>
   <ProductGrid></ProductGrid>
   
   </>
  );
}

export default HomePage;