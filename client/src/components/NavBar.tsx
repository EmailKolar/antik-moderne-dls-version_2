import { HStack, Image, Box, IconButton } from "@chakra-ui/react";
import { FiShoppingCart } from "react-icons/fi";
import ColorModeSwitch from "./ColorModeSwitch";
import SearchInput from "./SearchInput";
import logo from "../assets/Antikmoderne.png";
import { Link } from "react-router-dom";

import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { useBasketStore } from "../domain/Basket/useBasketStore";
import { useEffect } from "react";


const NavBar = () => {
  const { items, fetchBasket } = useBasketStore();
  const { user } = useUser();
  const basketCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (user) fetchBasket(user.id);
  }, [user, fetchBasket]);

  return (
    <HStack padding="10px">
      <Link to="/">
        <Image src={logo} alt="Logo" width={"100px"}/>
      </Link>
      <SearchInput />
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
