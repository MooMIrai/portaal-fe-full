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
  AutocompleteInput
} from "./fieldComponents";

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
      case "autocomplete":
        return AutocompleteInput;
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
  |"autocomplete";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  validator?: (value: any) => string | undefined;
  options?: string[];
  value: any;
  disabled?: boolean;
  required?: boolean;
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

const DynamicField = ({
  field,
  formRenderProps,
}: {
  field: FieldConfig;
  formRenderProps: FormRenderProps;
}) => {
  const { name, type, label, validator, options, disabled } = field;
  const Component = getFieldComponent(type);

  return (
    <Field
      name={name}
      component={Component}
      label={label}
      validator={validator}
      options={options}
      type={type}
      disabled={disabled}
      value={formRenderProps.valueGetter(name)}
      onChange={(event) =>
        formRenderProps.onChange(name, {
          value: event.value || event.target.value,
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
    submitText
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
          {fields.map((field, index) => (
            <FieldWrapper key={index}>
              <div className="k-form-field-wrap">
                <DynamicField
                  field={field}
                  formRenderProps={formRenderProps}
                />
              </div>
            </FieldWrapper>
          ))}
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
