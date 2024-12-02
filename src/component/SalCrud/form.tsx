import withField from "common/hoc/Field";
import YearMonthPicker from "common/YearMonthPicker";
import React from "react";
import { MoneyInputSal } from "./MoneyInput";


function YearMonthSalField(props){
    return <YearMonthPicker {...props} />
}

export const customFieldsSal = {
    "yearmonthsal-selector":withField(YearMonthSalField),
    "moneysal-selector":withField(MoneyInputSal),
}


export const getFormFields=(values,onChange,type,project,otherSal?)=>{

    return [
    {
        name: "monthyear",
        label: "Mese/Anno",
        type: "yearmonthsal-selector",
        //value: getDateFromData(values.year,values.month),
        valueOnChange:onChange,
        required: true,
        disabled:type === "view",
        options:{
            disabled:otherSal.map(os=>({...os,month:os.month-1}))
        }
    },
    {
        name: "money",
        label: "s",
        type: "moneysal-selector",
        value: values,
        required: true,
        showLabel:false,
        disabled:type === "view",
        options:{
            project,
            sal:values
        }
    },
    {
        name: "notes",
        label: "note",
        type: "textarea",
        value: values.notes || "",
        disabled:type === "view"
    }
]}