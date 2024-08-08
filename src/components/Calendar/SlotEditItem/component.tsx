// src/components/CustomEditSlot.tsx

import React, { useState } from "react";
import {
  SchedulerEditSlotProps,
  SchedulerEditSlot,
} from "@progress/kendo-react-scheduler";
import CustomContent from "../CustomContent/CustomContent";

interface EditItemProps extends SchedulerEditSlotProps {
  defaultTitle: string;
  model:
    | {
        [name: string]: any;
      }
    | undefined;
  render?: (
    slot: Record<string, any> | undefined,
    closeModalCallback: () => void
  ) => { component: JSX.Element; title: string };
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
      onClick={handleOpenCloseModal}
      form={(formConfig) => {
        const initialValues = props.model;
        const newFormConfig = {
          ...formConfig.dataItem,
          ...initialValues,
        };

        return (
          <CustomContent
            defaultTitle={props.defaultTitle}
            show={show}
            handleOpenCloseModal={handleOpenCloseModal}
            dataItem={newFormConfig}
            render={props.render}
          />
        );
      }}
    />
  );
};

export default EditSlot;
