export interface TableColumn {
  key: string;
  label: string;
  sortable: boolean;
  type?: string;
  render?: (row: any, refreshTable?: () => void) => JSX.Element;
  filter?:any;
}

