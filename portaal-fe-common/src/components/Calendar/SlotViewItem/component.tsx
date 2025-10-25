import React, { useContext, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { SchedulerViewSlot, SchedulerViewSlotProps} from "@progress/kendo-react-scheduler";
import { CalendarContext } from "../provider";
import { useLongPress } from "@uidotdev/usehooks";

interface ViewItemProps extends SchedulerViewSlotProps {
  render?: (slot: Record<string, any> | undefined, closeModalCallback: () => void) => JSX.Element;
  disableDrag?: boolean;
  isFinalized?: boolean;
}

const CustomViewSlot = (props: ViewItemProps) => {

  const { setStart, setEnd, setDrag, drag, selectedStart, selectedEnd, holidays, unavailableDays, date } = useContext(CalendarContext);

  const attrs = useLongPress(() => {},
    {
      onStart: (e) => {
        const ev: any = e
        if (ev.button == 2) {
          setDrag(false);
        } else {
          setDrag(true);
          setStart(props.start);
          setEnd(props.end);
        }
      },
      threshold: 0
    }
  );

  const [active, setActive] = useState(false);

  useEffect(() => {
    if (drag && selectedStart && (props.start >= selectedStart) && (!selectedEnd || props.end <= selectedEnd)) {
      setActive(true);
    } 
    
    else setActive(false);

  }, [drag, selectedEnd]);


  
  const notInMounth = props.start.getMonth() != date.getMonth() /* || props.isFinalized */;
  const notInContract = unavailableDays?.includes(props.start.getDate());
  const overTime = props.items.map(item => item.dataItem).reduce((acc, curr) => acc + curr.hours, 0) > 8; //8 hours as full working day
  const isHoliday = holidays.some((h) => h === props.start.getDate()) && date.getMonth() === props.start.getMonth();
  
  let bg = {};
  if (isHoliday && !notInContract) bg = { background: 'rgba(255,0,0,0.2)' }
  else if (props.isFinalized) bg = { background: '#e9ecef' };



  return <div className={styles.slotContainer} style={{
    flex: 1,
    ...(active ? { background: '#f0f0f0' } : {}),
    ...(overTime ? {background: "#E7F2FB"} : {}),
    ...((notInMounth || notInContract) ? { cursor: 'not-allowed' } : {}),
    ...(notInContract ? {background: "var(--kendo-color-base-subtle, #f5f5f6)"} : {})
  }}

    {
    ...((notInMounth || notInContract) ? {} : attrs)
    }

    onMouseEnter={!!props.disableDrag ? undefined : (e) => {
      if (notInMounth || notInContract) {
        e.preventDefault()
      } else if (drag && selectedStart) {

        if (props.start >= selectedStart) {
          setEnd(props.end)
        }
      }
    }}
    onMouseUp={() => {
      if (drag) {
        setDrag(false)
      }
    }}
  >

    <SchedulerViewSlot {...props} style={{ ...props.style, ...bg }}  ></SchedulerViewSlot>
  </div>;
};

export default CustomViewSlot;
