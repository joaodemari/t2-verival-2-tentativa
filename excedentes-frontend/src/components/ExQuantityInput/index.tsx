import {
  VStack,
  Button,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon, DeleteIcon } from "@chakra-ui/icons";
import { useState } from "react";
import ExConfirmationModal from "../ExConfirmationModal";

interface ExQuantityInputProps {
  size: "xs" | "sm" | "md" | "lg" | "xl";
  value: number;
  max: number;
  disabled: boolean;
  onChange: (newQuantity: number) => void;
}

export default function ExQuantityInput({
  size,
  value,
  max,
  disabled,
  onChange,
}: ExQuantityInputProps) {
  const [oldValue, setValue] = useState(value);
  const { isOpen, onClose } = useDisclosure();

  const handleIncrement = () => {
    const newValue = Math.min(oldValue + 1, max);
    setValue(newValue);
    onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = oldValue - 1;
    if (newValue === 0) {
      setValue(1);
      onChange(0);
    }
    else{
      setValue(newValue);
      onChange(newValue);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.match(/[^0-9]/)) return;
    const newValue =
      e.target.value === "" || e.target.value === "0" ? 1 : Math.min(Number(e.target.value), max);
    setValue(newValue);
    onChange(newValue);
  };

  const handleIcon = () => {
    if (oldValue === 1) {
      return <DeleteIcon />;
    } else {
      return <MinusIcon />;
    }
  }

  const fontSizeMap = {
    xs: "14px",
    sm: "18px",
    md: "22px",
    lg: "26px",
    xl: "30px",
  };

  return (
    <>
      <VStack alignItems={"center"}>
        <InputGroup
          size={size}
          alignItems={"center"}
          borderWidth={"1.5px"}
          borderColor={"primary"}
          borderRadius={"6px"}
        >
          <InputLeftAddon
            style={{
              backgroundColor: "transparent",
              borderWidth: 0,
              padding: 0,
            }}
          >
            <Button
              size={size}
              variant={"unstyled"}
              onClick={handleDecrement}
              color="primary"
            >
              {handleIcon()}
            </Button>
          </InputLeftAddon>
          <Input
            value={oldValue}
            fontSize={fontSizeMap[size]}
            onChange={handleChange}
            maxWidth={"40px"}
            variant={"unstyled"}
            textAlign={"center"}
            isDisabled={disabled}
          />
          <InputRightAddon
            style={{
              backgroundColor: "transparent",
              borderWidth: 0,
              padding: 0,
            }}
          >
            <Button
              size={size}
              variant={"unstyled"}
              isDisabled={disabled}
              onClick={handleIncrement}
              color={"primary"}
              borderWidth={0}
            >
              <AddIcon />
            </Button>
          </InputRightAddon>
        </InputGroup>
      </VStack>
      <ExConfirmationModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
