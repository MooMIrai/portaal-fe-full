import { FieldRenderProps } from "@progress/kendo-react-form";
import { Input } from "@progress/kendo-react-inputs";
import React from "react";
import withField from "../../hoc/Field";

const InputTexC = (
  fieldRenderProps: FieldRenderProps & { disabled?: boolean }
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
    <Input
      {...others}
      value={value ?? ""}
      required={required}
      disabled={disabled}
    />
  );
};

const InputTex = withField(InputTexC);

export default InputTex;
