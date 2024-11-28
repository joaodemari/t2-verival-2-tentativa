import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Input,
  Text,
  VStack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import ExButton from "../../../components/ExButton";
import ExSidebar from "../../../components/ExSidebar";
import ExPopover from "../../../components/ExPopover/index.tsx";
import { useCallback, useEffect, useState, useRef } from "react";
import { RiStackFill } from "react-icons/ri";
import { getContractorProducts, deleteProduct } from "../../../core/services/productService.ts";
import { IProduct } from "../../../core/@Types/IProduct.ts";
import { dateFormatter } from "../../../helpers/dateFormatter.ts";

export function Stock() {
  const navigate = useNavigate();
  const [searchProduct, setSearchProduct] = useState("");
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<IProduct | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const listProducts = useCallback(async () => {
    try {
      const list = await getContractorProducts();
      console.log("Produtos obtidos:", list);
      setProducts(list);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  }, []);

  useEffect(() => {
    void listProducts();
  }, [listProducts]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchProduct.toLowerCase())
  );

  const handleDeleteProduct = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete.id);
        const newProducts = products.filter(product => product.id !== productToDelete.id);
        setProducts(newProducts);
        setProductToDelete(null);
        setIsDeleteDialogOpen(false);
      } catch (error) {
        console.error("Erro ao deletar produto:", error);
      }
    }
  };

  return (
    <>
      <ExSidebar />
      <VStack
        overflowX="hidden"
        width="100%"
        marginLeft={{ base: 0, md: 20 }}
        alignItems={{ base: "center", md: "normal" }}
      >
        <Flex alignItems={{ base: "center" }} marginTop={{ base: 20, md: 20 }}>
          <RiStackFill size={48} color="#21381B" />
          <Text marginLeft="4" fontSize="5xl" fontWeight="700" textColor="primary">
            Estoque
          </Text>
        </Flex>
        <Flex
          direction={{ base: "column-reverse", md: "row" }}
          justifyContent="space-between"
          marginX={{ base: 10, md: 15 }}
          marginY={{ base: 0, md: 5 }}
        >
          <Input
            type="search"
            placeholder="Pesquisa"
            size="lg"
            width={{ base: "100%", md: 400 }}
            marginTop={{ base: 5, md: 0 }}
            value={searchProduct}
            onChange={e => setSearchProduct(e.target.value)}
          />
          <Box className="flex justify-center" marginRight={{ md: 20 }}>
            <ExButton
              content="+ Adicionar Produto"
              color="white"
              bgColor="primary"
              type="button"
              size="lg"
              onClick={() => navigate("/estoque/cadastro-produto")}
            />
          </Box>
        </Flex>
        <Grid
          templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
          maxWidth={"95%"}
          gap={1}
        >
          {filteredProducts.map((product, index) => (
            <GridItem key={index} p={4} borderWidth="1px" borderRadius="lg" margin={2}>
              <Flex direction="column" position="relative">
                <Flex alignSelf="center">
                  <Image
                    src={product.picture}
                    alt="Produto"
                    boxSize={{ base: "75px", md: "150px" }}
                  />
                </Flex>
                <Flex position="absolute" top="0" right="0">
                  <ExPopover
                    onDetailsClicked={() =>
                      navigate(`/estoque/detalhes-produto/${product.id}`)
                    }
                    onEdit={() => navigate(`/estoque/editar-produto/${product.id}`)}
                    onDelete={() => {
                      setProductToDelete(product);
                      setIsDeleteDialogOpen(true);
                    }}
                  />
                </Flex>
                <Flex direction="column" align="flex-start">
                  <Heading size="md" pb={3}>
                    {product.name}
                  </Heading>
                  <Heading size="sm" pb={3}>
                    Valor:{" "}
                    <span style={{ color: "#28C654" }}>R$ {product.price} (un.)</span>
                  </Heading>
                  {product.expirationDate ? (
                    <Text color="#E02D37" fontSize="lg">
                      {dateFormatter(product.expirationDate).day}/
                      {dateFormatter(product.expirationDate).month}/
                      {dateFormatter(product.expirationDate).year}
                    </Text>
                  ) : (
                    <Text color="#E02D37" fontSize="lg">
                      Sem data de validade
                    </Text>
                  )}
                </Flex>
              </Flex>
            </GridItem>
          ))}
        </Grid>
      </VStack>

      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmar Deleção
            </AlertDialogHeader>

            <AlertDialogBody>
              Você tem certeza que deseja deletar o produto {productToDelete?.name}?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleDeleteProduct} ml={3}>
                Deletar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
