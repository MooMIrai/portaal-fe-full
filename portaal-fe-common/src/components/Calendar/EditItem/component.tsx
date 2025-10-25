import React, { useState } from "react";
import {
  SchedulerEditItem,
  SchedulerEditItemProps,
} from "@progress/kendo-react-scheduler";
import CustomContent from "../CustomContent/CustomContent";

interface EditItemProps extends SchedulerEditItemProps {
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

const EditItem = (props: EditItemProps) => {
  const [show, setShow] = useState(false);

  const handleOpenCloseModal = () => {
    setShow((prevShow) => !prevShow);
  };

  return (
    <SchedulerEditItem
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

export default EditItem;
