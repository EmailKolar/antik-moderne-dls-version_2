import { Box, Button, Heading, List, ListItem, Spinner } from "@chakra-ui/react";
import { useState } from "react";

interface Category {
  id: string;
  name: string;
}

interface Props {
  selectedCategoryId?: string;
  onSelectCategory: (id?: string) => void;
  useCategoryHook: () => { data?: Category[]; isLoading: boolean; error: Error | null };
}

const CategorySidebar = ({ selectedCategoryId, onSelectCategory, useCategoryHook }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: categories, isLoading, error } = useCategoryHook();

  const displayedCategories = isExpanded ? categories : categories?.slice(0, 5);

  if (error) return null;
  if (isLoading) return <Spinner />;

  return (
    <Box as="aside" minW="220px" p={4} >
      <Button variant="link" onClick={() => onSelectCategory(undefined)}>
        <Heading size="md" mb={4}>Categories</Heading>
      </Button>
      <List>
        {displayedCategories?.map((category) => (
          <ListItem key={category.id} py="5px">
            <Button
              variant="ghost"
              colorScheme={selectedCategoryId === category.id ? "teal" : "gray"}
              fontWeight={selectedCategoryId === category.id ? "bold" : "normal"}
              onClick={() => onSelectCategory(category.id)}
              width="100%"
              justifyContent="flex-start"
            >
              {category.name}
            </Button>
          </ListItem>
        ))}
        {categories && categories.length > 5 && (
          <Button
            size="sm"
            variant="link"
            mt={2}
            onClick={() => setIsExpanded((exp) => !exp)}
          >
            {isExpanded ? "Show less" : "Show more"}
          </Button>
        )}
      </List>
    </Box>
  );
};

export default CategorySidebar;
