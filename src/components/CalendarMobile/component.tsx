import * as React from "react";
import { Calendar, CalendarProps } from "@progress/kendo-react-dateinputs";
import CustomCell from "./CustomCell/component";
import styles from "./style.module.scss";

interface CalendarMobileProps extends CalendarProps {}

export default function CalendarMobile(props: CalendarMobileProps) {
  return (
    <Calendar
      className={styles.container}
      smoothScroll={true}
      showOtherMonthDays={false}
      mobileMode={false}
      cell={(cellProp) => (
        <CustomCell {...cellProp}>
          <div className={styles.calendarDay}>
            {cellProp.children} <div className={styles.eventDot}></div>
          </div>
        </CustomCell>
      )}
      {...props}
    />
  );
}
