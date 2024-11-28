import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Image,
  Skeleton,
  Stack,
  Text,
  useDisclosure,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import Logo from "/Excedentes.svg";
import "../../app/App.css";
import ExButton from "../ExButton";
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { getSelfContractor } from "../../core/services/contractorService";

export default function ExSidebar() {
  const navigate = useNavigate();
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [isLargerThanHD] = useMediaQuery("(min-width: 1000px)");
  const [activeButton, setActiveButton] = useState("");
  const [companyName, setCompanyName] = useState("");

  const skeletonNameView = <Skeleton height={"20px"} width={"100px"} />;

  const handleButtonClick = (route: string) => {
    navigate(`/${route}`);
    setActiveButton(route);
  };

  const header = (
    <Box className="h-12 px-2 mt-5">
      <Image src={Logo} />
    </Box>
  );

  useEffect(() => {
    const hasToken = Boolean(localStorage.getItem("access_token"));

    if (!hasToken) {
      navigate("/login");
    }

    getSelfContractor()
      .then((companyInfo) => setCompanyName(companyInfo.name))
      .catch(() =>
        toast({
          title: "Ocorreu um erro ao carregar suas informações",
          description: "Por favor tente novamente",
          status: "error",
          duration: 9000,
          isClosable: true,
        })
      );
  }, [toast, setCompanyName]);

  const body = (
    <Box className="bg-white w-full">
      <Stack direction="column" spacing="32px">
        <ExButton
          color={activeButton === "" ? "white" : "terciary"}
          variant="ghost"
          bgColor={activeButton === "" ? "#21381B" : "white"}
          content="Estoque"
          onClick={() => handleButtonClick("")}
          size="lg"
          type="button"
          fontSize="40"
          fontWeight="bold"
        />
        <ExButton
          color="red800"
          variant="ghost"
          bgHover="red800"
          content="Sair"
          onClick={() => handleButtonClick("login")}
          size="lg"
          type="button"
          fontSize="40"
          fontWeight="bold"
        />
      </Stack>
    </Box>
  );

  const footer = (
    <Flex className="items-center justify-center w-full mb-3 px-4">
      <Avatar bg="#4F6144" />
      <Text className="ml-2 font-bold text-2xl p-1" as={RouterLink} to="/login">
        {companyName == "" ? skeletonNameView : <b>{companyName}</b>}
      </Text>
    </Flex>
  );

  return (
    <Flex>
      {isLargerThanHD ? (
        <Box
          width="270px"
          height="100%"
          background="#fffff"
          left={0}
          top={0}
          borderRight="2px solid black"
          display="flex"
          flexDirection="column"
          alignItems="center"
          paddingY={4}
          gap={28}
        >
          <Box
            style={{
              width: "95%",
              height: "50px",
              borderRadius: "5px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "40px",
            }}
          >
            <Image src={Logo} width={245} />
          </Box>
          <Box bg="white" width="100%" flex={1} color="white">
            <Stack direction="column" spacing="32px">
              <ExButton
                color={activeButton === "" ? "white" : "terciary"}
                variant="ghost"
                bgColor={activeButton === "" ? "#21381B" : "white"}
                content="Estoque"
                onClick={() => { handleButtonClick("estoque"); window.location.reload(); }}
                size="lg"
                type="button"
                fontSize="40"
                fontWeight="bold"
              />
              <ExButton
                color="red800"
                variant="ghost"
                bgHover="red800"
                content="Sair"
                onClick={() => handleButtonClick("login")}
                size="lg"
                type="button"
                fontSize="40"
                fontWeight="bold"
              />
            </Stack>
          </Box>
          <Box>
            <Flex
              align="center"
              justifyContent="center"
              width="100%"
              marginBottom={"10px"}
              className="px-5"
            >
              <Avatar bg="#4F6144" />
              <Text
                ml={2}
                fontSize="20pt"
                fontFamily="Bold"
                as={RouterLink}
                to="/login"
                p={1}
              >
                {companyName == "" ? skeletonNameView : <b>{companyName}</b>}
              </Text>
            </Flex>
          </Box>
        </Box>
      ) : (
        <Flex style={{ width: 0 }}>
          <ExButton
            bgColor="#21381B"
            color="white"
            content={<HamburgerIcon />}
            onClick={onOpen}
            size="md"
            type="button"
          />
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
