export const MessageBodyForm=[
    {
        name: "isEmail",
        label: "Vuoi inviare una copia per email?",
        type: "checkbox",
        showLabel:false
    },
    {
        name: "attachments",
        label: "Carica Allegato (Solo email)",
        type: "uploadSingleFile",
        withCredentials: false,
        existingFile:undefined,
        conditions:(fd)=>fd.isEmail,
        multiple: false,
    },
    {
        name: "title",
        label: "Titolo",
        type: "text",
        required: true,
        //disabled: (type === "view"),
        //valueOnChange: valueOnChange,
        validator: (value: any) => value ? "" : "Il campo Titolo è obbligatorio",
    },
    {
        name: "sub_title",
        label: "Sottotitolo",
        type: "text",
        required: true,
        //disabled: (type === "view"),
        //valueOnChange: valueOnChange,
        validator: (value: any) => value ? "" : "Il campo Sottotitolo è obbligatorio",
    },
    {
        name: "text",
        label: "Corpo del messaggio",
        type: "message_body",
        required: true,
        //disabled: (type === "view"),
        //valueOnChange: valueOnChange,
        validator: (value: any) => {
            let cleaned:string='';
            if(value){
                cleaned=value.replace(/<[^>]+>/g, '')   // Remove HTML tags
                .replace(/&nbsp;/g, '')    // Remove &nbsp;
                .replace(/\s/g, '');
            }
        

            if(!cleaned || !cleaned.length)
                return  "Il campo Corpo del messaggio è obbligatorio";
            return ''
        },
    }
]