import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { useRef } from "react";
import { BsSearch } from "react-icons/bs";
//import useGameQueryStore from "../state";



const SearchInput = () => {
  const ref = useRef<HTMLInputElement>(null);
  //const onSearch = useGameQueryStore((s) => s.setSearchText);



  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        //onSearch(ref.current?.value || "");
      }}
    >
      <InputGroup>
        <InputLeftElement children={<BsSearch />} />
        <Input
          ref={ref}
          borderRadius={20}
          placeholder="Search posters..."
          variant="filled"
        />
      </InputGroup>
    </form>
  );
};

export default SearchInput;