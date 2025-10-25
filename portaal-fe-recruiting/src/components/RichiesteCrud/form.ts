
export const getFormRichiesta = (
    formData: any,
    type: string,
    primarySkillSelected: number[],
    setPrimarySkill: any,
    secondarySkillSelected: number[],
    setSecondarySkill: any
) => {


    const optionalCellulareValidator = (value: any) => {
        if (!value) return true;
        return /^(\+?\d{1,4}\s?\d{7,15}|00\d{1,4}\s?\d{7,15})$/.test(value);

    };

    const spoken_category_skill =  process.env.SPOKEN_LANGUAGES ? process.env.SPOKEN_LANGUAGES : "";

    const fields = {
        ReferrerHr: {
            name: "ReferrerHr",
            label: "HR di riferimento",
            type: "hr-selector",
            value: formData.Hr,
            required: true,
            validator: (value: any) => value ? "" : "Il campo HR di riferimento è obbligatorio",
            disabled: type === "view"
        },
        RequestState: {
            name: "RequestState",
            label: "Stato della Richiesta",
            type: "status-selector",
            value: formData.RequestState || "",
            required: true,
            validator: (value: any) => value ? "" : "Il campo Stato della Richiesta è obbligatorio",
            disabled: type === "view"
        },
        Priority: {
            name: "Priority",
            label: "Priorità",
            type: "priority-selector",
            value: formData.Priority || "",
            required: true,
            validator: (value: any) => value ? "" : "Il campo Priorità è obbligatorio",
            disabled: type === "view"
        },
        Customer: {
            name: "Customer",
            label: "Cliente",
            type: "customer-selector",
            value: formData.Customer || "",
            required: true,
            validator: (value: any) => value ? "" : "Il campo Cliente è obbligatorio",
            disabled: type === "view"
        },
        /* Campo non creato, eventualmente si recupera dal cliente
        customerReferer: {
             name: "customerReferer",
             label: "Referente Cliente",
             type: "text",
             value: formData.CustomerReferer || "",
             required: false,
             disabled: type === "view"
         }, */
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
            required: true,
            validator: (value: any) => value ? "" : "Il campo Sede di riferimento è obbligatorio",
            disabled: type === "view"
        },
        WorkModel: {
            name: "WorkModel",
            label: "Tipologia di Lavoro",
            type: "workModel-selector",
            value: formData.WorkModel || "",
            required: true,
            validator: (value: any) => value ? "" : "Il campo Ambito lavorativo è obbligatorio",
            disabled: type === "view"
        },
        Profile: {
            name: "Profile",
            label: "Profilo",
            type: "profile-selector",
            value: formData.Profile || "",
            required: true,
            validator: (value: any) => value ? "" : "Il campo Profilo è obbligatorio",
            disabled: type === "view"
        },
        profileType: {
            name: "profileType",
            label: "Tipologia Profilo",
            type: "text",
            value: formData.profileType || "",
            required: false,
            disabled: type === "view"
        },
        Seniority: {
            name: "Seniority",
            label: "Seniority",
            type: "seniority-selector",
            value: formData.Seniority || "",
            required: true,
            validator: (value: any) => value ? "" : "Il campo Seniority è obbligatorio",
            disabled: type === "view"
        },
        PrimarySkill: {
            name: "PrimarySkill",
            label: "Skill primarie",
            type: "skill",
            value: formData.PrimarySkill || "",
            valueOnChange: (name: string, value: any) => setPrimarySkill(value ? value.map((x: any) => x.id) : []),
            required: true,
            validator: (value: any) => value ? "" : "Il campo Skill primarie è obbligatorio",
            disabled: type === "view",
            options: {
                field: "skillCategory.category",
                operator: "neq", // diverso da
                value: spoken_category_skill,
                disabledArray: secondarySkillSelected
            }
        },
        SecondarySkill: {
            name: "SecondarySkill",
            label: "Skill secondarie",
            type: "skill",
            value: formData.SecondarySkill || "",
            //valueOnInit: (name: string, value: any) => setPrimarySkill(value ? value.map((x: any) => x.id) : []),
            valueOnChange: (name: string, value: any) => setSecondarySkill(value ? value.map((x: any) => x.id) : []),
            required: false,
            disabled: type === "view",
            options: {
                field: "skillCategory.category",
                operator: "neq", // diverso da
                value: spoken_category_skill,
                disabledArray: primarySkillSelected
            }
        },
        LanguagesSkill: {
            name: "LanguagesSkill",
            label: "Skill linguistiche",
            type: "skill",
            value: formData.LanguagesSkill || "",
            required: false,
            disabled: type === "view",
            options: {
                field: "skillCategory.category",
                operator: "equals",
                value: spoken_category_skill
            }
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
            showLabel: false,
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
