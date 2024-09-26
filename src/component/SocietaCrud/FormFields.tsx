import { CompanyModel } from "./modelForms";



export const getFormCompanyFields = (
    formData: CompanyModel, 
    type: string, 
    valueOnChange: (name: string, value: any) => void
) => {

    const optionalCellulareValidator = (value: any) => {
        if (!value) return true;
        return /^(\+?\d{1,4}\s?\d{7,15}|00\d{1,4}\s?\d{7,15})$/.test(value);

    };

    const fields = {
        name: {
            name: "name",
            label: "Ragione Sociale",
            type: "text",
            value: formData.name || "",
            required: true,
            disabled: (type === "view"),
            valueOnChange: valueOnChange,
            validator: (value: any) => value ? "" : "Il campo Ragione Sociale è obbligatorio",
        },
        code: {
            name: "code",
            label: "Codice Azienda",
            type: "text",
            value: formData.code || "",
            disabled: (type === "view" ),
            valueOnChange: valueOnChange,
        },
        phoneNumber: {
            name: "phoneNumber",
            label: "Numero di Telefono",
            type: "text",
            value: formData.phoneNumber || "",
            disabled: (type === "view" ),
            valueOnChange: valueOnChange,
            validator: (value: any) =>
                optionalCellulareValidator(value) ? "" : "Il campo Cellulare deve essere nel formato +39XXXXXXXXXX o XXXXXXXXXX"
            
        },
        address: {
            name: "address",
            label: "Indirizzo",
            type: "text",
            value: formData.address || "",
            disabled: (type === "view"),
            valueOnChange: valueOnChange,
           
        },
        sede:{
            name: "sede",
            label: "Sede",
            type: "country",
            valueOnChange: valueOnChange,
            disabled: (type === "view"),
            value: formData.sede,
        },
        zipCode: {
            name: "zipCode",
            label: "CAP",
            type: "text",
            value: formData.zipCode || "",
            disabled: (type === "view"),
            valueOnChange: valueOnChange,
           
        },
        taxCode: {
            name: "taxCode",
            label: "Codice Fiscale",
            type: "text",
            value: formData.taxCode || "",
            disabled: (type === "view"),
            valueOnChange: valueOnChange,
        },
        vatNumber: {
            name: "vatNumber",
            label: "Partita IVA",
            type: "text",
            value: formData.vatNumber || "",
            disabled: (type === "view"),
            valueOnChange: valueOnChange,
           
        },
 
     
    };

    return fields;
};
