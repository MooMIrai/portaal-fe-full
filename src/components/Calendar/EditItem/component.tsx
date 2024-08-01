import React, { useState } from "react";
import {
  SchedulerEditItem,
  SchedulerEditItemProps,
} from "@progress/kendo-react-scheduler";
import CustomContent from "../CustomContent/CustomContent";

interface EditItemProps extends SchedulerEditItemProps {
  defaultTitle: string;
  render?: (
    slot: Record<string, any> | undefined,
    closeModalCallback: () => void
  ) => JSX.Element;
}

const EditItem = (props: EditItemProps) => {
  const [show, setShow] = useState(false);

  const handleOpenCloseModal = () => {
    setShow((prevShow) => !prevShow);
  };

  return (
    <SchedulerEditItem
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

export default EditItem;
