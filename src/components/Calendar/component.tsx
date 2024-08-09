import React from "react";
import {
  Scheduler,
  WeekView,
  MonthView,
  SchedulerDataChangeEvent,
  SchedulerDateChangeEvent,
} from "@progress/kendo-react-scheduler";
import EditItem from "./EditItem/component";
import CustomViewSlot from "./SlotViewItem/component";
import EditSlot from "./SlotEditItem/component";
import CustomHeader from "./CustomHeader/component";
import "@progress/kendo-date-math/tz/Europe/Rome";
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
  return (
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
      editSlot={(config) => (
        <EditSlot
          model={props.model}
          defaultTitle={props.defaultModalTitle}
          {...config}
          render={props.contentModal}
        />
      )}
      editItem={(config) => (
        <EditItem
          model={props.model}
          defaultTitle={props.defaultModalTitle}
          {...config}
          render={props.contentModal}
        />
      )}
      header={(props) => {
        return <CustomHeader {...props} />;
      }}
      editable={{
        add: true,
        remove: true,
        drag: false,
        resize: false,
        select: true,
        edit: true,
      }}
    >
      {/* <WeekView /> */}
      <MonthView />
    </Scheduler>
  );
}
