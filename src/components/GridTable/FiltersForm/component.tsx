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
    refreshTable: () => Promise<void>,
    addedFilters?: FieldConfig[],
    openFilterDefault?: boolean,
    filterInitialValues?: Record<string, any>,
    formStyle?: React.CSSProperties,
    extraButtonsRight?: Array<{component: JSX.Element, refreshTable?: boolean}>
}) {
    const [opened, setOpened] = useState<boolean>(!!props.openFilterDefault);

    const mapColumnToField = (columns: TableColumn[]): FieldConfig[] => {

        const ret:FieldConfig[] = [];

        columns
        .filter(col => col.filter !== undefined && col.type !== TABLE_COLUMN_TYPE.custom)
        .forEach(col => {

            const filterType = mapColumnTypeToFieldType(col.type);

            if(filterType == 'date') {

                ret.push({
                    name: col.key+'&start',
                    label: col.label + ' Da',
                    type: filterType,
                    value: "",
                    required: false,
                    monthOnly: col.monthOnly,
                    showLabel: col.type != TABLE_COLUMN_TYPE.boolean,
                });

                ret.push({
                    name: col.key+'&end',
                    label: col.label + ' A',
                    type: filterType,
                    value: "",
                    required: false,
                    monthOnly: col.monthOnly,
                    showLabel: col.type != TABLE_COLUMN_TYPE.boolean,
                });

            }
            
            else{
                ret.push({
                    name: col.key,
                    label: col.label,
                    type: filterType,
                    value: "",
                    required: false,
                    showLabel: col.type != TABLE_COLUMN_TYPE.boolean,
                });
            }      
        });

        return ret;
    };

    const mapColumnTypeToFieldType = (columnType?: TABLE_COLUMN_TYPE): FieldType => {
        switch (columnType) {
            case TABLE_COLUMN_TYPE.date:
            case TABLE_COLUMN_TYPE.datetime:
                return "date";
            case TABLE_COLUMN_TYPE.custom:
                return "text";
            case TABLE_COLUMN_TYPE.number:
                return "number"
            case TABLE_COLUMN_TYPE.boolean:
                return "checkbox"
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

    const formatLocalISODateTime = (date: Date): string => {
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        const day = `${date.getDate()}`.padStart(2, '0');
        const hours = `${date.getHours()}`.padStart(2, '0');
        const minutes = `${date.getMinutes()}`.padStart(2, '0');
        const seconds = `${date.getSeconds()}`.padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
    }
    

    const processField = (key: string, value: any): FilterDescriptor[] => {
        let fieldKey =  key.split('&')[0];
        let field:any = props.columns.find(p=>p.key===fieldKey) || props.addedFilters?.find(a=>a.name===fieldKey);
        
        let stop= !!field;
        if (!stop && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
            return Object.entries(value).flatMap(([subKey, subValue]) =>
                processField(`${fieldKey}.${subKey}`, subValue)
            );
        }

        let v = value;
        

        let operator = getOperator(value,field?.type);
        if(field){
            if(field.type==='number' && v){
                v=parseFloat(v);
            }
            

        if(field.type==='date'){
            
            if(key.indexOf('&start')>=0){
                
                operator='gte';
                if(value instanceof Date){
                    const tempD=new Date(value);
                    tempD.setHours(0);
                    tempD.setMinutes(0);
                    tempD.setSeconds(0);
                    tempD.setMilliseconds(0);
                    v= formatLocalISODateTime(tempD)
                }
            }else if(key.indexOf('&end')>=0){
                
                operator='lte';
                if(value instanceof Date){
                    const tempD=new Date(value);
                    tempD.setHours(23);
                    tempD.setMinutes(59);
                    tempD.setSeconds(59);
                    tempD.setMilliseconds(9);
                    v= formatLocalISODateTime(tempD)
                }
            }else{
                operator='eq';
            }
        }
    }
        
        return [{
            field: fieldKey,
            value: field?.type==='filter-autocomplete'?field.options.getValue(value):v,
            operator:  operator
        }];
    };

    const getOperator = (value: any,type:string): string => {
        
        if (typeof value === "number" || type===TABLE_COLUMN_TYPE.number) return "eq";
        if (typeof value === "string") return "contains";
        if (typeof value === "boolean") return "eq";
        if (value instanceof Date || !isNaN(Date.parse(value))) return "eq";
        if (Array.isArray(value)) return "in";
        return "eq";
    };

    const getCustomFilter = (f: any) => {
        if (!f.type.includes('filter-autocomplete')) return f;
        else return {...f, type: f.type + "_" + f.name};
    };

    let fields: any[] = mapColumnToField(props.columns);

    if (props.addedFilters) {

        const withIndex = props.addedFilters.filter(filter => filter.indexPosition === 0 || filter.indexPosition);
        const noIndex = props.addedFilters.filter(filter => filter.indexPosition !== 0 && !filter.indexPosition);
        withIndex.forEach(filter => fields.splice(filter.indexPosition!, 0, getCustomFilter(filter)));

        fields = [...fields, ...noIndex.map(getCustomFilter)];
    }

    const addedField = useMemo(() => {
        return props.addedFilters ? getAddedFields(props.addedFilters) : {};
        
    }, []);
    

    return (
        <>
            <div className={styles.btn} >
                {props.extraButtonsRight?.map(button => {
                    if (button.refreshTable) return <div onChange={props.refreshTable}>{button.component}</div>
                    return <div>{button.component}</div>;
                })}
                <CustomButton
                    onClick={() => setOpened(!opened)} 
                    themeColor="info" 
                    svgIcon={opened ? filterClearIcon : filterIcon} 
                    fillMode={'link'} 
                />
            </div>
            <div className={styles.container + ' ' + (!opened ? styles.closed : '')}>
                <DynamicForm 
                    addedFields={addedField} 
                    fields={fields} 
                    formData={props.filterInitialValues || {}}
                    onSubmit={(data) => props.onSubmit(mapFormToKendoFilter(data))} 
                    submitText={"Cerca"} 
                    style={props.formStyle}
                    showSubmit 
                    noDisableOnTouched
                    showCancel
                />
            </div>
        </>
    );
}