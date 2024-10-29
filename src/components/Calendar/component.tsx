import React, { ComponentType, ReactNode, useContext, useEffect } from "react";
import {
  Scheduler,
  MonthView,
  SchedulerDataChangeEvent,
  SchedulerDateChangeEvent,
  SchedulerItemProps,
  SchedulerItem,
} from "@progress/kendo-react-scheduler";
import CustomViewSlot from "./SlotViewItem/component";
import "@progress/kendo-date-math/tz/Europe/Rome";
import CustomWindow from "../Window/component";
import { CalendarContext } from "./provider";

interface CustomCalendarProps {
  defaultModalTitle: string;
  model:
  | {
    [name: string]: any;
  }
  | undefined;
  timezone?: string;
  defaultDate: Date;
  data: Array<Record<string, any>>;
  defaultView?: string;
  hasAgenda?: boolean;
  hasTimeLine?: boolean;
  hasDay?: boolean;
  hasWeek?: boolean;
  hasMonth?: boolean;
  contentModal?: (
    slot: Record<string, any> | undefined,
    closeModalCallback: () => void
  ) => { component: JSX.Element; title: string };
  handleDataChange: ({ deleted }: SchedulerDataChangeEvent) => void;
  handleDateChange: (args: SchedulerDateChangeEvent) => void;
  date?: Date;

  holidays?: Array<number>,
  item?: ComponentType<SchedulerItemProps> | undefined;

  disableDrag?: boolean;
  isFinalized?: boolean;
}

/*
const CustomItem = (propsi: SchedulerItemProps) => (
  <SchedulerItem
    {...propsi}
    style={{
      ...propsi.style,
      marginTop:5
      //backgroundColor: propsi.isAllDay ? "pink" : "blue",
    }}
  >{props.item?props.item(propsi.dataItem):undefined}</SchedulerItem>
);*/


export default function CustomCalendar(props: Readonly<CustomCalendarProps>) {



  const { selectedEnd, selectedStart, setEnd, setStart, drag, setHolidays, setDate } = useContext(CalendarContext);




  const closeModal = () => {
    setEnd(undefined),
      setStart(undefined);
  }

  const getEditModal = () => {
    if (props.contentModal) {

      const ret = props.contentModal({ start: selectedStart, end: selectedEnd }, closeModal);
      if (ret) {
        return {
          component: ret.component || <></>,
          title: ret.title
        }
      }
    }
    return {
      component: <></>,
      title: "error"
    }

  }

  useEffect(() => {
    setHolidays(props.holidays || []);
  }, [props.holidays])

  useEffect(() => {
    setDate(props.date || new Date());
  }, [props.date])

  let modal = undefined;

  if (selectedStart && selectedEnd && !drag) {
    modal = getEditModal();
  }


  return (<>

    <Scheduler
      height={"100%"}
      date={props.date}
      data={props.data}
      defaultView={props.defaultView}
      defaultDate={props.defaultDate}
      timezone={"Etc/UTC"}
      onDataChange={props.handleDataChange}
      onDateChange={props.handleDateChange}
      viewSlot={(sched) => CustomViewSlot({ ...sched, disableDrag: props.disableDrag, isFinalized: props.isFinalized })}
      item={props.item}
      editable={{
        add: false,
        remove: false,
        drag: false,
        resize: false,
        select: false,
        edit: false,
      }}
    >
      {/* <WeekView /> */}
      <MonthView />
    </Scheduler>


    {modal && <CustomWindow style={{ width: '80%', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }} show={true} onClose={closeModal} title={modal.title || ''} showModalFooter={false}>
      {
        modal.component
      }
    </CustomWindow>}

  </>);
}
