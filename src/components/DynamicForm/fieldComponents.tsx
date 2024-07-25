import { DropDownList } from "@progress/kendo-react-dropdowns";
import { FieldRenderProps } from "@progress/kendo-react-form";
import {
  Input,
  TextArea,
  RadioGroup,
  Checkbox,
} from "@progress/kendo-react-inputs";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { Error, Label } from "@progress/kendo-react-labels";
import React from "react";

const TextInput = (
  fieldRenderProps: FieldRenderProps & { disabled?: boolean }
) => {
  const { validationMessage, visited, disabled, required, ...others } =
    fieldRenderProps;
  return (
    <div className="k-form-field-wrap">
      <Input {...others} required={required} disabled={disabled} />
      {visited && validationMessage && <Error>{validationMessage}</Error>}
    </div>
  );
};

const DateInput = (
  fieldRenderProps: FieldRenderProps & { disabled?: boolean , label?:string,}
) => {
  const { validationMessage, visited, disabled, required, label ,...others } =
    fieldRenderProps;
  return (
    <div className="k-form-field-wrap">
      <label>{label}</label>
      <DatePicker {...others} required={required} disabled={disabled} />
      {visited && validationMessage && <Error>{validationMessage}</Error>}
    </div>
  );
};

const EmailInput = (
  fieldRenderProps: FieldRenderProps & { disabled?: boolean }
) => {
  const { validationMessage, visited, disabled, required, ...others } =
    fieldRenderProps;
  return (
    <div className="k-form-field-wrap">
      <Input type="email" {...others} required={required} disabled={disabled} />
      {visited && validationMessage && <Error>{validationMessage}</Error>}
    </div>
  );
};

const PasswordInput = (
  fieldRenderProps: FieldRenderProps & { disabled?: boolean }
) => {
  const { validationMessage, visited, disabled, required, ...others } =
    fieldRenderProps;
  return (
    <div className="k-form-field-wrap">
      <Input
        type="password"
        {...others}
        required={required}
        disabled={disabled}
      />
      {visited && validationMessage && <Error>{validationMessage}</Error>}
    </div>
  );
};

const TextAreaInput = (
  fieldRenderProps: FieldRenderProps & { disabled?: boolean, label?: string }
) => {
  const { validationMessage, visited, disabled, required, label, ...others } =
    fieldRenderProps;
  return (
    <div className="k-form-field-wrap">
      <div>{label}</div>
      <TextArea {...others} required={required} disabled={disabled} />
      {visited && validationMessage && <Error>{validationMessage}</Error>}
    </div>
  );
};

const SelectInput = (
  fieldRenderProps: FieldRenderProps & { disabled?: boolean }
) => {
  const { validationMessage, visited, options, disabled, required, ...others } =
    fieldRenderProps;
  return (
    <div className="k-form-field-wrap">
      <DropDownList
        data={options}
        {...others}
        required={required}
        disabled={disabled}
      />
      {visited && validationMessage && <Error>{validationMessage}</Error>}
    </div>
  );
};

const RadioGroupInput = (
  fieldRenderProps: FieldRenderProps & { disabled?: boolean,label?:string }
) => {
  const { validationMessage, visited, options, disabled, label, ...others } =
    fieldRenderProps;
  return (
    <div className="k-form-field-wrap">
      <div>{label}</div>
      <RadioGroup data={options} {...others} disabled={disabled} />
      {visited && validationMessage && <Error>{validationMessage}</Error>}
    </div>
  );
};

const CheckboxInput = (
  fieldRenderProps: FieldRenderProps & { disabled?: boolean }
) => {
  const { validationMessage, visited, disabled, required, ...others } =
    fieldRenderProps;
  return (
    <div className="k-form-field-wrap">
      <Checkbox {...others} required={required} disabled={disabled} />
      {visited && validationMessage && <Error>{validationMessage}</Error>}
    </div>
  );
};

export {
  TextInput,
  DateInput,
  EmailInput,
  PasswordInput,
  TextAreaInput,
  SelectInput,
  RadioGroupInput,
  CheckboxInput,
};
