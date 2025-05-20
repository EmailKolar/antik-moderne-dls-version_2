import { HStack,  Image } from "@chakra-ui/react";
import ColorModeSwitch from "./ColorModeSwitch";
import SearchInput from "./SearchInput";
import logo from "../assets/Antikmoderne.png";
import { Link } from "react-router-dom";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";


const NavBar = () => {
  return (
    <HStack padding="10px">
      <Image src={logo} alt="Logo" width={"100px"}/>
      <SearchInput />
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <Link to="/basket">Basket</Link>
      <ColorModeSwitch/>
    </HStack>
  );
};

export default NavBar;
