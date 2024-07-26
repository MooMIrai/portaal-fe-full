import React, { useCallback, useRef, useState } from "react";
import {
  SchedulerEditItem,
  SchedulerEditItemProps,
  SchedulerForm,
} from "@progress/kendo-react-scheduler";
import CustomWindow from "../../Window/component";

interface EditItemProps extends SchedulerEditItemProps {
  render?: (
    slot: Record<string, any> | undefined,
    closeModalCallback: () => void
  ) => JSX.Element;
}

const EditItem = (props: EditItemProps) => {
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  const [formItem, setFormItem] = useState(null);

  const handleCloseModal = () => {
    setShow(false);
  };

  const handleClick = () => {
    setShow(true);
  };

  const handleFormItemChange = useCallback((event: any) => {
    setFormItem(event.value);
  }, []);

  return (
    <SchedulerEditItem
      {...props}
      ref={ref}
      onClick={handleClick}
      formItem={formItem}
      onFormItemChange={handleFormItemChange}
      form={(formConfig) => (
        <SchedulerForm
          dataItem={{}}
          dialog={() => {
            return (
              <CustomWindow
                show={show}
                title="Status"
                onClose={handleCloseModal}
              >
                {props.render &&
                  props.render(formConfig.dataItem, handleCloseModal)}
              </CustomWindow>
            );
          }}
          onSubmit={() => {}}
        />
      )}
    />
  );
};

export default EditItem;
