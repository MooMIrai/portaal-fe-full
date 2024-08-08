import {
  SchedulerHeader,
  SchedulerHeaderProps,
} from "@progress/kendo-react-scheduler";
import React from "react";

interface CustomHeaderProps extends SchedulerHeaderProps {}

export default function CustomHeader(props: CustomHeaderProps) {
  return <SchedulerHeader {...props} />;
}
