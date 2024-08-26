import React, { useEffect, useState } from "react";
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
  multipleSelectionModal?: (
    timesheetId: number,
    dates: Date[],
    closeModalCallback: () => void
  ) => { component: JSX.Element; title: string };
  handleDataChange: ({ deleted }: SchedulerDataChangeEvent) => void;
  handleDateChange: (args: SchedulerDateChangeEvent) => void;
  date?: Date;
}

const CustomSlot = (props: any) => {

  const [hovering, setHovering] = useState<boolean>(false);

  const handleMouseOver = (entered: boolean) => {
    /* console.log(`Mouse over slot on ${props.start.toLocaleDateString()}`); */
    if (props.multiSelect.enabled && !props.multiSelect.ended && props.className.indexOf("k-other-month") === -1) {
      setHovering(entered);
      // Perform any other action here
      if (props.multiSelect.start && entered) {
        props.onSlotMouseOver();
      }
    }
  };

  const checkSelected = () => {
    if (!props.multiSelect.start) return false;
    let start = props.multiSelect.start.getTime() <= props.multiSelect.end.getTime() ? props.multiSelect.start.getTime() : props.multiSelect.end.getTime();
    let end = props.multiSelect.start.getTime() <= props.multiSelect.end.getTime() ? props.multiSelect.end.getTime() : props.multiSelect.start.getTime();
    return props.start.getTime() >= start && props.start.getTime() <= end;
  }

  return (
    <SchedulerSlot
      {...props}
      style={props.multiSelect.enabled && hovering ? { backgroundColor: '#f0f0f0' } : {}}
      onMouseEnter={() => handleMouseOver(true)}
      onMouseLeave={() => handleMouseOver(false)}
      selected={checkSelected()}
    >
      {props.children}
    </SchedulerSlot>
  );
};

const MultipleSelectionCrud = (props: any) => {
  if (props.renderData && props.show) {
    const { component, title } = props.renderData(props.timesheetId, props.getDates());
    return <CustomWindow
      showModalFooter={false}
      height={500}
      width={600}
      show={props.show}
      title={title || ""}
      onClose={props.handleOpenCloseModal}
    >
      {component}
    </CustomWindow>
  }
}

export default function CustomCalendar(props: Readonly<CustomCalendarProps>) {

  const [multiSelect, setMultiSelect] = useState<{
    enabled: boolean,
    start: any,
    end: any,
    ended: boolean,
  }>({
    enabled: false,
    start: null,
    end: null,
    ended: false,
  });
  const [toggle, setToggle] = useState<boolean>(false);

  const [multipleSelectModalEnabled, setMultipleSelectModalEnabled] = useState<boolean>(false)

  const handleMultiSelectClick = (config: any) => {
    if (config.className.indexOf("k-other-month") >= 0) return;
    if (!multiSelect.start) {
      setMultiSelect(prev => {
        return {
          ...prev,
          start: config.start,
          end: config.start,
        }
      });
    } else if (!multiSelect.ended) {
      setMultiSelect(prev => {
        return {
          ...prev,
          ended: true,
        }
      });
    } else {
      setMultiSelect({
        enabled: true,
        start: config.start,
        end: config.start,
        ended: false,
      });
    }
  }

  const handleMultiSelectEnabled = () => {
    setMultiSelect(prev => {
      return {
        ...prev,
        enabled: true,
      }
    });
  }

  const handleMultiSelectDisabled = (cancelled: boolean) => {
    setMultiSelect(prev => {
      return {
        ended: cancelled ? false : true,
        start: cancelled ? null : prev.start,
        end: cancelled ? null : prev.end,
        enabled: false,
      }
    });

    if (!cancelled) {
      setMultipleSelectModalEnabled(true);
    }
  }

  const handleSlotMouseOver = (props: any) => {
    if (multiSelect.end.getTime() !== props.start.getTime()) {
      setMultiSelect(prev => {
        return {
          ...prev,
          end: props.start,
        }
      })
    }
  }

  const getDatesList = () => {
    if (multiSelect.ended) {
      const dates: Date[] = [];
      let currentDate = multiSelect.start;

      while (currentDate <= multiSelect.end) {
        dates.push(new Date(currentDate)); // Add the current date to the array
        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
      }

      return dates;
    }

    return [];
  }

  /* useEffect(() => {
    console.log(multiSelect)
  }, [multiSelect]) */

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
      editSlot={(config) => (
        <EditSlot
          multiSelectEnabled={multiSelect.enabled}
          onMultiSelectClick={() => handleMultiSelectClick(config)}
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
      header={(props) => (
        <CustomHeader
          {...props}
          onMultipleSelectEnabled={() => handleMultiSelectEnabled()}
          onMultipleSelectDisabled={(cancelled: boolean) => handleMultiSelectDisabled(cancelled)}
          multipleSelectButtonDisabled={!(multiSelect.start && multiSelect.end)}
          toggle={toggle}
          setToggle={setToggle}
        />
      )}
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
      <MonthView slot={(props) => CustomSlot({
        ...props,
        multiSelect: multiSelect,
        onSlotMouseOver: () => handleSlotMouseOver(props)
      })} />
    </Scheduler>
    <MultipleSelectionCrud
      show={multipleSelectModalEnabled}
      renderData={props.multipleSelectionModal}
      handleOpenCloseModal={() => setMultipleSelectModalEnabled(false)}
      getDates={getDatesList}
      timesheetId={props.model?.timeSheetsId || -1}
    />
  </>);
}
