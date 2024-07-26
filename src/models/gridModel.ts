import { ReactNode } from "react";

export interface GenericGridProps<T> {
  data: T[];
  defaultItem?: any;
  columns: ColumnInterface<T>[];
  onAddNew: (dataItem: T) => void;
  onEditItem: (dataItem: T) => void;
  onDeleteItem: (dataItem: T) => void;
  onViewItem: (dataItem: T) => void;
  renderModalContent: RenderModalContent<T>; // Aggiungi la nuova prop
}

export type RenderModalContent<T> = (
  dataItem: T,
  type: string,
  closeModal: () => void
) => JSX.Element;

export interface PaginationModel {
  skip?: number;
  take?: number;
  totalCount?: number;
  siblingCount?: number;
  currentPage: number;
  pageSize: number;
}

export interface ColumnInterface<T> {
  field: any;
  title?: string;
  show?: boolean;
  filter?: "boolean" | "numeric" | "text" | "date" | undefined;
  minWidth?: number;
  minGridWidth?: number;
  locked?: boolean;
  width?: string | number;
}
