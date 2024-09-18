import React, { Component, useContext, useEffect, useState } from "react";
import {
  Scheduler,
  WeekView,
  MonthView,
  SchedulerDataChangeEvent,
  SchedulerDateChangeEvent,
  SchedulerSlot,
  SchedulerSlotProps,
} from "@progress/kendo-react-scheduler";
import EditItem from "./EditItem/component";
import CustomViewSlot from "./SlotViewItem/component";
import EditSlot from "./SlotEditItem/component";
import CustomHeader from "./CustomHeader/component";
import "@progress/kendo-date-math/tz/Europe/Rome";
import CustomContent from "./CustomContent/CustomContent";
import CustomWindow from "../Window/component";
import { CalendarProvider,CalendarContext } from "./provider";
import { end } from "@progress/kendo-react-dateinputs";
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
}


export default function CustomCalendar(props: Readonly<CustomCalendarProps>) {



  const {selectedEnd,selectedStart,setEnd,setStart,drag,setDrag} = useContext(CalendarContext);


  
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


    <CustomWindow show={!!modal} onClose={closeModal} title={modal?.title || ''} showModalFooter={false}>
      {
        modal?.component
      }
    </CustomWindow>

  </>);
}
