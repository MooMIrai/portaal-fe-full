import React from "react";
import {
  SchedulerViewSlot,
  SchedulerViewSlotProps,
} from "@progress/kendo-react-scheduler";

interface ViewItemProps extends SchedulerViewSlotProps {
  render?: (
    slot: Record<string, any> | undefined,
    closeModalCallback: () => void
  ) => JSX.Element;
}

const CustomViewSlot = (props: ViewItemProps) => {
  return <SchedulerViewSlot {...props} />;
};

export default CustomViewSlot;
