export enum FORM_TYPE {
  "view"="view",
  "edit"="edit",
  "delete"="delete",
  "create"="create",
  "custom"="custom",
}

export type Fields = Record<string, FieldConfig>;

export type FieldType =
  | "text"
  | "email"
  | "number"
  | "date"
  | "time"
  | "textarea"
  | "password"
  | "checkbox"
  | "radio"
  | "select";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  validator?: (value: any) => string | undefined;
  options?: any;
  value: any;
  disabled?: boolean;
  required?: boolean;
  showLabel?:boolean;
  indexPosition?: number;
  //onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface DynamicFormProps {
  fields: FieldConfig[];
  children?: JSX.Element | undefined;
  formData: Record<string, any> | undefined;
  onSubmit: (dataItem: any) => void;
  description?: string;
  showSubmit?: boolean;
  extraButton?: boolean;
  extraBtnAction?: () => void;
  customDisabled?: boolean;
  submitText: string;
}
