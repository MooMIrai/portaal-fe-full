export const sendCvForm = [
    {
        name: "date_log",
        label: "Data",
        type: "date",
        required:true,
        validator:(value:any)=> {
            
            return value && value instanceof Date ?'':'Il campo Data è obbligatorio'}
    },
    {
        name: "OutComeType",
        label: "Esito",
        type: "outcome-selector",
        required:true,
        validator:(value:any)=> {
            return value && value.id?'':'Il campo Esito è obbligatorio'}
    },
    {
        name:'notes',
        label:'Note',
        type:'textarea'
    }
]
