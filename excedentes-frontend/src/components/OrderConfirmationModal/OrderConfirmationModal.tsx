import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import ExButton from "../ExButton";

interface OrderConfirmationModalProps {
  isOpen: boolean;
  orderCode: number;
}

export default function OrderConfirmationModal({
  isOpen,
  orderCode,
}: OrderConfirmationModalProps) {
  const navigate = useNavigate();
  const goHome = () => navigate("/");

  return (
    <Modal isOpen={isOpen} onClose={goHome} isCentered={true}>
      <ModalOverlay />
      <ModalContent className="px-4 py-8 pt-10">
        <ModalHeader textAlign="center" className="!text-2xl">
          Pedido confirmado com sucesso!
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="flex flex-col items-center">
            <p>O código de retirada do seu pedido é: </p>
            <p className="font-bold text-3xl">{orderCode}</p>
          </div>
          <p className="pt-5 text-sm">
            Basta apresentar esse código no(s) estabelecimento(s) para retirar
            seu pedido. O restante das informações foram enviadas para o seu
            e-mail.
          </p>
        </ModalBody>

        <ModalFooter
          display="flex"
          alignContent="center"
          justifyContent="center"
          flexDirection="column"
          className="!pb-0 mt-3"
          gap={2}
        >
          <ExButton
            content="OK"
            color="white"
            bgColor="primary"
            bgHover="green300"
            type="button"
            size="lg"
            onClick={goHome}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
