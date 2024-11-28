import { MdAddShoppingCart } from "react-icons/md";
import {
  Text,
  IconButton,
  VStack,
  HStack,
  Image,
  Spacer,
} from "@chakra-ui/react";
import { ContractorCompany } from "../../core/@Types/IProduct";
import { calculateDaysLeft } from "../../helpers/calculateExpirationDaysLeft";

interface HomeItemCardProps {
  product: {
    id: number;
    name: string;
    category: string;
    price: string;
    quantity: number;
    expiration_date: string;
    picture: string;
    brand: string;
    distance: number;
    company: ContractorCompany;
  };
  handleAddToCart: (id: number) => void;
}

const HomeItemCard: React.FC<HomeItemCardProps> = (
  props: HomeItemCardProps
) => {
  return (
    <>
      <VStack
        key={props.product.id}
        alignItems={"left"}
        className=" relative border-solid border-2 border-slate-300 rounded-lg p-2 w-52 text-left"
      >
        <div className="absolute top-3 right-3 bg-green-700 p-2 rounded-lg text-xs text-[#FFFFFF]">
          {calculateDaysLeft(props.product.expiration_date)} D
        </div>

        <Image
          src={props.product.picture}
          alt={props.product.name}
          className="w-48 h-40 object-cover rounded-lg"
        />

        <VStack align="flex-start" className="pl-2 py-2">
          <Text fontSize={16} noOfLines={1} color="#000000">
            {props.product.name}
          </Text>

          <HStack align="flex-end" className="w-full pr-1" gap={0}>
            <VStack align="left" className="w-4/5">
              <Text fontSize={12} noOfLines={1} color="#000000">
                Valor: R$ {parseFloat(props.product.price).toFixed(2)}
              </Text>
              <VStack gap={0} margin={0} align={"left"}>
                <Text fontSize={10} noOfLines={1} color="#A0AEC0">
                  Vendido por:
                </Text>
                <Text fontSize={10} noOfLines={1} color="#A0AEC0">
                  {props.product.company.name}
                </Text>
              </VStack>
              <Text fontSize={12} noOfLines={1} color="#000000">
                Distância: {props.product.distance.toFixed(2)} km
              </Text>
            </VStack>
            <Spacer />
            <IconButton
              aria-label="Add to cart"
              icon={<MdAddShoppingCart />}
              backgroundColor="#4CAF50"
              color="white"
              onClick={() => props.handleAddToCart(props.product.id)}
            />
          </HStack>
        </VStack>
      </VStack>
    </>
  );
};

export default HomeItemCard;
