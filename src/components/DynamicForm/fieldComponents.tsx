import React, { useState } from "react";
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
import UploadComponent from "../UpLoadSingleFile/component";
import { Button } from "@progress/kendo-react-buttons";
import UploadMultipleFileComponent from "../UploadMultipleFiles/component";
import UploadSingleFileComponent from "../UpLoadSingleFile/component";
import { UploadListItemProps } from "@progress/kendo-react-upload";

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
    value={value ? typeof value === 'string' ? new Date(value) : value : null}
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

const UploadMutilpleInputC = (
  fieldRenderProps: FieldRenderProps & { disabled?: boolean; label?: string, accept?: string, autoUpload?: boolean, onDownload?: () => void, multiple?: boolean, listItemUI?: React.ComponentType<UploadListItemProps> | undefined }
) => {
  const {
    validationMessage,
    visited,
    disabled,
    required,
    value,
    label,
    files,
    onDownload,
    multiple,
    listItemUI,
    ...others
  } = fieldRenderProps;

  const [attachments, setAttachments] = useState<any[]>(fieldRenderProps.value || []);


  const upLoadData = (event: any) => {
    if (Array.isArray(event.affectedFiles)) {
      const file = event.affectedFiles[0].getRawFile();
      const reader = new FileReader();

      reader.onload = function (evt) {
        const result = evt?.target?.result;

        if (result instanceof ArrayBuffer) {
          // Converti ArrayBuffer in Uint8Array
          const byteArray = new Uint8Array(result);
          const byteArrayAsArray = Array.from(byteArray);
          const newAttachment = {
            name: event.affectedFiles[0].name,
            extension: event.affectedFiles[0].extension,
            data: byteArrayAsArray, // Dati in Uint8Array
            size: event.affectedFiles[0].size,
            progress: 100,
            status: 2,
            uid: event.affectedFiles[0].uid,
          };

          setAttachments((prevAttachments) => [...prevAttachments, newAttachment]);
          fieldRenderProps.onChange({ value: [...attachments, newAttachment] });
        }
      };

      reader.readAsArrayBuffer(file);
    } else {
      console.error("affectedFiles non è un array:", event.affectedFiles);
    }
  };

  const onChangeHandler = (event: any) => {
    fieldRenderProps.onChange({ value: event.newState });
    upLoadData(event);
  };

  const onRemoveHandler = (event: any) => {

    const updatedAttachments = attachments.filter(
      (file) => file.uid !== event.affectedFiles[0].uid
    );
    setAttachments(updatedAttachments);


    fieldRenderProps.onChange({ value: updatedAttachments });
  };
  return (
    <div>
      <UploadMultipleFileComponent
        files={files}
        onAdd={onChangeHandler}
        onRemove={onRemoveHandler}
        multiple={false}
        listItemUI={listItemUI}
        disabled={disabled}
        onDownload={onDownload}
        {...others}
      />
    </div>
  );
};
const UploadSingleFIleInputC = (
  fieldRenderProps: FieldRenderProps & { disabled?: boolean; label?: string, accept?: string, autoUpload?: boolean, onDownload?: () => void, multiple?: boolean, existingFile?: { name: string, id: string }[], onFileUpload: (file: File) => void; }
) => {
  const {
    validationMessage,
    visited,
    disabled,
    required,
    value,
    label,
    files,
    onDownload,
    multiple,
    existingFile,
    onFileUpload,
    ...others
  } = fieldRenderProps;
  const handleFileUpload = (fileDataArray: any[]) => {
    fieldRenderProps.onChange({ value: fileDataArray });
  };
  return (
    <div>
      <UploadSingleFileComponent
        onFileChange={handleFileUpload}
        multiple={multiple}
        existingFile={existingFile}
        disabled={disabled}
        onDownload={onDownload}
        onFileUpload={onFileUpload}
      />
    </div>
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
      {...others}
      value={value ?? false}
      required={required}
      disabled={disabled}
    />

  );
};


const CalendarOnlyYear = (props: CalendarProps<any>) => {
  return <Calendar {...props} topView="decade" bottomView="decade" />
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
export const UploadSingleFileInput = withField(UploadSingleFIleInputC)
export const UploadMultipleFilesInput = withField(UploadMutilpleInputC)
