import React, { useState, useMemo } from "react";
import { TABLE_COLUMN_TYPE, TableColumn } from "../../../models/tableModel";
import { FieldConfig, FieldType } from "../../../models/formModel";
import DynamicForm from "../../DynamicForm/component";
import { CompositeFilterDescriptor, FilterDescriptor } from "@progress/kendo-data-query";
import styles from './style.module.scss';
import CustomButton from "../../Button/component";
import { filterClearIcon, filterIcon } from "@progress/kendo-svg-icons";
import { getAddedFields } from "./customfield";

export function FiltersForm(props: {
    columns: TableColumn[],
    onSubmit: (filters: CompositeFilterDescriptor) => void,
    addedFilters?: FieldConfig[]
}) {
    const [opened, setOpened] = useState<boolean>(false);

    const mapColumnToField = (columns: TableColumn[]): FieldConfig[] => {
        return columns
            .filter(col => col.filter !== undefined && col.type !== TABLE_COLUMN_TYPE.custom)
            .map(col => ({
                name: col.key,
                label: col.label,
                type: mapColumnTypeToFieldType(col.type),
                value: "",
                required: false,
                showLabel: true,
            }));
    };

    const mapColumnTypeToFieldType = (columnType?: TABLE_COLUMN_TYPE): FieldType => {
        switch (columnType) {
            case TABLE_COLUMN_TYPE.date:
            case TABLE_COLUMN_TYPE.datetime:
                return "date";
            case TABLE_COLUMN_TYPE.custom:
                return "text";
            default:
                return "text";
        }
    };

    const mapFormToKendoFilter = (formValues: Record<string, any>): CompositeFilterDescriptor => {
        const filters: FilterDescriptor[] = Object.entries(formValues)
            .filter(([_, value]) => value !== "" && value !== null && value !== undefined)
            .flatMap(([key, value]) => processField(key, value));

        return {
            logic: "and",
            filters
        };
    };

    const processField = (key: string, value: any): FilterDescriptor[] => {
        let field:any = props.columns.find(p=>p.key===key) || props.addedFilters?.find(a=>a.name===key);
        
        let stop= !!field;
        if (!stop && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
            return Object.entries(value).flatMap(([subKey, subValue]) =>
                processField(`${key}.${subKey}`, subValue)
            );
        }
        
        return [{
            field: key,
            value: field?.type==='filter-autocomplete'?field.options.getValue(value):value,
            operator: getOperator(value),
        }];
    };

    const getOperator = (value: any): string => {
        if (typeof value === "string") return "contains";
        if (typeof value === "number") return "eq";
        if (typeof value === "boolean") return "eq";
        if (value instanceof Date || !isNaN(Date.parse(value))) return "eq";
        if (Array.isArray(value)) return "in";
        return "eq";
    };

    let fields:any[] = mapColumnToField(props.columns);

    if (props.addedFilters) {
        fields = [...fields, ...props.addedFilters.map(f=>({...f,type:f.type+'_'+f.name}))];
    }

    const addedField = useMemo(() => {
        return props.addedFilters ? getAddedFields(props.addedFilters) : {};
        
    }, [props.addedFilters]);

    return (
        <>
            <CustomButton 
                className={styles.btn} 
                onClick={() => setOpened(!opened)} 
                themeColor="info" 
                svgIcon={opened ? filterClearIcon : filterIcon} 
                fillMode={'link'} 
            />
            <div className={styles.container + ' ' + (!opened ? styles.closed : '')}>
                <DynamicForm 
                    addedFields={addedField} 
                    fields={fields} 
                    formData={{}} 
                    onSubmit={(data) => props.onSubmit(mapFormToKendoFilter(data))} 
                    submitText={"Cerca"} 
                    showSubmit 
                />
            </div>
        </>
    );
}