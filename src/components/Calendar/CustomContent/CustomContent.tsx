import React from "react";
import CustomWindow from "../../Window/component";

interface CustomWindowEditSlotProps {
  show: boolean;
  dataItem: Record<string, any>;
  handleOpenCloseModal: () => void;
  render?: (
    slot: Record<string, any> | undefined,
    closeModalCallback: () => void
  ) => JSX.Element;
}

const CustomContent = ({
  show,
  dataItem,
  handleOpenCloseModal,
  render,
}: CustomWindowEditSlotProps) => {
  return (
    <CustomWindow
      height={500}
      width={600}
      show={show}
      title={dataItem.title}
      onClose={handleOpenCloseModal}
    >
      {render?.(dataItem, handleOpenCloseModal)}
    </CustomWindow>
  );
};

export default CustomContent;
