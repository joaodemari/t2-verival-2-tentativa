import "@chakra-ui/react";
import { Box, Input, useToast } from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import IoCamera from "../../assets/img/IoCamera.svg";

interface ImageInputProps {
    readonly?: boolean;
    onImageChange: (image: string) => void;
}

export default function ImageInput ({ readonly, onImageChange }: ImageInputProps) {
    const maxFileSizeInMb = 2;
    const toast = useToast();

    const [imageUrl, setImageUrl] = useState<string>(IoCamera);
    
    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        
        if(file == undefined) {
            return;
        }

        if (file.size > (maxFileSizeInMb * 1024 * 1024)) {
            toast({
                title: "Arquivo muito grande...",
                description: `Por favor escolha um arquivo menor que ${maxFileSizeInMb}mb`,
                status: "error",
                duration: 9000,
                isClosable: true,
            });
            event.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            setImageUrl(result);
            onImageChange(result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <Box 
            className="flex flex-1 w-36 rounded-full border items-center self-center bg-no-repeat bg-center bg-cover"
            backgroundImage={imageUrl}
        >
            <Input
                type="file"
                accept="image/*"
                borderColor="transparent"
                opacity={0}
                variant={"unstyled"}
                minWidth="8.75rem"
                minHeight="8.75rem"
                borderRadius="50%"
                onChange={handleImageChange}
                _active={{ borderColor: "transparent" }}
                _hover={{ borderColor: "transparent" }}
                _focus={{ borderColor: "transparent" }}
                pointerEvents={!readonly ? "auto" : "none"}
            />
        </Box>
    );
};
