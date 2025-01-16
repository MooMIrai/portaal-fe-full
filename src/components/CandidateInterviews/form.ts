export const InterviewForm=[
    {
        name: "date_log",
        label: "Data",
        type: "date",
        required:true,
        validator:(value:any)=> {
            return value && value instanceof Date?'':'Il campo Data è obbligatorio'}
    },
    {
        name: "InterviewType",
        label: "Tipo",
        type: "type-selector",
        required:true,
        validator:(value:any)=> {
            return value && value.id?'':'Il campo Tipo è obbligatorio'}
    },
    {
        name: "InterviewEvaluationType",
        label: "Tipo Valutazione",
        type: "evaluationtype-selector",
        required:true,
        validator:(value:any)=> {
            return value && value.id?'':'Il campo Tipo Valutazione è obbligatorio'}
    },
    {
        name: "isExternal",
        label: "Colloquio gestito dal cliente",
        type: "checkbox",
        showLabel:false,
        //required:true
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