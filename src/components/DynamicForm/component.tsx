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
  YearInput
} from "./fieldComponents";
import CountrySelector from "../CountrySelector/component";

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
  | "country";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  validator?: (value: any) => string | undefined;
  options?: string[];
  value: any;
  disabled?: boolean;
  required?: boolean;
  conditions?:(values:any)=>boolean
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
  addedFields
}: {
  field: FieldConfig;
  formRenderProps: FormRenderProps;
  addedFields?:Record<string,React.JSX.Element>
}) => {

  const { name, type, label, validator, options, disabled,required } = field;
  let Component:any = getFieldComponent(type);

  if(addedFields && Object.keys(addedFields).some(s=>s===type)){
    Component = addedFields[type];
  }
 


  return (
    <Field
      name={name}
      component={Component}
      label={label + (required?'*':'')}
      validator={validator}
      options={options}
      type={type}
      disabled={disabled}
      value={formRenderProps.valueGetter(name)}
      onChange={(event) =>
        formRenderProps.onChange(name, {
          value: event? (event.value || event.target.value):undefined,
        })
      }
    />
  );
};

const DynamicForm = React.forwardRef<any,DynamicFormProps>((props,ref)=>{
  
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


  React.useEffect(()=>{
    console.log(props.description + ' init')
    return ()=> console.log(props.description + ' destroy')
  },[])

  return <Form
  initialValues={formData}
  onSubmit={(dataItem) => onSubmit(dataItem)}
  ref={ref}
  render={(formRenderProps: FormRenderProps) => (
    <FormElement style={{ maxWidth: 650 }}>
      {children === undefined && (
        <fieldset className={"k-form-fieldset"}>
          <legend className={"k-form-legend"}>{description}</legend>
          {fields.filter((field)=>{
            const formRef:any = ref; 
            return !field.conditions || (formRef && formRef.current && field.conditions(formRef.current.values))
          }).map((field, index) => {
            return (
            <FieldWrapper key={index}>
              
                <DynamicField
                  addedFields={addedFields}
                  field={field}
                  formRenderProps={formRenderProps}
                />
              
            </FieldWrapper>
          )}
          )}
        </fieldset>
      )}
      {children}
      <div className="k-form-buttons">
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
