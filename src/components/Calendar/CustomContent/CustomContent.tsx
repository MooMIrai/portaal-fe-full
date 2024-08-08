import React from "react";
import CustomWindow from "../../Window/component";

interface CustomWindowEditSlotProps {
  show: boolean;
  defaultTitle: string;
  dataItem: Record<string, any>;
  handleOpenCloseModal: () => void;
  render?: (
    slot: Record<string, any> | undefined,
    closeModalCallback: () => void
  ) => { component: JSX.Element; title: string };
}

const CustomContent = ({
  defaultTitle,
  show,
  dataItem,
  handleOpenCloseModal,
  render,
}: CustomWindowEditSlotProps) => {
  const renderData = render?.(dataItem, handleOpenCloseModal);
  return (
    <CustomWindow
      showModalFooter={false}
      height={500}
      width={600}
      show={show}
      title={renderData ? renderData.title : defaultTitle}
      onClose={handleOpenCloseModal}
    >
      {renderData?.component}
    </CustomWindow>
  );
};

export default CustomContent;
