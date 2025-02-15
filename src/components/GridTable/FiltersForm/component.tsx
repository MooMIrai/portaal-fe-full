import React, { useState } from "react";
import { TABLE_COLUMN_TYPE, TableColumn } from "../../../models/tableModel";
import { FieldConfig, FieldType } from "../../../models/formModel";
import DynamicForm from "../../DynamicForm/component";
import { CompositeFilterDescriptor, FilterDescriptor } from "@progress/kendo-data-query";
import styles from './style.module.scss';
import CustomButton from "../../Button/component";
import { filterClearIcon, filterIcon } from "@progress/kendo-svg-icons";

export function FiltersForm(props:{columns:TableColumn[], onSubmit:(filters:CompositeFilterDescriptor)=>void}){

    const [opened,setOpened] = useState<boolean>(false);

    const mapColumnToField = (columns: TableColumn[]): FieldConfig[] => {
       
        return columns
          .filter(col => col.filter !== undefined || col.type!==TABLE_COLUMN_TYPE.custom) // Considera solo colonne con filtro attivo
          .map(col =>{
            return {
                
                name: col.key,
                label: col.label,
                type: mapColumnTypeToFieldType(col.type), // Mappa il tipo della colonna al tipo del campo
                value: "", // Valore iniziale del filtro
                required: false, // Puoi adattarlo se necessario
                showLabel: true, // Per mostrare l'etichetta nel form
            }
        });
      };
      
      // Funzione di mapping tra TABLE_COLUMN_TYPE e FieldType
    const mapColumnTypeToFieldType = (columnType?: TABLE_COLUMN_TYPE): FieldType => {
    switch (columnType) {
        case TABLE_COLUMN_TYPE.date:
        case TABLE_COLUMN_TYPE.datetime:
        return "date";
        case TABLE_COLUMN_TYPE.custom:
        return "text"; // Adatta questo in base alla tua logica
        default:
        return "text"; // Default per colonne di tipo stringa
    }
    };

      
    const mapFormToKendoFilter = (formValues: Record<string, any>): CompositeFilterDescriptor => {
    const filters: FilterDescriptor[] = Object.entries(formValues)
      .filter(([_, value]) => value !== "" && value !== null && value !== undefined) // Filtra campi vuoti
      .flatMap(([key, value]) => processField(key, value)); // Processa ogni campo
  
    return {
      logic: "and", // Cambia in "or" se necessario
      filters
    };
    };
  
    // 🔹 **Funzione per trasformare i valori annidati e determinare il filtro corretto**
    const processField = (key: string, value: any): FilterDescriptor[] => {
        if (typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
        // Se il valore è un oggetto, esplodilo in chiavi annidate
        return Object.entries(value).flatMap(([subKey, subValue]) => 
            processField(`${key}.${subKey}`, subValue)
        );
        }
    
        return [{
        field: key,
        value,
        operator: getOperator(value),
        }];
    };
    
    // 🔹 **Funzione per determinare l'operatore in base al tipo di valore**
    const getOperator = (value: any): string => {
        if (typeof value === "string") return "contains";
        if (typeof value === "number") return "eq";
        if (typeof value === "boolean") return "eq";
        if (value instanceof Date || !isNaN(Date.parse(value))) return "eq";
        if (Array.isArray(value)) return "in";
        return "eq";
    };
    
    return <>
        <CustomButton className={styles.btn} onClick={()=>setOpened(!opened)} themeColor="info" svgIcon={opened?filterClearIcon:filterIcon} fillMode={'link'} />
        <div className={styles.container + ' ' + (!opened?styles.closed:'')}>
            <DynamicForm fields={mapColumnToField(props.columns)} formData={{}} onSubmit={(data)=>{
                props.onSubmit(mapFormToKendoFilter(data))
            }} submitText={"Cerca"} showSubmit/>

        </div>
    </>
}