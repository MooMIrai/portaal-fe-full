

export const getFormDeviceFields = (formData: any, type:string) => {
    
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
        model: {
            name: "model",
            label: "Modello",
            type: "text",
            value: formData.model || "",
            required: true,
            disabled:type === "view",
            validator: (value: any) => value ? "" : "Il campo modello è obbligatorio",
        },
        DeviceType: {
            name: "DeviceType",
            label: "Tipo dispositivo",
            type: "devicetype-selector",
            value: formData.DeviceType,
            required: true,
            disabled: type === "view",
            validator: (value: any) => (value ? "" : "Selezionare un tipo dispositivo")
        },
        serial_number: {
            name: "serial_number",
            label: "Numero Seriale",
            type: "text",
            value: formData.name || "",
            disabled:type === "view",
        },
        billing_number: {
            name: "billing_number",
            label: "Numero Fattura",
            type: "text",
            value: formData.billing_number || ""
        },
        files: {
            name: "files",
            label: "Carica Fattura",
            type: "uploadSingleFile",
            withCredentials: false,
            disabled: type === "view",
            value: formData.files || "",
            existingFile:formData.files && formData.files.length?[{name:'Fattura.pdf'}]:undefined,
            accept: ".pdf",
            multiple: false,
        },
    }
    return fields

};