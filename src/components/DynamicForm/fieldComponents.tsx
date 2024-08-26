import React from "react";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { FieldRenderProps } from "@progress/kendo-react-form";
import {
  Input,
  TextArea,
  RadioGroup,
  Checkbox,
} from "@progress/kendo-react-inputs";
import { Calendar, CalendarProps, DatePicker } from "@progress/kendo-react-dateinputs";

import withField from "../../hoc/Field";

const TextInputC = (
  fieldRenderProps: FieldRenderProps & { disabled?: boolean }
) => {
  const { validationMessage, visited, disabled, required, value, label, ...others } =
    fieldRenderProps;
 
  return <Input
  {...others}
  value={value ?? ""}
  required={required}
  disabled={disabled}
/>
}

const DateInputC = (
  fieldRenderProps: FieldRenderProps & { disabled?: boolean; label?: string }
) => {
  const {
    validationMessage,
    visited,
    disabled,
    required,
    value,
    label,
    ...others
  } = fieldRenderProps;
  return <DatePicker
  {...others}
  value={value ?? null}
  required={required}
  disabled={disabled}
/>
};

const EmailInputC = (
  fieldRenderProps: FieldRenderProps & { disabled?: boolean }
) => {
  const { validationMessage, visited, disabled, required, value, ...others } =
    fieldRenderProps;
  return (
    
      <Input
        type="email"
        {...others}
        value={value ?? ""}
        required={required}
        disabled={disabled}
      />
      
  );
};

const PasswordInputC = (
  fieldRenderProps: FieldRenderProps & { disabled?: boolean }
) => {
  const { validationMessage, visited, disabled, required, value, ...others } =
    fieldRenderProps;
  return (
      <Input
        type="password"
        {...others}
        value={value ?? ""}
        required={required}
        disabled={disabled}
      />
  );
};

const TextAreaInputC = (
  fieldRenderProps: FieldRenderProps & { disabled?: boolean; label?: string }
) => {
  const {
    validationMessage,
    visited,
    disabled,
    required,
    value,
    label,
    ...others
  } = fieldRenderProps;
  return (
    
      <TextArea
        {...others}
        value={value ?? ""}
        required={required}
        disabled={disabled}
      />
      
  );
};

const SelectInputC = (
  fieldRenderProps: FieldRenderProps & { disabled?: boolean }
) => {
  const {
    validationMessage,
    visited,
    options,
    disabled,
    required,
    value,
    ...others
  } = fieldRenderProps;
  return (
   
      <DropDownList
        data={options}
        {...others}
        value={value ?? undefined}
        required={required}
        disabled={disabled}
      />

  );
};

const RadioGroupInputC = (
  fieldRenderProps: FieldRenderProps & { disabled?: boolean; label?: string }
) => {
  const {
    validationMessage,
    visited,
    options,
    disabled,
    value,
    label,
    ...others
  } = fieldRenderProps;
  return (
   
      <RadioGroup
        data={options}
        {...others}
        value={value ?? undefined}
        disabled={disabled}
      />

  );
};

const CheckboxInputC = (
  fieldRenderProps: FieldRenderProps & { disabled?: boolean }
) => {
  const { validationMessage, visited, disabled, required, value, ...others } =
    fieldRenderProps;
  return (
   
      <Checkbox
        value={value ?? false}
        required={required}
        disabled={disabled}
      />
      
  );
};

const CalendarOnlyYear=(props:CalendarProps<any>)=>{
  return <Calendar {...props} topView="decade" bottomView="decade"  />
}

const YearInputC = (
  fieldRenderProps: FieldRenderProps & { disabled?: boolean; label?: string }
) => {
  const {
    validationMessage,
    visited,
    disabled,
    required,
    value,
    label,
    ...others
  } = fieldRenderProps;
  return (
    
      <DatePicker
        {...others}
        format={'yyyy'}
        calendar={CalendarOnlyYear}
        value={value ?? null}
        required={required}
        disabled={disabled}
      />
      
  );
};

export const TextInput = withField(TextInputC);
export const DateInput = withField(DateInputC);
export const EmailInput = withField(EmailInputC);
export const PasswordInput = withField(PasswordInputC);
export const TextAreaInput = withField(TextAreaInputC);
export const SelectInput = withField(SelectInputC);
export const RadioGroupInput = withField(RadioGroupInputC);
export const CheckboxInput = withField(CheckboxInputC);
export const YearInput = withField(YearInputC);

