import {
  Button,
  Flex,
  Tab,
  TabIndicator,
  TabList,
  Table,
  TableContainer,
  Tabs,
  Tag,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  VStack,
  Spinner,
  useDisclosure,
  Box,
} from "@chakra-ui/react";
import ExHeader from "../../../components/ExHeader";
import ExQuantityInput from "../../../components/ExQuantityInput";
import { useState, useEffect, useCallback } from "react";
import {
  editItemQuantity,
  getOrderCart,
  deleteItem,
  finishOrder,
} from "../../../core/services/ordersService";
import { IGetOrder } from "../../../core/@Types/IGetOrder";
import ExConfirmationModal from "../../../components/ExConfirmationModal";
import { useNavigate } from "react-router-dom";
import ExButton from "../../../components/ExButton";
import OrderConfirmationModal from "../../../components/OrderConfirmationModal/OrderConfirmationModal";
import { calculateDaysLeft } from "../../../helpers/calculateExpirationDaysLeft";

interface Market {
  name: string;
  items: IGetOrder[];
}

export function Cart() {
  const navigate = useNavigate();
  const [markets, setMarkets] = useState<Market[]>([]);
  const [selectedMarketIndex, setSelectedMarketIndex] = useState(0);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [totalValue, setTotalValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isPurchaseConfirmationOpen,
    onOpen: openPurchaseConfirmationModal,
  } = useDisclosure();
  const [hasExpiredItems, setHasExpiredItems] = useState(false);
  const [finishButtonClicked, setFinishButtonClicked] = useState(false);
  const [finishLoading, setFinishLoading] = useState(false);
  const [orderCode, setOrderCode] = useState<number>();

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      const data = await getOrderCart().catch(() => {
        setLoading(false);
        return [];
      });
      const marketsData: { [key: string]: IGetOrder[] } = {};
      data.forEach((item) => {
        const marketName = item.seller_name;
        if (!marketsData[marketName]) {
          marketsData[marketName] = [];
        }
        marketsData[marketName].push(item);
      });

      const organizedMarkets: Market[] = Object.keys(marketsData).map(
        (marketName) => ({
          name: marketName,
          items: marketsData[marketName],
        })
      );

      setMarkets(organizedMarkets);

      const initialQuantities: { [key: number]: number } = {};
      data.forEach((item) => {
        initialQuantities[item.product_id] = item.quantity;
      });
      setQuantities(initialQuantities);
      setLoading(false);
    };

    void fetchCartItems();
  }, []);

  useEffect(() => {
    if (markets.length > 0) {
      const selectedMarket = markets[selectedMarketIndex];
      const newTotalValue = selectedMarket.items.reduce(
        (total, item) => total + item.price * quantities[item.product_id],
        0
      );
      setTotalValue(newTotalValue);

      markets.forEach((market) => {
        market.items.forEach((item) => {
          const daysLeft = calculateDaysLeft(
            item.expiration_date as unknown as string
          );
          if (daysLeft <= 0) {
            setHasExpiredItems(true);
          }
        });
      });
    }
  }, [quantities, markets, selectedMarketIndex]);

  const callEditItemQuantity = async (quantity: number, product_id: number) => {
    await editItemQuantity(quantity, product_id);
  };

  const handleQuantityChange = useCallback(
    (
      productId: number,
      newQuantity: number,
      cart_item_id: number,
      maxQuantity: number
    ) => {
      if (quantities[productId] === 1 && newQuantity === 0) {
        setProductToDelete(cart_item_id);
        onOpen();
      } else {
        const adjustedQuantity = Math.min(newQuantity, maxQuantity);
        setQuantities((prevQuantities) => ({
          ...prevQuantities,
          [productId]: adjustedQuantity,
        }));
      }
    },
    [quantities, onOpen]
  );

  const handleTabChange = (index: number) => {
    setSelectedMarketIndex(index);
  };

  const handleDeleteConfirmation = () => {
    if (productToDelete) {
      deleteItem(productToDelete)
        .then(() => {
          setQuantities((prevQuantities) => {
            const newQuantities = { ...prevQuantities };
            delete newQuantities[productToDelete];
            return newQuantities;
          });
          setMarkets((prevMarkets) => {
            return prevMarkets.map((market) => ({
              ...market,
              items: market.items.filter(
                (item) => item.cart_item_id !== productToDelete
              ),
            }));
          });
          window.location.reload();
        })
        .catch((err) => console.log("Erro ao deletar item:", err));
    }
    setProductToDelete(null);
    onClose();
  };

  if (loading) {
    return (
      <VStack spacing={4} width={"100%"} align="stretch">
        <ExHeader activeButton="" />
        <Flex justify="center" align="center" height="100vh">
          <Spinner size="xl" />
        </Flex>
      </VStack>
    );
  }

  const isCartEmpty = markets.every(
    (market) =>
      market.items.length === 0 ||
      market.items.every((item) => quantities[item.product_id] === 0)
  );

  if (isCartEmpty) {
    return (
      <VStack spacing={4} width={"100%"} align="stretch">
        <ExHeader activeButton="" />
        <Text
          fontSize={{ base: "2xl", md: "5xl" }}
          paddingTop={{ base: 4, md: 10 }}
          textAlign="center"
        >
          Seu carrinho está esperando por você!
        </Text>
        <Text fontSize={{ base: "xl", md: "3xl" }} textAlign="center">
          Parece que seu carrinho está vazio no momento. Explore nossa loja e
          adicione algo que você goste!
        </Text>
        <Flex justifyContent="center" align="center" marginTop={5}>
          <ExButton
            type="button"
            content="Explorar Loja"
            color="white"
            bgColor="primary"
            size="lg"
            onClick={() => navigate("/")}
          />
        </Flex>
      </VStack>
    );
  }

  const selectedMarket = markets[selectedMarketIndex];

  return (
    <>
      <VStack spacing={4} width={"100%"} align="stretch">
        <ExHeader activeButton="" />
        <Text
          fontSize={{ base: "2xl", md: "5xl" }}
          paddingLeft={{ base: 4, md: 200 }}
          paddingTop={{ base: 4, md: 10 }}
        >
          Carrinho
        </Text>
        <Flex flexDirection="column" align="center">
          <Flex justify="center" width="100%">
            <Tabs onChange={handleTabChange}>
              <TabList>
                {markets.map((market, index) => (
                  <Tab
                    key={index}
                    fontSize={{ base: "14px", md: "18px" }}
                    _selected={{ color: "#21381B" }}
                  >
                    {market.name}
                  </Tab>
                ))}
              </TabList>
              <TabIndicator
                mt="-1.5px"
                height="2px"
                bg="#21381B"
                borderRadius="1px"
              />
            </Tabs>
          </Flex>
          <Flex justify="center" marginTop={4} width="100%">
            <TableContainer
              backgroundColor="#EFEFEF"
              paddingX={{ base: 4, md: 10 }}
              paddingY={{ base: 4, md: 6 }}
              borderRadius="12px"
              border="2px solid #4A5568"
              width={{ base: "95%", md: "80%" }}
              overflowX="auto"
            >
              <Table
                variant="simple"
                colorScheme="#D9D9D9"
                size={{ base: "xs", md: "lg" }}
              >
                <Thead>
                  <Tr>
                    <Th
                      fontSize={{ base: "18px", md: "24px" }}
                      fontWeight="600"
                      textTransform="capitalize"
                    >
                      Produto
                    </Th>
                    <Th
                      fontSize={{ base: "18px", md: "24px" }}
                      fontWeight="600"
                      textTransform="capitalize"
                      isNumeric
                    />
                  </Tr>
                </Thead>
                <Tbody>
                  {selectedMarket.items.map((item) => {
                    const isExpired =
                      new Date(item.expiration_date) < new Date();
                    return (
                      <Tr
                        key={item.product_id}
                        bg={isExpired ? "red.100" : "transparent"}
                      >
                        <Td
                          padding={{ base: 3, md: 5 }}
                          fontSize={{ base: 15, md: 20 }}
                          flexWrap="wrap"
                        >
                          {item.product_name}
                        </Td>
                        <Td padding={{ base: 3, md: 5 }} isNumeric>
                          <Flex justify="flex-end" alignItems={"center"}>
                            <Tag
                              marginRight={4}
                              alignContent="center"
                              fontSize={{ base: "14px", md: "18px" }}
                              padding={3}
                              paddingRight={{ base: 7, md: 5 }}
                              borderRadius="6px"
                              color="#1A202C"
                              backgroundColor="#E2E8F0"
                            >
                              R${" "}
                              {(
                                item.price * quantities[item.product_id]
                              ).toFixed(2)}
                            </Tag>
                            <ExQuantityInput
                              disabled={isExpired}
                              size={"sm"}
                              value={quantities[item.product_id]}
                              max={item.product_quantity}
                              onChange={(newQuantity) => {
                                handleQuantityChange(
                                  item.product_id,
                                  newQuantity,
                                  item.cart_item_id,
                                  item.product_quantity
                                );
                                if (newQuantity === 0) {
                                  return;
                                }
                                callEditItemQuantity(
                                  newQuantity,
                                  item.product_id
                                )
                                  .then((res) => console.log(res))
                                  .catch((err) => console.log(err));
                              }}
                            />
                          </Flex>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
                <Tfoot>
                  <Tr>
                    <Th
                      paddingTop={3}
                      fontSize={{ base: "18px", md: "24px" }}
                      fontWeight="600"
                      textTransform="capitalize"
                    >
                      Valor Total
                    </Th>
                    <Th paddingTop={3} isNumeric>
                      <Flex justify="flex-end">
                        <Tag
                          fontSize={{ base: "14px", md: "18px" }}
                          fontWeight={600}
                          padding={3}
                          marginRight={2.5}
                          borderRadius="6px"
                          color="#1A202C"
                          backgroundColor="#E2E8F0"
                        >
                          R$ {totalValue.toFixed(2)}
                        </Tag>
                      </Flex>
                    </Th>
                  </Tr>
                </Tfoot>
              </Table>
            </TableContainer>
          </Flex>
        </Flex>
        {hasExpiredItems && (
          <Box
            color="red.500"
            fontSize={{ base: "16px", md: "20px" }}
            textAlign="center"
            paddingTop={2}
          >
            Algum produto de algum mercado está fora da validade. Remova-o para
            finalizar a compra.
          </Box>
        )}
        <Flex
          justifyContent="center"
          marginTop={{ base: "20px", md: "10px" }}
          paddingBottom={10}
        >
          <Button
            color="white"
            bgColor="primary"
            height={{ base: "50px", md: "60px" }}
            width={{ base: "95%", md: "500px" }}
            borderRadius="12px"
            isDisabled={hasExpiredItems || finishButtonClicked || finishLoading}
            onClick={() => {
              setFinishButtonClicked(true);
              setFinishLoading(true);
              finishOrder()
                .then((response) => {
                  setOrderCode(response.order.code);
                  openPurchaseConfirmationModal();
                })
                .catch(() => {
                  setFinishButtonClicked(false);
                  setFinishLoading(false);
                });
            }}
          >
            {finishLoading ? (
              <Spinner size="md" />
            ) : (
              <Text fontSize={{ base: "20px", md: "24px" }} fontWeight="600">
                Finalizar Compra
              </Text>
            )}
          </Button>
        </Flex>
      </VStack>
      <ExConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleDeleteConfirmation}
      />
      {orderCode && (
        <OrderConfirmationModal
          isOpen={isPurchaseConfirmationOpen}
          orderCode={orderCode}
        />
      )}
    </>
  );
}
