import { Box, Button, Flex, Input, Link, useDisclosure } from "@chakra-ui/react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'
import { useRef } from "react";
import { Link as RouterLink } from "react-router-dom";

export function DrawerExample() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button ref={btnRef} colorScheme='teal' onClick={onOpen}>
        Open
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create your account</DrawerHeader>

          <DrawerBody>
            <Input placeholder='Type here...' />
          </DrawerBody>

          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='blue'>Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
const NavigationMenu = () => {
  return (
    <Box bg="blue.500" p={4} color="white">
      <Flex justifyContent="space-around">
        <Link as={RouterLink} to="/" p={2}>
          Home
        </Link>
        <Link as={RouterLink} to="/login" p={2}>
          Login
        </Link>
        <Link as={RouterLink} to="/cadastro/consumidor" p={2}>
          Cadastro de Consumidor
        </Link>
        <Link as={RouterLink} to="/cadastro/contratante" p={2}>
          Cadastro de Contratante
        </Link>
      </Flex>
    </Box>
  );
};

export default NavigationMenu;
