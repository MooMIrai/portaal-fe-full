import { OfferModel } from "./model";

export const getFormOfferFields = (formData: OfferModel, type:string) => {
    
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


    const fields = {
        accountManager: {
            name: "accountManager",
            label: "Commerciale di riferimento",
            type: "commerciale-selector",
            value: formData.accountManager,
            required: true,
            disabled:type === "view",
            validator: (value: any) => value ? "" : "Selezionare un Commerciale valido"
        },
        year:{
            name: "year",
            label: "Anno di riferimento",
            type: "year",
            value: formData.end_date,
            required: true,
            disabled:type === "view",
            validator: (value: any) => value ? "" : "Selezionare un anno valido"
        },
        customer: {
            name: "customer",
            label: "Cliente",
            type: "customer-selector",
            value: formData.customer,
            required: true,
            disabled:type === "view",
            validator: (value: any) => value ? "" : "Selezionare un Cliente valido"
        },
        protocol: {
            name: "project_code",
            label: "Protocollo",
            type: "text",
            value: formData.protocol,
            required: true,
            disabled:type === "view",
            validator: (value: any) => value ? "" : "Il campo Protocollo è obbligatorio"
        },
        title: {
            name: "title",
            label: "Titolo",
            type: "text",
            value: formData.title,
            required: true,
            disabled:type === "view",
            validator: (value: any) => value ? "" : "Il campo Titolo è obbligatorio"
        },
        creation_date: {
            name: "creation_date",
            label: "Data creazione",
            type: "date",
            value: formData.creation_date,
            required: true,
            disabled:type === "view",
            validator: (value: any) => value ? "" : "Il campo Data creazione è obbligatorio"
        },
        
    }
    return fields

};