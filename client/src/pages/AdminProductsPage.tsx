import { Box, Heading, Button, Table, Thead, Tbody, Tr, Th, Td, useToast, Spinner, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, FormLabel, FormControl } from "@chakra-ui/react";
import { useUser } from "@clerk/clerk-react";
//import { useNavigate } from "react-router-dom";
import { useAdminProducts } from "../domain/Product-domain/useAdminProducts";
import { useRef, useState } from "react";

const AdminProductsPage = () => {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  //const navigate = useNavigate();
  const toast = useToast();
  const {
    products = [],
    isLoading,
    addProduct,
    editProduct,
    deleteProduct,
  } = useAdminProducts();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newProduct, setNewProduct] = useState({ name: "", price: 0, imageUrl: "", stock: 0 });
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Open modal for add
  const handleOpenAdd = () => {
    setSelectedProduct(null);
    setNewProduct({ name: "", price: 0, imageUrl: "", stock: 0 });
    onOpen();
  };

  // Open modal for edit
  const handleOpenEdit = (product: any) => {
    setSelectedProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      stock: product.stock ?? 0,
    });
    onOpen();
  };

  // Handle image upload to MinIO (placeholder, backend endpoint needed)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // TODO: Replace with your backend endpoint for MinIO upload
    const formData = new FormData();
    formData.append("file", file);
    // Example: const res = await axios.post("/api/upload", formData);
    // setNewProduct((p) => ({ ...p, imageUrl: res.data.url }));
    toast({ title: "Image upload not implemented", status: "info" });
  };

  // Handle add or edit product
  const handleSaveProduct = async () => {
    console.log("Saving product...")
    try {
      if (selectedProduct) {
        console.log("Editing product...", selectedProduct);
        await editProduct({ ...selectedProduct, ...newProduct });
        toast({ title: "Product updated", status: "success" });
      } else {
        await addProduct(newProduct);
        toast({ title: "Product added", status: "success" });
      }
      setNewProduct({ name: "", price: 0, imageUrl: "", stock: 0 });
      setSelectedProduct(null);
      onClose();
    } catch {
      toast({ title: selectedProduct ? "Failed to update product" : "Failed to add product", status: "error" });
    }
  };

  if (!isAdmin) {
    return <Box p={8}><Heading size="md">You do not have access to this page.</Heading></Box>;
  }

  return (
    <Box p={8}>
      <Heading mb={6}>Admin: Manage Products</Heading>
      <Button colorScheme="teal" mb={4} onClick={handleOpenAdd}>
        Add Product
      </Button>
      <Modal isOpen={isOpen} onClose={() => { onClose(); setSelectedProduct(null); }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedProduct ? "Edit Product" : "Add Product"}</ModalHeader>
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Name</FormLabel>
              <Input value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Price</FormLabel>
              <Input type="number" value={newProduct.price} onChange={e => setNewProduct(p => ({ ...p, price: parseFloat(e.target.value) }))} />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Stock</FormLabel>
              <Input type="number" value={newProduct.stock} onChange={e => setNewProduct(p => ({ ...p, stock: parseInt(e.target.value) }))} />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Image</FormLabel>
              <Input type="file" ref={fileInputRef} onChange={handleImageUpload} />
              {newProduct.imageUrl && <img src={newProduct.imageUrl} alt="Preview" width={64} height={64} />}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => { onClose(); setSelectedProduct(null); }} mr={3}>Cancel</Button>
            <Button colorScheme="teal" onClick={handleSaveProduct}>{selectedProduct ? "Save" : "Add"}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {isLoading ? (
        <Spinner />
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Image</Th>
              <Th>Name</Th>
              <Th>Stock</Th>
              <Th>Price</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {products.map((product) => (
              <Tr key={product.id}>
                <Td><img src={product.imageUrl} alt={product.name} width={48} height={48} /></Td>
                <Td>{product.name}</Td>
                <Td>{product.stock}</Td>
                <Td>${product.price?.toFixed(2)}</Td>
                <Td>
                  <Button size="sm" mr={2} onClick={() => handleOpenEdit(product)}>Edit</Button>
                  <Button size="sm" colorScheme="red" onClick={() => deleteProduct(product.id)}>
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default AdminProductsPage;
