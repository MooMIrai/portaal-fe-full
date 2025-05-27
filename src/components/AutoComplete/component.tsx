import * as React from "react";
import { ComboBox, ComboBoxProps } from "@progress/kendo-react-dropdowns";

type AutocompleteInputProps = {
    label?: string;
    style?: React.CSSProperties;
    comboBoxRef: React.MutableRefObject<any>;
} & ComboBoxProps; 

const AutocompleteInput: React.FC<AutocompleteInputProps> = (props) => {
    

    return (<ComboBox
                ref={props.comboBoxRef}
                {...props} 
            />
        
    );
};

export default AutocompleteInput;
