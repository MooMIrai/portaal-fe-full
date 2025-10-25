import { FieldRenderProps } from "@progress/kendo-react-form";
import { Input } from "@progress/kendo-react-inputs";
import React from "react";
import withField from "../../hoc/Field";
import { Button } from "@progress/kendo-react-buttons";
import {
  trashIcon
} from "@progress/kendo-svg-icons";

import styles from "./style.module.scss";

const InputTexC = (
  fieldRenderProps: FieldRenderProps & { disabled?: boolean, clearable?: boolean }
) => {
  const {
    validationMessage,
    visited,
    disabled,
    required,
    value,
    label,
    clearable,
    ...others
  } = fieldRenderProps;

  return (
    <div className={styles.container}>
      <Input
        className={styles.input}
        {...others}
        value={value ?? ""}
        required={required}
        disabled={disabled}
      />
      {clearable && value ? <Button
        className={styles.button}
        themeColor="primary"
        fillMode={"flat"}
        rounded={null}
        svgIcon={trashIcon}
        onClick={() => fieldRenderProps.onChange({ target: null, value: '' })}
        disabled={disabled}
      /> : null}
    </div>
  );
};

const InputTex = withField(InputTexC);

export default InputTex;
