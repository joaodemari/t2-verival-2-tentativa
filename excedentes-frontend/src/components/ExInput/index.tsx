import { VStack, Input, Text } from "@chakra-ui/react";
import { useMemo } from "react";

interface ExInputProps {
  placeholder: string;
  type: "text" | "password" | "email" | "number" | "tel" | "url" | "search" | "date" | "time" | "datetime-local" | "month" | "week" | "money";
  size: 'xs' | 'sm' | 'md' | 'lg';
  onChangeText?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string | null
  value?: string | number
  disabled?: boolean
  readonly?: boolean
}

export default function ExInput({ placeholder, type, size, onChangeText, errorMessage = null, value, disabled, readonly}: ExInputProps) {
  const invalid = !!errorMessage

  const parsedType = useMemo(() => {
    return type === 'money' ? 'number' : type
  }, [type])

  return (
    <VStack style={{ width: '100%'}}>
      <Input
        size={size}
        placeholder={placeholder}
        type={parsedType}
        step={type === 'money' ? '0.01' : undefined}
        onChange={onChangeText}
        isInvalid={invalid}
        value={value}
        disabled={disabled}
        readOnly={readonly}
      />
      {invalid ? (
        <Text color="red.500" fontSize="sm">
          {errorMessage}
        </Text>
      ) : (
        null
      )}
    </VStack>
  )
}

