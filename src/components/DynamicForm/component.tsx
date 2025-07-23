import React, {useContext, useRef} from "react";
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
  ButtonInput,
  UrlInput
} from "./fieldComponents";
import CountrySelector from "../CountrySelector/component";
import styles from "./styles.module.scss";
import SkillMultiSelect from "../SkillsSelector/component";
import { FormRefContext } from "../Tab/form.ref.provider";

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
      return ButtonInput;
    case 'urlInput':
      return UrlInput;
    case 'skill':
      return SkillMultiSelect
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
  | "urlInput"
  | "skill"

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  validator?: (value: any,valueGetter?:(name:string)=>void) => string | undefined;
  options?: string[] | any[];
  value: any;
  disabled?: boolean;
  required?: boolean;
  conditions?: (values: any) => boolean;
  showLabel?: boolean
  valueOnChange?: (name: string, value: any) => void;
  onChange: (value: any) => void;
  onDownload?: () => void
  onFileUpload?: (file: File) => void;
  multiple?: boolean
  existingFile?: { name: string };
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  loader?: boolean
  existingLink?: string;
  onFileDrop?: ((files: File[]) => void)
  isDroppable?:boolean,
  noContainer?:boolean;
  [x: string]: any;
  //onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface DynamicFormProps {
  fields: FieldConfig[];
  children?: JSX.Element | undefined;
  formData: Record<string, any> | undefined;
  onSubmit: (dataItem: any) => void;
  description?: string;
  showSubmit?: boolean;
  showCancel?: boolean;
  extraButton?: boolean;
  extraBtnAction?: () => void;
  customDisabled?: boolean;
  submitText: string;
  addedFields?: Record<string, React.JSX.Element>;
  style?:any;
  noDisableOnTouched?: boolean;
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

  const { name, type, label, validator, options, disabled, required, showLabel = true, onDownload, multiple, existingFile, onFileUpload, onClick, loader, existingLink, onFileDrop,isDroppable, onChange: fieldOnChange, monthOnly } = field;
  let Component: any = getFieldComponent(type);

  if (addedFields && Object.keys(addedFields).some(s => s === type)) {
    Component = addedFields[type];
  }

  return (
    <Field
      name={name}
      component={Component}
      monthOnly={monthOnly}
      label={label + (required ? '*' : '')}
      showLabel={showLabel}
      validator={validator}
      options={options}
      type={type}
      disabled={disabled}
      files={formRenderProps.valueGetter(name)}
      multiple={multiple}
      onFileDrop={onFileDrop}
      onDownload={onDownload}
      onFileUpload={onFileUpload}
      isDroppable={isDroppable}
      onClick={onClick}
      existingLink={existingLink}
      loader={loader}
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

        fieldOnChange?.(value);
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
    showCancel,
    extraButton,
    extraBtnAction,
    description,
    children,
    customDisabled,
    submitText,
    addedFields,
    noDisableOnTouched
  } = props;

  const formRefContext = useContext(FormRefContext);
  const isTouched = (ref: any) => ref?.current ? Object.values(ref.current.visited).length > 0 : false;

  const clearFilters = () => {
    (ref as any)?.current?.resetForm();
    props.onSubmit({});
  }

  return (
    <>
      <Form
      initialValues={formData}
      onSubmit={(dataItem) => onSubmit(dataItem)}
      ref={ref}
      ignoreModified={noDisableOnTouched}
      render={(formRenderProps: FormRenderProps) => (
        <FormElement>
          {children === undefined && (
            <fieldset className={"k-form-fieldset"}  style={props.style}>
              <legend className={"k-form-legend"}>{description}</legend>
              {fields.filter((field) => {
                if (noDisableOnTouched) formRefContext?.setDisabled(true);
                else if (formRefContext?.setDisabled) formRefContext.setDisabled(isTouched(ref));
                const formRef: any = ref;
                return !field.conditions || (formRef && formRef.current && field.conditions(formRef.current.values))
              }).map((field, index) => {
                if(field.noContainer){
                  return <DynamicField
                  addedFields={addedFields}
                  field={field}
                  formRenderProps={formRenderProps}
                  valueOnChange={field.valueOnChange}
                />
                }
                return (
                  <FieldWrapper key={index} className={field.name+'-input'}>
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
            {extraButton && <Button type="button" onClick={extraBtnAction}>Cancel</Button>}
            {showCancel && <Button type="button" onClick={clearFilters} themeColor={"secondary"}>Cancella</Button>}
            {showSubmit && (
              <Button
                themeColor={"primary"}
                disabled={
                  customDisabled ?? !formRenderProps.allowSubmit
                  /* children !== undefined || customDisabled === true
                    ? false
                    : !formRenderProps.allowSubmit */
                }
              >
                {submitText}
              </Button>
            )}
          </div>
        </FormElement>
      )}
      />
    </>
  );
});



export default DynamicForm;
