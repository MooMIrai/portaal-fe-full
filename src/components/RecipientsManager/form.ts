export const MessageRecipientForm=[
    {
        name: "isAll",
        label: "",
        type: "selectall-selector",
        required: false
    },
    {
        name: "to",
        label: "Destinatari",
        type: "person_selector",
        required: true,
        conditions: (formData) => !formData.isAll,
        validator: (value: any) =>{
            if(!value || !value.length)
                return 'Il campo Destinatari è obbligatorio'
            return '';
        }
    },
    {
        name: "cc",
        label: "Copia Carbone",
        type: "person_selector",
        required: false,
        conditions: (formData) => !formData.isAll,
        validator: (value: any) =>{
            if(!value || !value.length)
                return 'Il campo Copia Carbone è obbligatorio'
            return '';
        }
    },
    {
        name: "bcc",
        label: "Copia Carbone Nascosta",
        type: "person_selector",
        required: false,
        conditions: (formData) => {
            return !formData.isAll},
        validator: (value: any) =>{
            if(!value || !value.length)
                return 'Il campo Copia Carbone nascosta è obbligatorio'
            return '';
        }
    }
]