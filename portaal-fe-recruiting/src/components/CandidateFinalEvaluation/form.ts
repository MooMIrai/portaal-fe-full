export const finalEvaluationForm = [
    {
        name: "date_log",
        label: "Data valutazione finale",
        type: "date",
        required: true,
        validator:(value:any)=> value && value instanceof Date ? '' : 'Il campo Data è obbligatorio'
    },
    {
        name: "ContactType",
        label: "Tipo Contatto",
        type: "contact-selector",
        required: true,
        validator:(value:any)=> value && value.id ? '' : 'Il campo Tipo Contatto è obbligatorio'
    },
    {
        name: "OutComeType",
        label: "Esito",
        type: "outcome-selector",
        required: true,
        validator:(value:any) => value && value.id ? '' : 'Il campo Esito è obbligatorio'
    },
    {
        name:'notes',
        label:'Note',
        type:'textarea'
    }
]
