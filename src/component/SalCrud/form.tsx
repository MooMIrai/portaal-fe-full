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


function requiredValidator (name: string, value: any, validator?: (value: any) => string) {
    if (!value && value !== 0) return `Il campo ${name} è obbligatorio.`;
    else if (validator) validator(value);
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
        disabled:type === "view" || values.SalState==='BILLING_OK' || values.SalState==='BILLED',
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
        disabled:type === "view" || values.SalState==='BILLING_OK' || values.SalState==='BILLED',
        options:{
            project,
            sal:values
        }
    },
    {
        name:  values.SalState ==='BILLING_OK' ? "amount" : "amountBill",
        label: "Importo Fattura",
        type: "number",
        value: values.SalState ==='BILLING_OK' ? values.amount : values.amountBill,
        required: true,
        disabled:type === "view",
        conditions:(formData)=>formData.SalState==='BILLING_OK' || formData.SalState === 'BILLED',
        validator: (value: any) => requiredValidator("Importo Fattura", value)
    },
    {
        name: "billing_date",
        label: "Data Fattura",
        type: "date",
        value: values.billing_date,
        required: true,
        disabled:type === "view",
        conditions:(formData)=>formData.SalState==='BILLING_OK' || formData.SalState === 'BILLED',
        validator: (value: any) => requiredValidator("Data Fattura", value)
    },
    {
        name: "billing_number",
        label: "Numero Fattura",
        type: "text",
        value: values.billing_number,
        required: true,
        disabled:type === "view",
        conditions:(formData)=>formData.SalState==='BILLING_OK' || formData.SalState === 'BILLED',
        validator: (value: any) => requiredValidator("Numero Fattura", value)
    },
    {
        name: "baf_number",
        label: "Numero BAF",
        type: "text",
        value: values.baf_number,
        disabled:type === "view",
        conditions:(formData)=>formData.SalState==='BILLING_OK' || formData.SalState === 'BILLED',
    },
    {
        name: "billToPerson",
        label: "Acronimi",
        type: "text",
        value: values.billToPerson,
        required: false,
        disabled: true,
        conditions:(formData)=> formData.SalState === 'BILLED'
    },
    {
        name: "advancePayment",
        label: "Anticipata",
        type: "text",
        value: values.advancePayment,
        required: false,
        disabled:type === "view",
        conditions:(formData)=>formData.SalState==='BILLING_OK' || formData.SalState === 'BILLED',
    },
    {
        name: "notes",
        label: "Note",
        type: "textarea",
        value: values.notes || "",
        disabled:type === "view"
    }
]}