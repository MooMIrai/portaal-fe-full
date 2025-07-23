import { GridFilterCellProps, GridHeaderCellProps } from "@progress/kendo-react-grid";
import { SVGIcon } from "@progress/kendo-svg-icons";

export interface TableColumn {
  editable?: boolean;
  editor?: "boolean" | "text" | "numeric" | "date";
  format?: string;
  key: string;
  label: string;
  sortable: boolean;
  type?: TABLE_COLUMN_TYPE;
  render?: (row: any, refreshTable?: () => void) => JSX.Element;
  renderValue?: (row: any) => string;
  filter?: any;
  hidden?: boolean;
  filterCell?: React.ComponentType<GridFilterCellProps>
  hasCellAction?: boolean;
  cellActionIcon?: SVGIcon;
  cellModalContent?: (dataItem: any) => JSX.Element;
  width?:number | string;
  headerCell?: (props: GridHeaderCellProps) => JSX.Element;
  [x: string]: any;
}

export enum TABLE_COLUMN_TYPE {
  "string" = "string",
  "date" = "date",
  "custom" = "custom",
  "datetime" = "datetime",
  "number" = "number",
  "boolean" = "boolean"
}

export enum TABLE_ACTION_TYPE {
  "show" = "show",
  "edit" = "edit",
  "delete" = "delete",
  "create" = "create",
  "custom" = "custom",
}
