export interface TableColumn {
  key: string;
  label: string;
  sortable: boolean;
  type?: TABLE_COLUMN_TYPE;
  render?: (row: any, refreshTable?: () => void) => JSX.Element;
  filter?: any;
}

export enum TABLE_COLUMN_TYPE {
  "string",
  "custom",
}

export enum TABLE_ACTION_TYPE {
  "show",
  "edit",
  "delete",
  "create",
  "custom",
}
