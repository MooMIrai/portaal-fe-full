import React from "react";
import {
  Scheduler,
  MonthView,
  SchedulerDataChangeEvent,
} from "@progress/kendo-react-scheduler";
import { sampleData, displayDate } from "./data";
import { guid } from "@progress/kendo-react-common";
import EditItem from "./EditItem/component";

interface CalendarProps {
  contentModal?: (
    slot: Record<string, any> | undefined,
    closeModalCallback: () => void
  ) => JSX.Element;
}

export default function Calendar(props: CalendarProps) {
  const [data, setData] = React.useState<any[]>(sampleData);
  const handleDataChange = ({
    created,
    updated,
    deleted,
  }: SchedulerDataChangeEvent) => {
    setData((old) =>
      old
        // Filter the deleted items
        .filter(
          (item) =>
            deleted.find((current) => current.id === item.id) === undefined
        )
        // Find and replace the updated items
        .map(
          (item) => updated.find((current) => current.id === item.id) || item
        )
        // Add the newly created items and assign an `id`.
        .concat(created.map((item) => Object.assign({}, item, { id: guid() })))
    );
  };

  return (
    <Scheduler
      editItem={(config) => (
        <EditItem {...config} render={props.contentModal} />
      )}
      onDataChange={handleDataChange}
      editable={{
        add: true,
        remove: true,
        drag: true,
        resize: true,
        select: true,
        edit: true,
      }}
      data={data}
      defaultDate={displayDate}
    >
      <MonthView />
    </Scheduler>
  );
}
