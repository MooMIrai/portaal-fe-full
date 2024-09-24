import * as React from "react";
import { Calendar, CalendarCell, CalendarCellProps, CalendarProps } from "@progress/kendo-react-dateinputs";
import CustomCell from "./CustomCell/component";
import styles from "./style.module.scss";
import { useState } from "react";

interface CalendarMobileProps extends CalendarProps {
  data: Array<Record<string, any>>;
  content?: (
    slot: Record<string, any> | undefined,
    closeModalCallback: () => void
  ) => { component: JSX.Element; title: string };
  cellProps?:(cellProps:CalendarCellProps)=>Record<string,any>
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


  const customCell = (cellProps:CalendarCellProps) => {

    let cellAttrs:any={}
    if(props.cellProps){
      cellAttrs= props.cellProps(cellProps);
    }
    const style = cellAttrs.style;
    let FDate:React.ReactElement = <div style={{display:'flex',flexDirection:'column'}}>{cellProps.formattedValue}<small>NI</small></div>;
   
    if(cellAttrs.hours){
      FDate= <div style={{display:'flex',flexDirection:'column'}}>{cellProps.formattedValue}<small>{cellAttrs.hours+' ore'}</small></div>
    }
    
    return <CalendarCell {...cellProps}   style={style}  >
              {FDate}
            </CalendarCell>;
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
        {...props}
        className={styles.container}
        smoothScroll={false}
        showOtherMonthDays={true}
        mobileMode={true}
        navigation={false}
        cell={customCell}
        onChange={props.onChange}
      />
      
    </div>
  );
}
