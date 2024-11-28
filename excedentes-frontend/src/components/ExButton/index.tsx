import { Button, Text } from "@chakra-ui/react";

interface ExButtonProps {
  bgColor?: string;
  bgHover?: string;
  color: string;
  variant?: "outline" | "solid" | "ghost" | "link";
  content: string | React.ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  size?: "xs" | "sm" | "md" | "lg";
  type: "button" | "submit" | "reset";
  fontWeight?: "hairline" | "thin"| "normal"| "medium"| "semibold"| "bold"| "extrabold"| "black"
  fontSize?: string;
}

export default function ExButton({
  bgColor,
  bgHover,
  color,
  content,
  onClick,
  isLoading = false,
  size,
  type,
  variant,
  fontWeight = "hairline",
  fontSize,
}: ExButtonProps) {
  const hoverStyles = bgHover ? { bgColor: bgHover, color: "white" } : {};

  return (
    <Button
      size={size}
      bgColor={bgColor}
      color={color}
      onClick={onClick}
      type={type}
      variant={variant}
      _hover={hoverStyles}
      isLoading={isLoading}
      disabled={isLoading}
      fontWeight={fontWeight}
    >
      <Text fontSize={fontSize}>
        {content}
      </Text>
    </Button>
  );
}
