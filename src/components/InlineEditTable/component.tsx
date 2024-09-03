import React, { useEffect, useState } from "react";
import {
  Grid,
  GridColumn,
  GridItemChangeEvent,
} from "@progress/kendo-react-grid";
import styles from "./style.module.scss";
import { TableColumn } from "../../models/tableModel";
import { Button } from "@progress/kendo-react-buttons";
import { process } from '@progress/kendo-data-query';

type InlineEditTableProps = {
  getData: () => Promise<any> /* { data: Array<Record<string, any>> } */;
  columns: TableColumn[];
  list: Array<Record<string, any>>;
  setList: (res: any) => void;
  className?: string;
  resizable?: boolean;
  onItemChange: (event: GridItemChangeEvent) => void;
  footer?: CustomFooterProps;
  groupable?: boolean;
  group?: any[];
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
  const [expandedState, setExpandedState] = useState<any>({});

  const handleExpandChange = (e: any) => {
    console.log(e);
    const { dataItem } = e;
    const expanded = !dataItem.expanded;
    const newExpandedState = { ...expandedState, [dataItem.value]: expanded };
    setExpandedState(newExpandedState);
  };

  const addExpandedStateToGroups = (data: any) => {
    return data.map((group: any) => ({
      ...group,
      expanded: expandedState[group.value],
      items: group.items ? addExpandedStateToGroups(group.items) : group.items,
    }));
  };

  console.log("props.list:", props.list);

  const groupedData = process(props.list || [], { group: props.group });
  const dataWithExpandedState = addExpandedStateToGroups(groupedData.data);

  console.log("groupedData:", groupedData);

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
        data={dataWithExpandedState}
        groupable={props.groupable}
        group={props.group}
        expandField="expanded"
        onExpandChange={handleExpandChange}
      >
        {props.columns.map((column, idx) => (
          <GridColumn
            key={idx}
            field={column.key}
            title={column.label}
            editable={column.editable}
            editor={column.editor}
            format={column.format}
            hidden={column.hidden}
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
