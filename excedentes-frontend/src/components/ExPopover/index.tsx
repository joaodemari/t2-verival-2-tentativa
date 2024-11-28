import {
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Popover,
  Text,
  PopoverHeader,
  PopoverCloseButton,
  Box,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";

interface ExPopoverProps {
  onDetailsClicked: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ExPopover({
  onDetailsClicked,
  onEdit,
  onDelete,
}: ExPopoverProps) {
  return (
    <Popover placement="left">
      <PopoverTrigger>
        <Box as="button" bgColor="transparent" border="none">
          <BsThreeDotsVertical size={24} cursor="pointer" />
        </Box>
      </PopoverTrigger>
      <PopoverContent width={"200px"}>
        <PopoverCloseButton />
        <PopoverHeader
          alignSelf={"center"}
          fontWeight={"bold"}
          fontSize={"x-large"}
          border={0}
        >
          Ações
        </PopoverHeader>
        <PopoverBody display={"flex"} flexDirection={"column"} gap={1}>
          <Text
            bgColor={"gray.200"}
            color={"black"}
            padding={2}
            borderRadius={4}
            cursor="pointer"
            textAlign={"center"}
            onClick={onDetailsClicked}
          >
            Detalhes
          </Text>
          <Text
            bgColor={"primary"}
            color={"white"}
            padding={2}
            borderRadius={4}
            cursor="pointer"
            textAlign={"center"}
            onClick={onEdit}
          >
            Editar
          </Text>
          <Text
            bgColor={"red.500"}
            color={"white"}
            padding={2}
            borderRadius={4}
            cursor="pointer"
            textAlign={"center"}
            onClick={onDelete}
          >
            Excluir
          </Text>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
