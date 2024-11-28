import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
  } from "@chakra-ui/react";
  
  interface ExConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
  }
  
  export default function ExConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
  }: ExConfirmationModalProps) {
    return (
      <Modal blockScrollOnMount={false} closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
            justifyContent="center"
            alignItems="center"
            top="25%"
            position="absolute"
            width={{base: "80%", md: "20%"}}
        >
          <ModalHeader>Confirmação de Deleção</ModalHeader>
          <ModalBody textAlign="center">
            Você deseja remover este item do carrinho?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onConfirm}>
              Sim
            </Button>
            <Button onClick={onClose}>Não</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
  