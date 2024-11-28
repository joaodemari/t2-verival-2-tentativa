import { Box, Flex, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const NavigationMenu = () => {
  return (
    <Box bg="#193917" p={4} w={"100%"} color="white">
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
        <Link as={RouterLink} to="/estoque" p={2}>
          Estoque
        </Link>
      </Flex>
    </Box>
  );
};

export default NavigationMenu;
