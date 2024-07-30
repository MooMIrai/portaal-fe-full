// src/components/CustomEditSlot.tsx

import React, { useState } from "react";
import {
  SchedulerEditSlotProps,
  SchedulerEditSlot,
} from "@progress/kendo-react-scheduler";
import CustomContent from "../CustomContent/CustomContent";

interface EditItemProps extends SchedulerEditSlotProps {
  render?: (
    slot: Record<string, any> | undefined,
    closeModalCallback: () => void
  ) => JSX.Element;
}

const EditSlot: React.FC<EditItemProps> = (props) => {
  const [show, setShow] = useState(false);

  const handleOpenCloseModal = () => {
    setShow((prevShow) => !prevShow);
  };

  return (
    <SchedulerEditSlot
      {...props}
      onDoubleClick={handleOpenCloseModal}
      form={(formConfig) => (
        <CustomContent
          show={show}
          handleOpenCloseModal={handleOpenCloseModal}
          dataItem={formConfig.dataItem}
          render={props.render}
        />
      )}
    />
  );
};

export default EditSlot;
