import * as React from "react";
import { Button } from "@progress/kendo-react-buttons";
import {
  Form,
  FormRenderProps,
  FormElement,
  FieldWrapper,
  Field,
} from "@progress/kendo-react-form";
import {
  TextInput,
  EmailInput,
  PasswordInput,
  TextAreaInput,
  SelectInput,
  RadioGroupInput,
  CheckboxInput,
  DateInput,
  YearInput,
  UploadSingleFileInput,
  UploadMultipleFilesInput,
  ButtonInput
} from "./fieldComponents";
import CountrySelector from "../CountrySelector/component";
import styles from "./styles.module.scss";

const getFieldComponent = (type: FieldType) => {
  switch (type) {
    case "text":
    case "number":
    case "time":
      return TextInput;
    case "date":
      return DateInput;
    case "email":
      return EmailInput;
    case "password":
      return PasswordInput;
    case "textarea":
      return TextAreaInput;
    case "select":
      return SelectInput;
    case "radio":
      return RadioGroupInput;
    case "checkbox":
      return CheckboxInput;
    case 'year':
      return YearInput;
    case 'country':
      return CountrySelector;
    case 'uploadSingleFile':
      return UploadSingleFileInput;
    case 'uploadMultipleFiles':
      return UploadMultipleFilesInput;
    case 'buttonCustom':
      return ButtonInput
    default:
      return TextInput;
  }
};

export enum FORM_TYPE {
  "view",
  "edit",
  "delete",
  "create",
  "custom",
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
  | "select"
  | "year"
  | "country"
  | "uploadSingleFile"
  | "uploadMultipleFiles"
  | "buttonCustom"

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  validator?: (value: any) => string | undefined;
  options?: string[];
  value: any;
  disabled?: boolean;
  required?: boolean;
  conditions?: (values: any) => boolean;
  showLabel?: boolean
  valueOnChange?: (name: string, value: any) => void;
  onDownload?: () => void
  onFileUpload?: (file: File) => void;
  multiple?: boolean
  existingFile?: { name: string };
  onClick?: React.MouseEventHandler<HTMLButtonElement> 
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
  addedFields?: Record<string, React.JSX.Element>

}

const DynamicField = ({
  field,
  formRenderProps,
  addedFields,
  valueOnChange,
}: {
  field: FieldConfig;
  formRenderProps: FormRenderProps;
  addedFields?: Record<string, React.JSX.Element>
  valueOnChange?: (name: string, value: any) => void;

}) => {

  
  const { name, type, label, validator, options, disabled, required, showLabel = true, onDownload, multiple, existingFile,onFileUpload, onClick } = field;
  let Component: any = getFieldComponent(type);

  if (addedFields && Object.keys(addedFields).some(s => s === type)) {
    Component = addedFields[type];
  }


  return (
    <Field
      name={name}
      component={Component}
      label={label + (required ? '*' : '')}
      showLabel={showLabel}
      validator={validator}
      options={options}
      type={type}
      disabled={disabled}
      files={formRenderProps.valueGetter(name)}
      multiple={multiple}
      onDownload={onDownload}
      onFileUpload={onFileUpload}
      onClick={onClick}
      existingFile={existingFile}
      value={formRenderProps.valueGetter(name)}
      onChange={(event) => {

        let value = undefined;
        if (event.value) {
          value = event.value;
        } else if (event.target) {
          value = event.target.value;
        }


        formRenderProps.onChange(name, {
          value: value,
        });

        // Funzione custom per prendere i valori del value 
        if (valueOnChange) {
          valueOnChange(name, value);
        }
      }}
    />
  );
};

const DynamicForm = React.forwardRef<any, DynamicFormProps>((props, ref) => {

  const {
    fields,
    formData,
    onSubmit,
    showSubmit,
    extraButton,
    extraBtnAction,
    description,
    children,
    customDisabled,
    submitText,
    addedFields
  } = props;


  React.useEffect(() => {
    console.log(props.description + ' init')
    return () => console.log(props.description + ' destroy')
  }, [])

  return <Form
    initialValues={formData}
    onSubmit={(dataItem) => onSubmit(dataItem)}
    ref={ref}
    render={(formRenderProps: FormRenderProps) => (
      <FormElement>
        {children === undefined && (
          <fieldset className={"k-form-fieldset"}>
            <legend className={"k-form-legend"}>{description}</legend>
            {fields.filter((field) => {
              const formRef: any = ref;
              return !field.conditions || (formRef && formRef.current && field.conditions(formRef.current.values))
            }).map((field, index) => {
              return (
                <FieldWrapper key={index} style={field.type === 'country' ? { gridColumn: 'span 3' } : undefined /* || field.type === 'upload' ?{gridColumn:'span 2'}:undefined */}>
                  <DynamicField
                    addedFields={addedFields}
                    field={field}
                    formRenderProps={formRenderProps}
                    valueOnChange={field.valueOnChange}
                  />

                </FieldWrapper>
              )
            }
            )}
          </fieldset>
        )}
        {children}
        <div className={"k-form-buttons " + (styles.buttonsContainer ?? '')}>
          {extraButton && <Button onClick={extraBtnAction}>Cancel</Button>}
          {showSubmit && (
            <Button
              themeColor={"primary"}
              disabled={
                children !== undefined || customDisabled === true
                  ? false
                  : !formRenderProps.allowSubmit
              }
            >
              {submitText}
            </Button>
          )}
        </div>
      </FormElement>
    )}
  />
})



export default DynamicForm;
