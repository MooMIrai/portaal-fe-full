import React, { useState } from "react";
import InlineEditTable from "common/InlineEditTable";
import { TimesheetsService } from "../../services/rapportinoService";

interface RapportinoCrudProps {
  activitiesHours: any;
  item: any;
  onClose: () => void;
}

const RapportinoCrud = (props: RapportinoCrudProps) => {
  const [list, setList] = useState<any>();

  const mockLoadData = (date: Date, timesheetId: number) => {
    return TimesheetsService.getActivitiesByDate(date, timesheetId);
  };

  const loadData = async () => {
    try {
      const resources = await mockLoadData(
        props.item.start,
        props.item.timeSheetsId
      );
      return resources;
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

  console.log("list: ", list);

  return (
    <InlineEditTable
      getData={loadData}
      list={list}
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
            };
          })
        );
      }}
      onItemChange={itemChange}
      columns={[
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
          props.onClose();
        },
        onCancel: () => {
          props.onClose();
        },
      }}
    />
  );
};

export default RapportinoCrud;
