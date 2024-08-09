import * as React from "react";
import { Calendar, CalendarProps } from "@progress/kendo-react-dateinputs";
import CustomCell from "./CustomCell/component";
import styles from "./style.module.scss";
import { useState } from "react";

interface CalendarMobileProps extends CalendarProps {
  data: Array<Record<string, any>>;
  content?: (
    slot: Record<string, any> | undefined,
    closeModalCallback: () => void
  ) => { component: JSX.Element; title: string };
}

export default function CalendarMobile(props: CalendarMobileProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  console.log(props.content);

  const renderCell = (cellProp: any) => {
    const { date } = cellProp;
    const dayActivities = props.data.filter(
      (activity) =>
        new Date(activity.start).toDateString() === date.toDateString()
    );

    const handleClick = () => {
      setSelectedDate(date);
    };

    return (
      <CustomCell {...cellProp} onClick={handleClick}>
        <div className={styles.calendarDay}>
          {cellProp.children}
          {dayActivities.length > 0 && <div className={styles.eventDot}></div>}
        </div>
      </CustomCell>
    );
  };

  const closeModal = () => {
    setSelectedDate(null);
  };

  const content =
    selectedDate && props.content
      ? props.content({ day: selectedDate.getDate() }, closeModal)
      : null;

  return (
    <div className={styles.calendarContainer}>
      <Calendar
        className={styles.container}
        smoothScroll={false}
        showOtherMonthDays={true}
        mobileMode={false}
        navigation={false}
        cell={renderCell}
        {...props}
      />
      {props?.content?.({ day: 2 }, closeModal).component}
    </div>
  );
}
