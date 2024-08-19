import React from "react";
import ClienteSelector from './component'

function ClienteSelectorField(props:any){
    const {
        // The meta props of the Field.
        validationMessage,
        touched,
        visited,
        modified,
        valid,
        // The input props of the Field.
        value,
        onChange,
        onFocus,
        onBlur,
        // The custom props that you passed to the Field.
        ...others
      } = props;
      

      return <div onFocus={onFocus} onBlur={onBlur}>
        <label className={"k-checkbox-label"} htmlFor={others.id}>
          {others.label}
        </label>
        <ClienteSelector onChange={onChange}  value={value} {...others}/>
        {
            // Display an error message after the "visited" or "touched" field is set to true.
            visited && validationMessage && <div role="alert" className="k-form-error k-text-start">{validationMessage}</div>
        }
      </div>
}

export const clienteFormField = {"customer-selector":ClienteSelectorField}