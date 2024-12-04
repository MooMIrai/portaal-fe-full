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
        disabled:type === "view" || values.SalState==='BILLING_OK',
        options:{
            disabled:otherSal?otherSal.map(os=>({...os,month:os.month-1})):[]
        }
    },
    {
        name: "money",
        label: "s",
        type: "moneysal-selector",
        value: values,
        required: true,
        showLabel:false,
        disabled:type === "view" || values.SalState==='BILLING_OK',
        options:{
            project,
            sal:values
        }
    },
    {
        name: "billing_date",
        label: "Data Fattura",
        type: "date",
        value: values.Bill?.billing_date,
        required: true,
        disabled:type === "view",
        conditions:(formData)=>formData.SalState==='BILLING_OK',
    },
    {
        name: "billing_number",
        label: "Numero Fattura",
        type: "text",
        value: values.Bill?.billing_number,
        required: true,
        disabled:type === "view",
        conditions:(formData)=>formData.SalState==='BILLING_OK',
    },
    {
        name: "advancePayment",
        label: "Anticipata",
        type: "number",
        value: values.Bill?.advancePayment,
        required: true,
        disabled:type === "view",
        conditions:(formData)=>formData.SalState==='BILLING_OK',
    },
    {
        name: "amountBill",
        label: "Importo Fattura",
        type: "number",
        value: values.Bill?.amount || values.amount,
        required: true,
        disabled:type === "view",
        conditions:(formData)=>formData.SalState==='BILLING_OK',
    },
    {
        name: "notes",
        label: "note",
        type: "textarea",
        value: values.notes || "",
        disabled:type === "view"
    }
]}