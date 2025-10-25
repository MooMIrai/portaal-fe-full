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
 
  return (
    <div className={styles.calendarContainer}>
      <Calendar
        {...props}
        className={styles.container}
        smoothScroll={true}
        showOtherMonthDays={false}
        mobileMode={true}
        navigation={false}
        cell={customCell}
        onChange={props.onChange}
      />
      
    </div>
  );
}
