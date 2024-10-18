import * as React from 'react';
import { NumericTextBox } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { GridFilterCellProps } from '@progress/kendo-react-grid';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { filterClearIcon, filterIcon } from '@progress/kendo-svg-icons';
import styles from "./styles.module.scss"
import { SvgIcon } from '@progress/kendo-react-common';
interface HoursDaysFilterCellProps extends GridFilterCellProps {}

const operators = [
  { text: "Is equal to", operator: "eq" },
  { text: "Is not equal to", operator: "neq" },
  { text: "Is greater than or equal to", operator: "gte" },
  { text: "Is greater than", operator: "gt" },
  { text: "Is less than or equal to", operator: "lte" },
  { text: "Is less than", operator: "lt" },
];

const HoursDaysFilterCell: React.FC<HoursDaysFilterCellProps> = (props) => {
    const [days, setDays] = React.useState<number | null>(null);
    const [hours, setHours] = React.useState<number | null>(null);
    const [selectedOperator, setSelectedOperator] = React.useState<string>(''); 


    const totalHours = () => {
        return (days || 0) * 8 + (hours || 0);
    };

    const applyFilter = (event: any, operator: string) => {
        const value = totalHours();
        props.onChange({
            value: value > 0 ? value : '',
            operator: operator,
            syntheticEvent: event,
        });
    };


    const onOperatorChange = (event: any) => {
        setSelectedOperator(event.value.operator);
        applyFilter(event.syntheticEvent, event.value.operator); 
    };


    const onClearButtonClick = (event: any) => {
        event.preventDefault();
        setDays(null);
        setHours(null);
        props.onChange({
            value: '',
            operator: '',
            syntheticEvent: event,
        });
    };


    const valueRender = (element: any, value: any) => {
        return (
            <span className={styles.iconWrapper}>
                <SvgIcon icon={filterIcon} />
            </span>
        );
    };

    return (
        <div className={styles.filterCell}>
        <div className={styles.filterContainer}>
            <NumericTextBox
                value={days}
                onChange={(e) => setDays(e.value)}
                placeholder="Giorni"
                className={styles.inputBox}
            />
            <NumericTextBox
                value={hours}
                onChange={(e) => setHours(e.value)}
                placeholder="Ore"
                className={styles.inputBox}
            />
            <DropDownList
                data={operators}
                textField="text"
                valueRender={valueRender} 
                value={operators.find(op => op.operator === selectedOperator)}
                onChange={onOperatorChange}
                className={styles.dropDown}
                popupSettings={{ className: styles.customPopup }} 
            />
            <Button
                title="Clear"
                disabled={!days && !hours}
                onClick={onClearButtonClick}
                svgIcon={filterClearIcon}
                className={styles.clearButton}
            />
        </div>
    </div>
);
};
export default HoursDaysFilterCell;
