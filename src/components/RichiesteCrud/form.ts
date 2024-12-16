
export const getFormRichiesta = (
    formData: any, 
    type: string
) => {

    
    const optionalCellulareValidator = (value: any) => {
        if (!value) return true;
        return /^(\+?\d{1,4}\s?\d{7,15}|00\d{1,4}\s?\d{7,15})$/.test(value);

    };

    const fields = {
        ReferrerHr: {
            name: "ReferrerHr",
            label: "HR di riferimento",
            type: "hr-selector",
            value: {id:0,name:"Seleziona un dipendente"},
            required: true,
            disabled: type === "view"
        },
        RequestState: {
            name: "RequestState",
            label: "Stato della Richiesta",
            type: "status-selector",
            value: formData.RequestState || "",
            required: true,
            disabled: type === "view"
          },
        Priority: {
            name: "Priority",
            label: "Priorità",
            type: "priority-selector",
            value: formData.Priority || "",
            required: false,
            disabled: type === "view"
        },
        Customer: {
            name: "Customer",
            label: "Cliente",
            type: "customer-selector",
            value: formData.Customer || "",
            required: true,
            disabled: type === "view"
        },
        CustomerReferer: {
            name: "CustomerReferer",
            label: "Referente Cliente",
            type: "text",
            value: formData.CustomerReferer || "",
            required: false,
            disabled: type === "view"
        },
        ref_code: {
            name: "ref_code",
            label: "Codice di Riferimento",
            type: "text",
            value: formData.ref_code || "",
            required: false,
            disabled: type === "view" 
        },
        id_code: {
            name: "id_code",
            label: "Codice Identificativo",
            type: "text",
            value: formData.id_code || "",
            required: false,
            disabled: type === "view" 
        },
        Location: {
            name: "Location",
            label: "Sede di riferimento",
            type: "location-selector",
            value: formData.Location || "",
            required: false,
            disabled: type === "view"
        }
        /* ,
        WorkModel: {
            name: "WorkModel",
            label: "Ambito lavorativo",
            type: "select",
            options: ["R", "S", "H"],
            value: formData.WorkModel || "",
            required: true,
            showLabel:false,
            disabled: type === "view"
        } */,
        Profile: {
            name: "Profile",
            label: "Profilo",
            type: "profile-selector",
            value: formData.Profile || "",
            required: true,
            disabled: type === "view"
        },
        Seniority: {
            name: "Seniority",
            label: "Seniority",
            type: "seniority-selector",
            value: formData.Seniority || "",
            required: true,
            disabled: type === "view"
        },
        PrimarySkill: {
            name: "PrimarySkill",
            label: "Skill primarie",
            type: "skill",
            value: formData.Seniority || "",
            required: true,
            disabled: type === "view"
        },
        SecondarySkill: {
            name: "SecondarySkill",
            label: "Skill secondarie",
            type: "skill",
            value: formData.Seniority || "",
            required: false,
            disabled: type === "view"
        },
        saleRate: {
            name: "saleRate",
            label: "Tariffa di Vendita",
            type: "number",
            value: formData.saleRate || "",
            required: false,
            disabled: type === "view"
        },
        continuative: {
            name: "continuative",
            label: "Continuativo",
            type: "checkbox",
            value: formData.continuative || false,
            required: false,
            showLabel:false,
            disabled: type === "view"
        },
        notes: {
            name: "notes",
            label: "Note",
            type: "textarea",
            value: formData.notes || "",
            required: false,
            disabled: type === "view"
        }
    };

    
    return fields;
};
