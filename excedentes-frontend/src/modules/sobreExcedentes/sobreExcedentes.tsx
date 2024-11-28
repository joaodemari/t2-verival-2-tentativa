import { Flex, Image, Link, Text, VStack } from "@chakra-ui/react";
import ODS12 from "../../assets/img/ODS12.jpg";
import ODS13 from "../../assets/img/ODS13.jpg";
import ODS17 from "../../assets/img/ODS17.jpg";
import ODS2 from "../../assets/img/ODS2.png";
import ODS3 from "../../assets/img/ODS3.png";
import ExHeader from "../../components/ExHeader";

export function SobreExcedentes() {
  return (
    <VStack spacing={4} width={"100%"} align="stretch">
      <ExHeader activeButton="sobre" />
      <Flex
        className="w-full flex flex-col items-center py-5 my-0 mx-auto"
        width={{ base: "100%", md: "70%" }}
      >
        <VStack paddingX={8} marginBottom={10} alignItems="center">
          <Text fontSize="4xl" fontWeight="bold" textAlign="center">
            Sobre Excedentes
          </Text>

          <Text fontSize="lg" textAlign="justify">
            Com 46 milhões de toneladas de alimento desperdiçadas a cada ano no
            Brasil (<Link href="https://www.ibge.gov.br">IBGE</Link>), o
            Excedentes surge como proposta de solução para os desafios de
            desperdício de alimentos, da fome e de mudanças climáticas. Alinhado
            aos Objetivos de Desenvolvimento Sustentável (
            <Link href="https://brasil.un.org/pt-br/sdgs">ODS</Link>) da{" "}
            <Link href="https://brasil.un.org/pt-br">ONU</Link>, buscamos
            fornecer alimentos de qualidade a preços acessíveis, contribuindo
            para o consumo responsável, para a redução da fome e do desperdício
            e, consequentemente, diminuindo as emissões de gases de efeito
            estufa relacionados ao lixo.
          </Text>
        </VStack>

        <div className="flex flex-col">
          <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={5}>
            Objetivos de Desenvolvimento Sustentável que nos movem:
          </Text>
          <div className="flex justify-center flex-wrap gap-4">
            <VStack spacing={2} minH="260px">
              <Link href="https://brasil.un.org/pt-br/sdgs/2" target="_blank">
                <Image
                  boxSize="200px"
                  objectFit="cover"
                  borderRadius="md"
                  src={ODS2}
                  alt="ODS 2"
                />
              </Link>
              <Text maxW="200px" textAlign="center">
                ODS 02 - Fome Zero
              </Text>
            </VStack>
            <VStack spacing={2} minH="260px">
              <Link href="https://brasil.un.org/pt-br/sdgs/3" target="_blank">
                <Image
                  boxSize="200px"
                  objectFit="cover"
                  borderRadius="md"
                  src={ODS3}
                  alt="ODS 03"
                />
              </Link>
              <Text maxW="200px" textAlign="center">
                ODS 03 - Boa Saúde e Bem-Estar
              </Text>
            </VStack>
            <VStack spacing={2} minH="260px">
              <Link href="https://brasil.un.org/pt-br/sdgs/12" target="_blank">
                <Image
                  boxSize="200px"
                  objectFit="cover"
                  borderRadius="md"
                  src={ODS12}
                  alt="ODS 12"
                />
              </Link>
              <Text maxW="200px" textAlign="center">
                ODS 12 - Consumo e Produção Responsáveis
              </Text>
            </VStack>
            <VStack spacing={2} minH="260px">
              <Link href="https://brasil.un.org/pt-br/sdgs/13" target="_blank">
                <Image
                  boxSize="200px"
                  objectFit="cover"
                  borderRadius="md"
                  src={ODS13}
                  alt="ODS 13"
                />
              </Link>
              <Text maxW="200px" textAlign="center">
                ODS 13 - Combate às Alterações Climáticas
              </Text>
            </VStack>
            <VStack spacing={2} minH="260px">
              <Link href="https://brasil.un.org/pt-br/sdgs/17" target="_blank">
                <Image
                  boxSize="200px"
                  objectFit="cover"
                  borderRadius="md"
                  src={ODS17}
                  alt="ODS 17"
                />
              </Link>
              <Text maxW="200px" textAlign="center">
                ODS 17 - Parcerias em Prol das Metas
              </Text>
            </VStack>
          </div>
        </div>
      </Flex>
    </VStack>
  );
}
