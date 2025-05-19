import { HStack,  Image } from "@chakra-ui/react";
import ColorModeSwitch from "./ColorModeSwitch";
import SearchInput from "./SearchInput";
import logo from "../assets/Antikmoderne.png";



const NavBar = () => {
  return (
    <HStack padding="10px">
      <Image src={logo} alt="Logo" width={"100px"}/>
      <SearchInput />
      <ColorModeSwitch/>
    </HStack>
  );
};

export default NavBar;
