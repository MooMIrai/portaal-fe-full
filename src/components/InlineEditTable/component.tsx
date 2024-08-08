import React, { useEffect, useState } from "react";
import {
  Grid,
  GridColumn,
  GridItemChangeEvent,
} from "@progress/kendo-react-grid";
import styles from "./style.module.scss";
import { TableColumn } from "../../models/tableModel";
import { Button } from "@progress/kendo-react-buttons";

type InlineEditTableProps = {
  getData: () => Promise<any> /* { data: Array<Record<string, any>> } */;
  columns: TableColumn[];
  list: Array<Record<string, any>>;
  setList: (res: any) => void;
  className?: string;
  resizable?: boolean;
  onItemChange: (event: GridItemChangeEvent) => void;
  footer?: CustomFooterProps;
};

interface CustomFooterProps {
  actionLabel: string;
  cancelLabel: string;
  onAction: () => void;
  onCancel: () => void;
}

const CustomFooter = (props: CustomFooterProps) => {
  return (
    <div
      className="k-grid-header k-table-thead k-table-row"
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "flex-end",
        padding: "10px 0",
        border: "1px solid rgba(33, 37, 41, 0.13)",
      }}
    >
      <Button onClick={props.onCancel} style={{ marginRight: 10 }}>
        {props.cancelLabel}
      </Button>
      <Button
        style={{ marginRight: 10 }}
        themeColor={"primary"}
        onClick={props.onAction}
      >
        {props.actionLabel}
      </Button>
    </div>
  );
};

export default function InlineEditTable(props: InlineEditTableProps) {
  const refreshTable = async () => {
    const res = await props.getData();
    props.setList(res);
  };

  useEffect(() => {
    refreshTable();
  }, []);

  return (
    <div className={`${styles.gridContainer} ${props.className || ""}`}>
      <Grid
        editField={"inEdit"}
        onItemChange={props.onItemChange}
        resizable={props.resizable}
        style={{ height: "calc(100% - 60px)" }}
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
      {props.footer && (
        <CustomFooter
          cancelLabel={props.footer.cancelLabel}
          actionLabel={props.footer.actionLabel}
          onAction={props.footer.onAction}
          onCancel={props.footer.onCancel}
        />
      )}
    </div>
  );
}
