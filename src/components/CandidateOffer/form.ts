export const offerForm = [
    {
        name: "date_log",
        label: "Data proposta economica",
        type: "date",
        required:true,
        validator:(value:any)=> {
            
            return value && value instanceof Date ?'':'Il campo Data è obbligatorio'}
    },
    {
        name: "date_start_contract",
        label: "Data inizio contratto",
        type: "date"
    },
    {
        name: "RAL",
        label: "Ral",
        type: "number"
    },
    {
        name: "Transfert",
        label: "Trasferta",
        type: "number"
    },
    {
        name:'notes',
        label:'Note',
        type:'textarea'
    }
]
