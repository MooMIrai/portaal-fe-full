import React from "react";
import { Button, ButtonProps } from "@progress/kendo-react-buttons";

interface CustomButtonProps extends ButtonProps {
  themeColor:
    | "base"
    | "primary"
    | "secondary"
    | "tertiary"
    | "info"
    | "success"
    | "warning"
    | "error"
    | "dark"
    | "light"
    | "inverse"
    | null
    | undefined;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  themeColor,
  children,
  ...props
}) => {
  return (
    <Button themeColor={themeColor} {...props} >
      {children}
    </Button>
  );
};

export default CustomButton;
