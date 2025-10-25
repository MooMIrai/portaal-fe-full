export const contactForm = [
    {
        name: "date_log",
        label: "Data",
        type: "date",
        required:true,
        validator:(value:any)=> {
            
            return value && value instanceof Date ?'':'Il campo Data è obbligatorio'}
    },
    {
        name: "ContactType",
        label: "Tipo Contatto",
        type: "contact-selector",
        required:true,
        validator:(value:any)=> {
            return value && value.id?'':'Il campo Tipo Contatto è obbligatorio'}
    },
    {
        name:'notes',
        label:'Note',
        type:'textarea'
    }
]
