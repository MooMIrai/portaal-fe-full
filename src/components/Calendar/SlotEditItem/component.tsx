// src/components/CustomEditSlot.tsx

import React, { useState } from "react";
import {
  SchedulerEditSlotProps,
  SchedulerEditSlot,
} from "@progress/kendo-react-scheduler";
import CustomContent from "../CustomContent/CustomContent";

interface EditItemProps extends SchedulerEditSlotProps {
  defaultTitle: string;
  render?: (
    slot: Record<string, any> | undefined,
    closeModalCallback: () => void
  ) => JSX.Element;
}

const EditSlot: React.FC<EditItemProps> = (props) => {
  const [show, setShow] = useState(false);

  const handleOpenCloseModal = () => {
    setShow(!show);
  };

  console.log("show: ", show);

  return (
    <SchedulerEditSlot
      {...props}
      onDoubleClick={handleOpenCloseModal}
      form={(formConfig) => (
        <CustomContent
          defaultTitle={props.defaultTitle}
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
