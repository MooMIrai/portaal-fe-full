import React, { ReactNode, useContext } from "react";
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
  item:(item:any)=>ReactNode
}





export default function CustomCalendar(props: Readonly<CustomCalendarProps>) {



  const {selectedEnd,selectedStart,setEnd,setStart,drag} = useContext(CalendarContext);


  const CustomItem = (propsi: SchedulerItemProps) => (
    <SchedulerItem
      {...propsi}
      style={{
        ...propsi.style,
        marginTop:5
        //backgroundColor: propsi.isAllDay ? "pink" : "blue",
      }}
    >{props.item?props.item(propsi.dataItem):undefined}</SchedulerItem>
  );
  
  const closeModal = ()=>{
    setEnd(undefined),
    setStart(undefined);
  }

  const getEditModal = ()=>{
    if(props.contentModal){
      
      const ret = props.contentModal({start:selectedStart,end:selectedEnd},closeModal);
      if(ret ){
        return {
          component:ret.component || <></>,
          title:ret.title
        }
      }
    }
    return {
      component: <></>,
      title:"error"
    }
    
  }

  let modal = undefined;

  if(selectedStart && selectedEnd && !drag){
    modal=getEditModal();
  }

  return (<>

    <Scheduler
      height={"100%"}
      date={props.date}
      data={props.data}
      defaultView={props.defaultView}
      defaultDate={props.defaultDate}
      timezone={props.timezone}
      onDataChange={props.handleDataChange}
      onDateChange={props.handleDateChange}
      viewSlot={CustomViewSlot}
      item={CustomItem}
      editable={{
        add: true,
        remove: false,
        drag: false,
        resize: false,
        select: false,
        edit: false,
      }}
    >
      {/* <WeekView /> */}
      <MonthView  />
    </Scheduler>


    {modal && <CustomWindow style={{width:'80%',left:'50%',top:'50%',transform:'translate(-50%,-50%)'}}  show={true} onClose={closeModal} title={modal.title || ''} showModalFooter={false}>
      {
        modal.component
      }
    </CustomWindow>}

  </>);
}
