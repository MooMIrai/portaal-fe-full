
export const getFormCandidate = (
    formData: any,
    type: string,
    skillLoading: boolean
) => {

    // Validators

    const createValidator = (isDisabled: boolean, validationFn: (value: any) => string) => {
        return (value: any) => {
            if (isDisabled) return "";
            return validationFn(value);
        };
    };

    const dateValidator = (value: any) => {
        if (!value) return "Il campo Data di Nascita è obbligatorio";
        const selectedDate = new Date(value);
        const currentDate = new Date();
        const adultDate = new Date();
        adultDate.setFullYear(currentDate.getFullYear() - 18);

        if (selectedDate >= currentDate) {
            return "La data di nascita non può essere una data futura o la data di oggi";
        }
        if (selectedDate > adultDate) {
            return "L'età deve essere maggiore di 18 anni";
        }
        return "";
    };

    const optionalCellulareValidator = (value: any) => {
        if (!value) return true;
        return /^(\+?\d{1,4}\s?\d{7,15}|00\d{1,4}\s?\d{7,15})$/.test(value);

    };

    const id_spoken_category_skill =  process.env.SPOKEN_LANGUAGES ? process.env.SPOKEN_LANGUAGES:"116";
    // Colonne tabella

    const fields = {
        firstName: {
            name: "firstName",
            label: "Nome",
            type: "text",
            value: formData?.firstName,
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
            validator: (value: any) => value ? "" : "Il campo Cognome è obbligatorio"
        },
        birthDate: {
            name: "birthDate",
            label: "Data di nascita",
            required: true,
            type: "date",
            value: formData?.birthDate,
            disabled: (type === "view"),
            validator: createValidator(type === "view", dateValidator)
        },
        gender: {
            name: "gender",
            label: "Sesso",
            type: "gender-selector",
            disabled: (type === "view"),
            value: formData.sesso,
            required: true,
            validator: (value: any) => value ? "" : "Il campo sesso è obbligatorio",
        },
        phoneNumber: {
            name: "phoneNumber",
            label: "Numero di Telefono",
            type: "text",
            value: formData?.phoneNumber,
            disabled: (type === "view"),
            validator: (value: any) =>
                optionalCellulareValidator(value) ? "" : "Il campo Telefono deve essere nel formato +39XXXXXXXXXX o XXXXXXXXXX"
        },
        email: {
            name: "email",
            label: "Email",
            type: "text",
            value: formData?.email || "",
            required: true,
            disabled: (type === "view"),
            validator: (value: any) => !value || !value.length ? "Il campo Email è obbligatorio" : ''
        },
        residenza: {
            name: "residenza",
            label: "Comune di Residenza",
            type: "country",
            disabled: type === "view",
            value: formData?.residenza,
        },
        sede: {
            name: "sede",
            label: "Sede",
            type: "location-selector",
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
            label: "Preavviso (giorni)",
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

        },
        profile_autocomplete: {
            name: "profile_autocomplete",
            label: "Profilo",
            type: "profile-selector",
            value: formData.profile_autocomplete || "",
            required: true,
            disabled: (type === "view"),
            //valueOnChange: valueOnChange,
            validator: createValidator(type === "view", (value: any) =>
                value ? "" : "Il campo profilo è obbligatorio"
            ),
        },
        profile_type: {
            name: "profile_type",
            label: "Tipologia profilo",
            type: "textarea",
            value: formData?.profile_type,
            disabled: (type === "view")

        },
        willingToTransfer: {
            name: "willingToTransfer",
            label: "Disposto a trasferirsi",
            type: "checkbox",
            showLabel: false,
            value: formData?.willingToTransfer || false,
            disabled: (type === "view")

        },
        isActivity_104: {
            name: "isActivity_104",
            label: "104",
            type: "checkbox",
            showLabel: false,
            value: formData?.isActivity_104 || false,
            disabled: (type === "view")

        },
        contract_type: {
            name: "contract_type",
            label: "Tipo Contratto Attuale",
            type: "contract_type-selector",
            value: formData.contract_type || "",
            disabled: (type === "view"),
            //valueOnChange: valueOnChange,
        },
        seniority: {
            name: "seniority",
            label: "Seniority",
            type: "seniority-selector",
            showLabel: true,
            require: true,
            value: formData.seniority,
            //options: ["J", "J_A", "M", "M_A", "S", "S_A"],
            //valueOnChange: valueOnChange,
            disabled: type === "view"
        },
        skills: {
            name: "skills",
            label: "Skill",
            type: "skill",
            value: formData.skill || "",
            required: true,
            disabled: (type === "view" || skillLoading),
            options: {
                field: "skillCategory_id",
                operator: "neq", // diverso da
                value: parseInt(id_spoken_category_skill)
            }
        },
        languageSkills: {
            name: "languageSkills",
            label: "Lingue",
            type: "skill",
            value: formData.languageSkill || "",
            required: true,
            disabled: (type === "view" || skillLoading),
            options: {
                field: "skillCategory_id",
                operator: "equals",
                value: parseInt(id_spoken_category_skill) 
            }
        },
    };


    return fields;
};
