export interface TableColumn {
  editable?: boolean;
  editor?: "boolean" | "text" | "numeric" | "date";
  format?: string;
  key: string;
  label: string;
  sortable: boolean;
  type?: TABLE_COLUMN_TYPE;
  render?: (row: any, refreshTable?: () => void) => JSX.Element;
  filter?: any;
}

export enum TABLE_COLUMN_TYPE {
  "string"="string",
  "custom"="custom",
}

export enum TABLE_ACTION_TYPE {
  "show"="show",
  "edit"="edit",
  "delete"="delete",
  "create"="create",
  "custom"="custom",
}
