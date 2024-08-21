import { Error, Label } from '@progress/kendo-react-labels';
import React, { useEffect } from 'react';

const withField = (WrappedComponent:any) => {
  const WithField = (props:any) => {
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
        <Label id={others.id}>
          {others.label} {others.required?<span style={{color:'red',fontSize:20}}>*</span>:''}
        </Label>
        <WrappedComponent onChange={onChange}  value={value} {...others}/>
        {
            // Display an error message after the "visited" or "touched" field is set to true.
            visited && validationMessage && <Error>{validationMessage}</Error>
        }
      </div>
  };

  
  return WithField;
};

export default withField;