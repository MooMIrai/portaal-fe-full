
export const getFormCandidate = (
    formData: any, 
    type: string
) => {

    const optionalCellulareValidator = (value: any) => {
        if (!value) return true;
        return /^(\+?\d{1,4}\s?\d{7,15}|00\d{1,4}\s?\d{7,15})$/.test(value);

    };

    const fields = {
        firstName: {
            name: "firstName",
            label: "Nome",
            type: "text",
            value: formData?.firstName ,
            required: true,
            disabled: (type === "view"),
            validator: (value: any) => value ? "" : "Il campo Nome è obbligatorio",
        },
        lastName: {
            name: "lastName",
            label: "Cognome",
            type: "text",
            value: formData?.lastName,
            required: true,
            disabled: (type === "view"),
            validator: (value: any) => value ? "" : "Il campo Cognome è obbligatorio",
        },
         birthDate: {
            name: "birthDate",
            label: "Data di nascita",
            type: "date",
            value: formData?.birthDate,
            disabled: (type === "view" ),
        },
        phoneNumber: {
            name: "phoneNumber",
            label: "Numero di Telefono",
            type: "text",
            value: formData?.phoneNumber,
            disabled: (type === "view" ),
            validator: (value: any) =>
                optionalCellulareValidator(value) ? "" : "Il campo Telefono deve essere nel formato +39XXXXXXXXXX o XXXXXXXXXX"
        },
        email: {
            name: "email",
            label: "Email",
            type: "text",
            value: formData?.email || "",
            required: true,
            disabled: (type === "view" ),
            validator:(value:any)=>!value || !value.length ?"Il campo Email è obbligatorio":''
        },
        residenza : {
            name: "residenza",
            label: "Comune di Residenza",
            type: "country",
            disabled: type === "view",
            value: formData?.residenza,
        },
        sede:{
            name: "sede",
            label: "Sede",
            type: "country",
            disabled: (type === "view"),
            value: formData?.sede,
        }, 
        ral: {
            name: "ral",
            label: "Ral attuale",
            type: "number",
            value: formData?.ral,
            disabled: (type === "view")
           
        },
        ralMin: {
            name: "ralMin",
            label: "Ral desiderata da",
            type: "number",
            value: formData?.ralMin,
            disabled: (type === "view")
        },
        ralMax: {
            name: "ralMax",
            label: "Ral desiderata a",
            type: "number",
            value: formData?.ralMax,
            disabled: (type === "view")
           
        },
        notice: {
            name: "notice",
            label: "Preavviso",
            type: "number",
            value: formData?.notice,
            disabled: (type === "view")
           
        },
        note: {
            name: "note",
            label: "Note",
            type: "textarea",
            value: formData?.note,
            disabled: (type === "view")
           
        }
     
    };

    
    return fields;
};
