
export const getFormCandidate = (
    formData: any,
    type: string,
    skillLoading: boolean,
    cvLoading:boolean,
    aiFile?:FileList
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

    const spoken_category_skill =  process.env.SPOKEN_LANGUAGES ? process.env.SPOKEN_LANGUAGES : "";
    // Colonne tabella
    const fields = {
        files: {
            name: "files",
            label: "Carica Cv",
            type: "uploadSingleFile",
            withCredentials: false,
            disabled: type === "view",
            value: formData.files || "",
            existingFile:formData.files && formData.files.length?formData.files.map(f=>({name:f.file_name,id:f.uniqueIdentifier}))
                :undefined,
            //accept: ".pdf",
            options:aiFile,
            multiple: false,
        },
        firstName: {
            name: "firstName",
            label: "Nome",
            type: "text",
            value: formData?.firstName,
            required: true,
            disabled: (type === "view" || cvLoading),
            validator: (value: any) => value ? "" : "Il campo Nome è obbligatorio",
        },
        lastName: {
            name: "lastName",
            label: "Cognome",
            type: "text",
            value: formData?.lastName,
            required: true,
            disabled: (type === "view" || cvLoading),
            validator: (value: any) => value ? "" : "Il campo Cognome è obbligatorio"
        },
        birthDate: {
            name: "birthDate",
            label: "Data di nascita",
            required: true,
            type: "date",
            value: formData?.birthDate,
            disabled: (type === "view" || cvLoading),
            validator: createValidator(type === "view", dateValidator)
        },
        gender: {
            name: "gender",
            label: "Sesso",
            type: "gender-selector",
            disabled: (type === "view" || cvLoading),
            value: formData.sesso,
            required: true,
            validator: (value: any) => value ? "" : "Il campo Sesso è obbligatorio",
        },
        phoneNumber: {
            name: "phoneNumber",
            label: "Numero di Telefono",
            type: "text",
            value: formData?.phoneNumber,
            disabled: (type === "view" || cvLoading),
            validator: (value: any) =>
                optionalCellulareValidator(value) ? "" : "Il campo Telefono deve essere nel formato +39XXXXXXXXXX o XXXXXXXXXX"
        },
        email: {
            name: "email",
            label: "Email",
            type: "text",
            value: formData?.email || "",
            required: true,
            disabled: (type === "view" || cvLoading),
            validator: (value: any) => !value || !value.length ? "Il campo Email è obbligatorio" : ''
        },
        residenza: {
            name: "residenza",
            label: "Comune di Residenza",
            type: "country",
            disabled: (type === "view" || cvLoading),
            value: formData?.residenza,
        },
        sede: {
            name: "sede",
            label: "Sede",
            type: "location-selector",
            disabled: (type === "view"),
            value: formData?.sede,
            required:true,
            validator: (value: any) => !value || !value.id ? "Il campo Sede è obbligatorio" : ''
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
            disabled: (type === "view" || cvLoading),

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
                value ? "" : "Il campo Profilo è obbligatorio"
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
            required: true,
            validator: (value: any) => value ? "" : "Il campo Seniority è obbligatorio",
            value: formData.seniority,
            disabled: (type === "view" || skillLoading),
        },
        skills: {
            name: "skills",
            label: "Skill",
            type: "skill",
            value: formData.skill || "",
            required: true,
            validator: (value: any) =>  value ? "" : "Il campo Skill è obbligatorio",
            disabled: (type === "view" || skillLoading),
            options: {
                field: "skillCategory.category",
                operator: "neq", // diverso da
                value: spoken_category_skill
            }
        },
        languageSkills: {
            name: "languageSkills",
            label: "Lingue",
            type: "skill",
            value: formData.languageSkill || "",
            required: false,
            disabled: (type === "view" || skillLoading),
            options: {
                field: "skillCategory.category",
                operator: "equals",
                value: spoken_category_skill
            }
        },
    };


    return fields;
};
