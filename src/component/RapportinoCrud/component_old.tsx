import React, { useState } from "react";
import InlineEditTable from "common/InlineEditTable";
import { TimesheetsService } from "../../services/rapportinoService";

interface RapportinoCrudProps {
  activitiesHours: any;
  item?: any;
  dates?: Date[];
  timesheetId?: number;
  onClose: () => void;
  onActivitiesAdded: () => void;
}

const RapportinoCrud = (props: RapportinoCrudProps) => {
  const [list, setList] = useState<any>();

  const mockLoadData = (date: Date, timesheetId: number) => {
    return TimesheetsService.getActivitiesByDate(date, timesheetId);
  };

  const mockLoadArrayData = (dates: Date[], timesheetId: number) => {
    return TimesheetsService.getActivitiesByListDates(dates, timesheetId);
  }

  const loadData = async () => {
    debugger;
    try {
      if (props.item && props.item.timeSheetsId) {
        console.log("rpcrud:", props)
        const resources = await mockLoadData(
          props.item.start,
          props.item.timeSheetsId
        );
        return resources;
      } else if (props.dates?.length && props.timesheetId != null) {
        const resources = await mockLoadArrayData(
          props.dates,
          props.timesheetId
        );
        return resources;
      }
    } catch (error) {
      console.error("Error loading data:", error);
      return [];
    }
  };

  const itemChange = (event) => {
    let newData = list?.map((item: any) => {
      if (item.activityId === event.dataItem.activityId) {
        item[event.field || ""] = event.value;
      }
      return item;
    });

    setList(newData);
  };

  const handleConfirm = async () => {
    if (props.item && props.item.timeSheetsId) {
      const timesheetDetails: {
        hours: number,
        minutes: number,
        activity_id: number,
        leaverequest_id: number
      }[] = list.map((item: any) => {
        return {
          hours: item.hours,
          minutes: item.minutes || 0,
          activity_id: item.activityId,
          leaverequest_id: item.leaveRequestId,
        }
      });

      try {
        const response = await TimesheetsService.syncDay(
          props.item.timeSheetsId,
          props.item.start.getDate(),
          timesheetDetails
        );
        if (response) {
          props.onClose();
          props.onActivitiesAdded();
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    } else if (props.dates && props.timesheetId) {
      const timesheetDetails: {
        hours: number,
        minutes: number,
        activity_id: number,
        leaverequest_id: number
      }[] = list.map((item: any) => {
        return {
          hours: item.hours,
          minutes: item.minutes || 0,
          activity_id: item.activityId,
          leaverequest_id: item.leaveRequestId,
        }
      });

      const data = props.dates.map(date => {
        return {
          timesheet_id: props.timesheetId || 0,
          day: date.getDate(),
          TimeSheetDetails: timesheetDetails
        }
      });

      try {
        const response = await TimesheetsService.syncMultipleDays(
          data
        );
        if (response) {
          props.onClose();
          props.onActivitiesAdded();
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }
  }

  return (
    <InlineEditTable
      getData={loadData}
      list={list}
      groupable={true}
      group={[{ field: "productive" }]}
      setList={(res) => {
        console.log("res: ", res);
        setList(
          res?.map((item: any) => {
            let hour = 0;

            const foundElementInserted = props.activitiesHours.find(
              (el) => el.id === item.id
            );

            if (foundElementInserted) {
              hour = foundElementInserted.hours;
            }

            return {
              hours: hour,
              activityId: item.id,
              code: item.code,
              inEdit: true,
              productive: item.ActivityType != null ? "No" : "Si"
            };
          })
        );
      }}
      onItemChange={itemChange}
      columns={[
        {
          key: "productive",
          label: "Produttiva",
          editable: false,
          type: "string",
          sortable: false,
        },
        {
          key: "code",
          label: "Commesse",
          editable: false,
          type: "string",
          sortable: false,
          editor: "text",
        },
        {
          key: "hours",
          label: "Ore",
          editable: true,
          type: "string",
          sortable: false,
          editor: "numeric",
        },
      ]}
      footer={{
        actionLabel: "Conferma",
        cancelLabel: "Annulla",
        onAction: () => {
          handleConfirm();
        },
        onCancel: () => {
          props.onClose();
        },
      }}
    />
  );
};

export default RapportinoCrud;
