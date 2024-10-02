import { Chip, ChipProps } from "@progress/kendo-react-buttons";
import React from "react";

const CustomChip: React.FC<ChipProps> = ({
  ...props
}) => {
  return (
    <Chip
      {...props}
    />
  );
};

export default CustomChip;
