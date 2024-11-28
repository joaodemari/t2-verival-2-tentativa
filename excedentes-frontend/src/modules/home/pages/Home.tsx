import { VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ExHeader from "../../../components/ExHeader";
import HomeContent from "./HomeContent";

export function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    const hasToken = Boolean(localStorage.getItem("access_token"));
    if (!hasToken) navigate("/login");
  }, []);

  return (
    <VStack spacing={4} width={"100%"} align="stretch">
      <ExHeader activeButton="home" />
      <HomeContent />
    </VStack>
  );
}
