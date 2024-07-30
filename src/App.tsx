import React, { useState } from "react";
import ReactDOM from "react-dom/client";

import "./index.scss";
import { TABLE_COLUMN_TYPE } from "./models/tableModel";

import InlineEditTable from "./components/InlineEditTable/component";
import { GridItemChangeEvent } from "@progress/kendo-react-grid";

/* import AuthService from './services/AuthService'

AuthService.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsImVtYWlsIjoiYWV0bmFAdGFhbC5pdCIsInVzZXJuYW1lIjoiYWV0bmFAdGFhbC5pdCIsInJvbGVzIjpbeyJpZCI6Mywicm9sZSI6IkNPTSIsImRlc2NyaXB0aW9uIjoiQ29tbWVyY2lhbGUiLCJkYXRlX2NyZWF0ZWQiOiIyMDI0LTA3LTIzVDEwOjMwOjAzLjA5NloiLCJkYXRlX21vZGlmaWVkIjoiMjAyNC0wNy0yM1QxMDozMDowMy4wOTZaIiwidXNlcl9jcmVhdGVkIjoiU2VlZCBBdXRvbWF0aWMiLCJ1c2VyX21vZGlmaWVkIjoiU2VlZCBBdXRvbWF0aWMifV0sImlhdCI6MTcyMjMyODg2NiwiZXhwIjoxNzIyOTMzNjY2fQ.TRse6DtVuWYwy656j4rECEx-tXd9-zVzRyGjoi7Cn3')
console.log(AuthService.getToken()); */

const App = () => {
  const [list, setList] = useState<any>();
  const mockLoadData = () => {
    return new Promise<{
      data: Record<string, any>[];
    }>((resolve) => {
      setTimeout(() => {
        const mockData = [
          { id: 1, commesse: "Item 1", ore: "", date: new Date() },
          { id: 2, commesse: "Item 2", ore: "", date: new Date() },
          { id: 3, commesse: "Item 3", ore: "", date: new Date() },
        ];
        resolve({ data: mockData });
      }, 1000);
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

  const itemChange = (e: GridItemChangeEvent) => {
    let newData = list?.map((item: any) => {
      if (item.id === e.dataItem.id) {
        item[e.field || ""] = e.value;
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
          editable: true,
          type: TABLE_COLUMN_TYPE.string,
          sortable: false,
          editor: "text",
        },
        {
          key: "ore",
          label: "Ore",
          editable: true,
          type: TABLE_COLUMN_TYPE.string,
          sortable: false,
          editor: "numeric",
        },
        {
          key: "data",
          label: "Data",
          editable: true,
          type: TABLE_COLUMN_TYPE.string,
          sortable: false,
          editor: "date",
          format: "{0:d}",
        },
      ]}
    />
  );
};
const rootElement = document.getElementById("app");
if (!rootElement) throw new Error("Failed to find the root element");

const root = ReactDOM.createRoot(rootElement as HTMLElement);

root.render(<App />);
