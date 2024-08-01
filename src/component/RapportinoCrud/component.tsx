import React, { useState } from "react";
import InlineEditTable from "common/InlineEditTable";

interface RapportinoCrudProps {
  item: any;
  onClose: () => void;
}

const RapportinoCrud = (props: RapportinoCrudProps) => {
  const [list, setList] = useState<any>();

  const mockLoadData = () => {
    return new Promise<{
      data: Record<string, any>[];
    }>((resolve) => {
      const mockData = [
        { id: 1, commesse: "Item 1", ore: 0, date: new Date() },
        { id: 2, commesse: "Item 2", ore: 4, date: new Date() },
        { id: 3, commesse: "Item 3", ore: 0, date: new Date() },
      ];
      resolve({ data: mockData });
    });
  };

  const loadData = async () => {
    try {
      const resources = await mockLoadData();
      return resources;
    } catch (error) {
      console.error("Error loading data:", error);
      return { data: [], meta: { total: 0 } };
    }
  };

  const itemChange = (event) => {
    let newData = list?.map((item: any) => {
      if (item.id === event.dataItem.id) {
        item[event.field || ""] = event.value;
      }
      return item;
    });
    setList(newData);
  };

  return (
    <InlineEditTable
      getData={loadData}
      list={list}
      setList={setList}
      onItemChange={itemChange}
      columns={[
        {
          key: "commesse",
          label: "Commesse",
          editable: false,
          type: "string",
          sortable: false,
          editor: "text",
        },
        {
          key: "ore",
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
