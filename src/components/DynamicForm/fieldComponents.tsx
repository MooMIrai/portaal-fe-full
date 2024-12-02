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
import { Button } from "@progress/kendo-react-buttons";
import UploadMultipleFileComponent from "../UploadMultipleFiles/component";
import UploadSingleFileComponent from "../UpLoadSingleFile/component";
import { UploadListItemProps } from "@progress/kendo-react-upload";
import FileService from "../../services/FileService";
import { Loader } from "@progress/kendo-react-indicators";
import UploadMultiple from "../UploadMultiple/component";

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
  fieldRenderProps: FieldRenderProps & {
    disabled?: boolean; label?: string, accept?: string, autoUpload?: boolean, isDroppable?: boolean, onDownload?: (() => Promise<{
      fileId: string;
      fileName: string;
    }>) | undefined | undefined, multiple?: boolean, onFileDrop?: ((files: File[]) => void), listItemUI?: React.ComponentType<UploadListItemProps> | undefined
  }
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
    onFileDrop,
    isDroppable,
    ...others
  } = fieldRenderProps;

  const [attachments, setAttachments] = useState<any[]>(fieldRenderProps.value || []);


  const upLoadData = async (event: any) => {
    if (Array.isArray(event.affectedFiles)) {
      const file = event.affectedFiles[0].getRawFile();

      try {
        const newAttachment = await FileService.convertToBE(file);

        setAttachments((prevAttachments) => [...prevAttachments, newAttachment]);
        fieldRenderProps.onChange({ value: [...attachments, newAttachment] });
      } catch (error) {
        console.error('Errore durante la conversione del file:', error);
      }
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

  const handleFileDrop = async (droppedFiles: File[]) => {
    try {
      const newAttachments = await Promise.all(droppedFiles.map((item)=>FileService.convertToBE(item)));
      setAttachments((prevAttachments) => [...prevAttachments, ...newAttachments]);
      fieldRenderProps.onChange({ value: [...attachments, ...newAttachments] });
      console.log("newAtt", newAttachments)
    } catch (error) {
      console.error('Errore durante il caricamento dei file:', error);
    }
  };
  return (
    <div>
      <UploadMultipleFileComponent
        files={files}
        onAdd={onChangeHandler}
        onRemove={onRemoveHandler}
        isDroppable={isDroppable}
        multiple={false}
        disabled={disabled}
        onDownload={onDownload}
        onFileDrop={handleFileDrop}
        {...others}
      />
    </div>
  );
};

const UploadMultipleInputNew = (
  fieldRenderProps: FieldRenderProps & {
    disabled?: boolean; label?: string, accept?: string, autoUpload?: boolean, isDroppable?: boolean, onDownload?: (() => Promise<{
      fileId: string;
      fileName: string;
    }>) | undefined | undefined, multiple?: boolean, onFileDrop?: ((files: File[]) => void), listItemUI?: React.ComponentType<UploadListItemProps> | undefined
  }
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
    onFileDrop,
    isDroppable,
    existingFile,
    ...others
  } = fieldRenderProps;

  
  return (
    <div>
      <UploadMultiple
      name={others.name}
        existingFiles={existingFile}
        isReadOnly={!!disabled}
        onChange={(value)=>{
          fieldRenderProps.onChange({value})
        }}
      />
    </div>
  );
};

const UploadSingleFIleInputC = (
  fieldRenderProps: FieldRenderProps & {
    disabled?: boolean; label?: string, accept?: string, autoUpload?: boolean, onDownload?: (() => Promise<{
      fileId: string;
      fileName: string;
    }>) | undefined | undefined, multiple?: boolean, existingFile?: { name: string, id: string }[]
  }
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
    ...others
  } = fieldRenderProps;
  
  const handleFileUpload = (fileDataArray: any[]) => {
    fieldRenderProps.onChange({ value: fileDataArray });
  };

  const handleDownload = ()=>{
    
    if(value && value[0]){
      
      FileService.openFromBE(value[0])
    }
    
  }

  return (
    <div>
      <UploadSingleFileComponent
        name={others.name}
        onFileChange={handleFileUpload}
        multiple={multiple}
        existingFile={existingFile}
        disabled={disabled}
        onDownload={handleDownload}
      />
    </div>
  );
};



const ButtonInputC = (
  fieldRenderProps: FieldRenderProps & {
    disabled?: boolean;
    label?: string;
    onClick?: (event?: React.MouseEvent<HTMLButtonElement>, customParam?: any) => void;
    customParam?: any;
    loader?: boolean;
  }
) => {
  const {
    disabled,
    label,
    onClick,
    customParam,
    loader = false,
    ...others
  } = fieldRenderProps;


  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      if (loader) {
        setIsLoading(true);
      }

      try {
        await onClick(event, customParam);
      } finally {
        if (loader) {
          setIsLoading(false);
        }
      }
    }
  };

  return (
    <div>
      {isLoading ? (
        <Loader size="medium" type="converging-spinner" />
      ) : (
        <Button
          {...others}
          disabled={disabled}
          onClick={handleClick}
          themeColor={"primary"}
        >
          {label || "Submit"}
        </Button>
      )}
    </div>
  );
};

export default ButtonInputC;

const UrlInputC = (
  fieldRenderProps: FieldRenderProps & {
    disabled?: boolean;
    existingLink?: string;
  }
) => {
  const { validationMessage, visited, disabled, required, value, label, existingLink, ...others } = fieldRenderProps;



  return (
    <div>

      <Input
        type="url"
        {...others}
        value={value ?? ""}
        required={required}
        disabled={disabled}
        placeholder="Inserisci l'URL"
      />
      {value && (
        <div>
          <h4>Link caricato</h4>
          <a href={value} target="_blank" rel="noopener noreferrer">
            {value}
          </a>
        </div>
      )}

      {existingLink && (
        <div style={{ marginTop: "8px" }}>
          <h4>Link esistente:</h4>
          <a href={existingLink} target="_blank" rel="noopener noreferrer">
            {existingLink || "Clicca qui per aprire il link esistente"}
          </a>
        </div>
      )}

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
export const ButtonInput = withField(ButtonInputC);
export const UploadSingleFileInput = withField(UploadSingleFIleInputC)
export const UploadMultipleFilesInput = withField(UploadMultipleInputNew)
export const UrlInput = withField(UrlInputC)
