import { HStack, Image, Box, IconButton } from "@chakra-ui/react";
import { FiShoppingCart } from "react-icons/fi";
import ColorModeSwitch from "./ColorModeSwitch";
import logo from "../assets/Antikmoderne.png";
import { Link, useNavigate } from "react-router-dom";

import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { useBasketStore } from "../domain/Basket/useBasketStore";
import { useEffect } from "react";
import SearchInput from "./SearchInput";


const NavBar = () => {
  const { items, fetchBasket } = useBasketStore();
  const { user } = useUser();
  const navigate = useNavigate();
  const basketCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (user) fetchBasket(user.id);
  }, [user, fetchBasket]);

  const handleSearch = (searchTerm: string) => {
    navigate(`/?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <HStack padding="10px">
      <Link to="/">
        <Image src={logo} alt="Logo" width={"100px"}/>
      </Link>
      <Box flex={1} maxW="6000px" mx={6}>
        <SearchInput onSearch={handleSearch} />
      </Box>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <Link to="/basket">
        <Box position="relative">
          <IconButton
            aria-label="Basket"
            icon={<FiShoppingCart size={28} />} 
            variant="ghost"
            size="lg"
          />
          {basketCount > 0 && (
            <Box
              position="absolute"
              top="-2px"
              right="-2px"
              bg="red.400"
              color="white"
              borderRadius="full"
              fontSize="xs"
              px={1.5}
              py={0.5}
              minW="18px"
              textAlign="center"
              lineHeight="1"
              zIndex={1}
            >
              {basketCount}
            </Box>
          )}
        </Box>
      </Link>
      <ColorModeSwitch/>
    </HStack>
  );
};

export default NavBar;