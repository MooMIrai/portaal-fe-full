import * as React from "react";
import { AutoComplete, AutoCompleteProps } from "@progress/kendo-react-dropdowns";

type AutocompleteInputProps = {
    label?: string;
    style?: React.CSSProperties;
} & AutoCompleteProps; 

const AutocompleteInput: React.FC<AutocompleteInputProps> = (props) => {
    const { label, style, data, value, onChange, ...autoCompleteProps } = props;

    return (
        <div>
            {label && <div>{label}</div>}
            <AutoComplete
                data={data}
                value={value}
                onChange={onChange}
                style={style}
                {...autoCompleteProps} 
            />
        </div>
    );
};

export default AutocompleteInput;
