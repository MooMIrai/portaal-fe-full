import * as React from "react";
import {
  CalendarCell,
  CalendarCellProps,
} from "@progress/kendo-react-dateinputs";

const CustomCell = (props: CalendarCellProps) => {
  const style: React.CSSProperties = props.isWeekend
    ? { opacity: ".7" }
    : { fontWeight: "bold" };

  return <CalendarCell {...props} style={style} />;
};

export default CustomCell;
