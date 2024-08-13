import * as React from "react";
import { ComboBox, ComboBoxProps } from "@progress/kendo-react-dropdowns";

type AutocompleteInputProps = {
    label?: string;
    style?: React.CSSProperties;
} & ComboBoxProps; 

const AutocompleteInput: React.FC<AutocompleteInputProps> = (props) => {
    const { label } = props;

    return (
        <div>
            {label && <div>{label}</div>}
            <ComboBox
                {...props} 
            />
        </div>
    );
};

export default AutocompleteInput;
