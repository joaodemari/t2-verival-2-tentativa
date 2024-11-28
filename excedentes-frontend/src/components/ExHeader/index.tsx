import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Image,
  Skeleton,
  Spacer,
  Stack,
  Text,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import "../../app/App.css";
import { Input } from "@chakra-ui/react";
import ExButton from "../ExButton";
import { useNavigate } from "react-router-dom";
import { BsCart } from "react-icons/bs";
import { BsSearch } from "react-icons/bs";
import Logo from "/Excedentes.png";
import { IoMdExit } from "react-icons/io";
import { MdLocationPin } from "react-icons/md";
import { useGeoLocation } from "../../helpers/userLocation";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useRef } from "react";

interface ExHeaderProps {
  activeButton: string;
}

export default function ExHeader({ activeButton }: ExHeaderProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLargerThanHD] = useMediaQuery("(min-width: 1000px)");
  const { address } = useGeoLocation();
  const navigate = useNavigate();
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const handleButtonClick = (route: string) => {
    if (route === "login") {
      localStorage.removeItem("access_token");
    }

    navigate(`/${route}`);
  };

  const header = (
    <Box className="h-12 px-2 mt-5">
      <Image width={"230px"} height={"144px"} src={Logo} />
    </Box>
  );

  const body = (
    <Box className="bg-white w-full ">
      <Stack direction="column" spacing="29px" padding="100px">
        <ExButton
          color={activeButton === "início" ? "primary" : "black"}
          onClick={() => handleButtonClick("")}
          type="button"
          content="Início"
          variant="ghost"
          fontSize="32px"
          fontWeight={activeButton === "início" ? "extrabold" : "normal"}
        />

        <ExButton
          color={activeButton === "sobre" ? "primary" : "black"}
          onClick={() => handleButtonClick("sobre")}
          type="button"
          content="Sobre o Excedentes"
          variant="ghost"
          fontSize="32px"
          fontWeight={activeButton === "sobre" ? "extrabold" : "normal"}
        />

        {/* <ExButton
                        color={activeButton === "pedidos" ? "primary" : "black"}
                        onClick={() => handleButtonClick("pedidos")}
                        type="button"
                        content="Pedidos"
                        variant="ghost"
                        fontSize="32px"
                        fontWeight={activeButton === "pedidos" ? "extrabold" : "normal"}
                    />

                <ExButton
                        color={activeButton === "perfil" ? "primary" : "black"}
                        onClick={() => handleButtonClick("perfil")}
                        type="button"
                        content="Perfil"
                        variant="ghost"
                        fontSize="32px"
                        fontWeight={activeButton === "perfil" ? "extrabold" : "normal"}
                    /> */}
      </Stack>
    </Box>
  );

  const footer = (
    <Flex className="justify-center w-full mb-10 ">
      <ExButton
        color="red800"
        onClick={() => handleButtonClick("login")}
        type="button"
        fontSize="32px"
        content="Sair"
        variant="ghost"
        fontWeight={activeButton === "Sair" ? "extrabold" : "normal"}
      />
    </Flex>
  );

  return (
    <Flex>
      {isLargerThanHD ? (
        <header className="w-full pt-5 px-10">
          <Flex width={"100%"}>
            <HStack>
              <Image
                width={"250px"}
                src={Logo}
                marginLeft={-5}
                marginRight={5}
              />
              <ExButton
                color={activeButton === "home" ? "primary" : "black"}
                onClick={() => handleButtonClick("")}
                type="button"
                content="Home"
                variant="ghost"
                fontWeight={activeButton === "home" ? "extrabold" : "normal"}
              />
              <ExButton
                color={activeButton === "sobre" ? "primary" : "black"}
                onClick={() => handleButtonClick("sobre")}
                type="button"
                content="Sobre o Excedentes"
                variant="ghost"
                fontWeight={activeButton === "sobre" ? "extrabold" : "normal"}
              />
              {/* <ExButton
                        color={activeButton === "produtos" ? "primary" : "black"}
                        onClick={() => handleButtonClick("estoque/cadastro-produto")}
                        type="button"
                        content="Produtos"
                        variant="ghost"
                        fontWeight={activeButton === "produtos" ? "extrabold" : "normal"}
                    />
                    <ExButton
                        color={activeButton === "categorias" ? "primary" : "black"}
                        onClick={() => handleButtonClick("estoque")}
                        type="button"
                        content="Categorias"
                        variant="ghost"
                        fontWeight={activeButton === "categorias" ? "extrabold" : "normal"}
                    /> */}
            </HStack>
            <Spacer />
            <HStack justifyContent={"flex-end"} className="px-8 space-x-4">
              <Input
                style={{
                  width: "222px",
                  height: "32",
                  border: "0.5px solid gray",
                  borderRadius: "6px",
                }}
                placeholder="Pesquisar"
                size="xs"
              />
              <Flex alignItems={"center"}>
                <MdLocationPin size={32} />
                {address ? (
                  <Text fontSize={20}>Próximo à {address}</Text>
                ) : (
                  <Skeleton height={5} width="20rem" />
                )}
              </Flex>
              <IoMdExit
                size={32}
                onClick={() => handleButtonClick("login")}
                className="cursor-pointer"
              />
              <BsCart
                size={32}
                onClick={() => handleButtonClick("carrinho")}
                className="cursor-pointer"
              />
            </HStack>
          </Flex>
        </header>
      ) : (
        <Flex className="w-full md:w-full px-4 py-2">
          <ExButton
            bgColor="#21381B"
            color="white"
            content={<HamburgerIcon />}
            onClick={onOpen}
            size="md"
            type="button"
          />
          <Spacer />
          <HStack
            justifyContent={"flex-end"}
            className="flex-1 md:px-8 space-x-4 md:space-x-8"
          >
            <Flex alignItems={"center"}>
              {address ? (
                <Text className="text-lg md:text-xl" fontSize={20}>
                  Próximo à {address}
                </Text>
              ) : (
                <Skeleton height={5} width="10rem" />
              )}
            </Flex>
            <BsSearch
              size={35}
              onClick={() => handleButtonClick("pesquisar")}
              className="search "
            />
            <BsCart
              size={35}
              onClick={() => handleButtonClick("carrinho")}
              className="cursor-pointer"
            />
          </HStack>
        </Flex>
      )}
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent
          borderRight="2px solid black"
          width="270px"
          height="100%"
        >
          <DrawerCloseButton />
          <DrawerHeader>{header}</DrawerHeader>
          <DrawerBody mt="25">{body}</DrawerBody>
          <DrawerFooter>{footer}</DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}
