import {
	Button,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Radio,
	RadioGroup,
	Stack,
} from "@chakra-ui/react";
import ExButton from "../ExButton";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function RedirectionModal({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) {
	const [value, setValue] = React.useState("");
	const navigate = useNavigate();

	const handleSubmit = () => {
		if (value === "consumidor") {
			navigate("/cadastro/consumidor");
		} else if (value === "ong") {
			navigate("/cadastro/consumidor");
		} else if (value === "contratante") {
			navigate("/cadastro/contratante");
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="xl"
			isCentered={true}
		>
			<ModalOverlay />
			<ModalContent className="px-4 py-8 pt-10">
				<ModalHeader textAlign="center" className="!text-2xl">
					Nos conte um pouco mais sobre você!
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<RadioGroup
						onChange={setValue}
						value={value}
					>
						<Stack direction="column">
							<Radio
								value="consumidor"
								colorScheme="green"
							>
								Quero poder comprar
								produtos próximos da
								validade a um preço
								acessível!
							</Radio>
							<Radio
								value="ong"
								colorScheme="green"
							>
								Quero poder receber
								doações e comprar produtos
								próximos da validade!
							</Radio>
							<Radio
								value="contratante"
								colorScheme="green"
							>
								Quero poder anunciar meus
								produtos que estão
								próximos da validade!
							</Radio>
						</Stack>
					</RadioGroup>
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
						content="Prosseguir"
						color="white"
						bgColor="primary"
						bgHover="green300"
						type="button"
						size="lg"
						onClick={handleSubmit}
					/>
					<Button
						bg="transparent"
						border="none"
						onClick={onClose}
					>
						Cancelar
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
