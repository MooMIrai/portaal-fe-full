import React, { useEffect, useState } from "react";
import {
  Grid,
  GridColumn,
  GridItemChangeEvent,
} from "@progress/kendo-react-grid";

import styles from "./style.module.scss";
import { TableColumn } from "../../models/tableModel";

type InlineEditTableProps = {
  getData: () => Promise<{ data: Array<Record<string, any>> }>;
  columns: TableColumn[];
  list: Array<Record<string, any>>;
  setList: React.Dispatch<any>;
  className?: string;
  resizable?: boolean;
  onItemChange: (event: GridItemChangeEvent) => void;
};

export default function InlineEditTable(props: InlineEditTableProps) {
  const refreshTable = async () => {
    const res = await props.getData();
    props.setList(
      res?.data.map((item) => Object.assign({ inEdit: true }, item))
    );
  };

  useEffect(() => {
    refreshTable();
  }, []);

  return (
    <div className={styles.gridContainer}>
      <Grid
        editField={"inEdit"}
        onItemChange={props.onItemChange}
        resizable={props.resizable}
        style={{ height: "100%" }}
        data={props.list}
      >
        {props.columns.map((column, idx) => (
          <GridColumn
            key={idx}
            field={column.key}
            title={column.label}
            editable={column.editable}
            editor={column.editor}
            format={column.format}
          />
        ))}
      </Grid>
    </div>
  );
}
