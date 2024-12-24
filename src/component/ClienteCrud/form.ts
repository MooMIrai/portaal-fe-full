import { CustomerModel } from "./model";

export const getFormCustomerFields = (formData: CustomerModel, type:string) => {
    
    const onlyLettersValidator = (value: any) => /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(value) ? "" : "Il campo deve contenere solo lettere";
    
    const partitaIVAValidator = (value: any) => /^\d{11}$/.test(value) ? "" : "Il campo deve contenere una partita IVA valida (11 cifre)";

    const optionalTelefonoCasaValidator = (value: any) => {
        if (!value) return true;
        return /^(0\d{1,4}\d{5,9}|\+39\s?0\d{1,4}\d{5,9})$/.test(value);
    };
    const percentageValidator = (value: any) => /^(\d{1,2}(\.\d+)?|100(\.0+)?)(%)?$/.test(value) ? "" : "Il campo deve contenere una percentuale valida (0-100)"
    
    const optional = (value:any,otherValidator) =>{
        if(!value || !value.length) return "";
        return otherValidator(value);
    }
    const emailValidator = (value: any) => {
        if (!value) return "";
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "L'email non è valida";
    };
    const fields = {
        customer_code: {
            name: "customer_code",
            label: "Codice cliente",
            type: "text",
            value: formData.customer_code || "",
            required: true,
            disabled:type === "view",
            validator: (value: any) => value ? "" : "Il campo Codice Cliente è obbligatorio",
        },
        name: {
            name: "name",
            label: "Ragione sociale",
            type: "text",
            value: formData.name || "",
            required: true,
            disabled:type === "view",
            validator: (value: any) => value ? "" : "Il campo Ragione Sociale è obbligatorio",
        },
        vatNumber: {
            name: "vatNumber",
            label: "Partita Iva",
            type: "number",
            value: formData.vatNumber || "",
            validator: (value: any) => optional(value,partitaIVAValidator),
        },
        web_site: {
            name: "web_site",
            label: "Sito web",
            type: "text",
            value: formData.web_site || "",
            disabled:type === "view",
        },
        email: {
            name: "email",
            label: "Email",
            type: "email",
            showLabel: false,
            disabled:type === "view",
            value: formData.email || "",
            validator: (value: any) => optional(value, emailValidator),
        },
        phone: {
            name: "phone",
            label: "Telefono",
            type: "text",
            disabled:type === 'view',
            value: formData.phone || "",
            validator: (value: any) => optional(value,optionalTelefonoCasaValidator),
        },
        fax:{
            name:"fax",
            label:"Fax",
            type:"text",
            disabled:type === "view",
            value: formData.fax || "",
            validator: (value: any) => optional(value,optionalTelefonoCasaValidator),
        },
        address: {
            name: "address",
            label: "indirizzo",
            type: "text",
            disabled:type === "view",
            value: formData.address || "",
            validator: (value: any) => optional(value,onlyLettersValidator),
        },
        city: {
            name: "city",
            label: "Comune",
            type: "text",
            disabled:type === "view",
            value: formData.city || "",
            validator: (value: any) => optional(value,onlyLettersValidator),
        },
        discountPerc: {
            name: "discountPerc",
            label: "Percentuale sconto",
            type: "number",
            disabled:type === "view",
            value: formData.discountPerc || "",
            validator: (value: any) => optional(value,percentageValidator),
        }
    }
    return fields

};