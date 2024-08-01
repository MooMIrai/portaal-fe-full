import React from "react";
import {
  Scheduler,
  AgendaView,
  TimelineView,
  DayView,
  WeekView,
  MonthView,
  SchedulerDataChangeEvent,
} from "@progress/kendo-react-scheduler";
import EditItem from "./EditItem/component";
import CustomViewSlot from "./SlotViewItem/component";
import EditSlot from "./SlotEditItem/component";

interface CustomCalendarProps {
  defaultModalTitle: string;
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
  ) => JSX.Element;
  handleDataChange: ({ deleted }: SchedulerDataChangeEvent) => void;
}

export default function CustomCalendar(props: Readonly<CustomCalendarProps>) {
  return (
    <Scheduler
      data={props.data}
      defaultView={props.defaultView}
      defaultDate={props.defaultDate}
      timezone={props.timezone}
      onDataChange={props.handleDataChange}
      viewSlot={CustomViewSlot}
      editSlot={(config) => (
        <EditSlot
          defaultTitle={props.defaultModalTitle}
          {...config}
          render={props.contentModal}
        />
      )}
      editItem={(config) => (
        <EditItem
          defaultTitle={props.defaultModalTitle}
          {...config}
          render={props.contentModal}
        />
      )}
      editable={{
        add: true,
        remove: true,
        drag: true,
        resize: true,
        select: true,
        edit: true,
      }}
    >
      <WeekView />
      <MonthView />
    </Scheduler>
  );
}
