import { AutoComplete, AutoCompleteProps, DropDownList } from "@progress/kendo-react-dropdowns";
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
  const { validationMessage, visited, disabled, required, value, ...others } =
    fieldRenderProps;
  return (
    <div className="k-form-field-wrap">
      <Input
        {...others}
        value={value ?? ""}
        required={required}
        disabled={disabled}
      />
      {visited && validationMessage && <Error>{validationMessage}</Error>}
    </div>
  );
};

const DateInput = (
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
    <div className="k-form-field-wrap">
      <label>{label}</label>
      <DatePicker
        {...others}
        value={value ?? null}
        required={required}
        disabled={disabled}
      />
      {visited && validationMessage && <Error>{validationMessage}</Error>}
    </div>
  );
};

type AutocompleteInputProps = {
  label?: string;
  placeHolder?: string;
  style?: React.CSSProperties;
} & AutoCompleteProps; 

const AutocompleteInput: React.FC<AutocompleteInputProps> = (props) => {
  const { label, placeHolder, style, data, value, onChange, ...autoCompleteProps } = props;

  return (
      <div>
          {label && <div>{label}</div>}
          <AutoComplete
              data={data}
              value={value}
              onChange={onChange}
              placeholder={placeHolder}
              style={style}
              {...autoCompleteProps} 
          />
      </div>
  );
};

export default AutocompleteInput;

const EmailInput = (
  fieldRenderProps: FieldRenderProps & { disabled?: boolean }
) => {
  const { validationMessage, visited, disabled, required, value, ...others } =
    fieldRenderProps;
  return (
    <div className="k-form-field-wrap">
      <Input
        type="email"
        {...others}
        value={value ?? ""}
        required={required}
        disabled={disabled}
      />
      {visited && validationMessage && <Error>{validationMessage}</Error>}
    </div>
  );
};

const PasswordInput = (
  fieldRenderProps: FieldRenderProps & { disabled?: boolean }
) => {
  const { validationMessage, visited, disabled, required, value, ...others } =
    fieldRenderProps;
  return (
    <div className="k-form-field-wrap">
      <Input
        type="password"
        {...others}
        value={value ?? ""}
        required={required}
        disabled={disabled}
      />
      {visited && validationMessage && <Error>{validationMessage}</Error>}
    </div>
  );
};

const TextAreaInput = (
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
    <div className="k-form-field-wrap">
      <div>{label}</div>
      <TextArea
        {...others}
        value={value ?? ""}
        required={required}
        disabled={disabled}
      />
      {visited && validationMessage && <Error>{validationMessage}</Error>}
    </div>
  );
};

const SelectInput = (
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
    <div className="k-form-field-wrap">
      <DropDownList
        data={options}
        {...others}
        value={value ?? undefined}
        required={required}
        disabled={disabled}
      />
      {visited && validationMessage && <Error>{validationMessage}</Error>}
    </div>
  );
};

const RadioGroupInput = (
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
    <div className="k-form-field-wrap">
      <div>{label}</div>
      <RadioGroup
        data={options}
        {...others}
        value={value ?? undefined}
        disabled={disabled}
      />
      {visited && validationMessage && <Error>{validationMessage}</Error>}
    </div>
  );
};

const CheckboxInput = (
  fieldRenderProps: FieldRenderProps & { disabled?: boolean }
) => {
  const { validationMessage, visited, disabled, required, value, ...others } =
    fieldRenderProps;
  return (
    <div className="k-form-field-wrap">
      <Checkbox
        {...others}
        value={value ?? false}
        required={required}
        disabled={disabled}
      />
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
  AutocompleteInput
};
