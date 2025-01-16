import withField from "common/hoc/Field";
import withAutoComplete from "common/hoc/AutoComplete";

const getOutcome = (filterP: string) => {
    return Promise.resolve([
        {
            id:'P',
            name:'Positivo'
        },
        {
            id:'N',
            name:'Negativo'
        },
        {
            id:'R',
            name:'Rimandato'
        },
        {
            id:'A',
            name:'Annullato'
        },
    ].filter(p=>(!filterP || !filterP.length || p.name.toLocaleLowerCase().indexOf(filterP.toLocaleLowerCase())>=0)));
    
}

const getType = (filterP: string) => {
    return Promise.resolve([
        {
            id:'TELEPHONE',
            name:'Telefonico'
        },
        {
            id:'VIDEO_CALL',
            name:'Video conferenza'
        },
        {
            id:'IN_PERSON',
            name:'In sede'
        },
        {
            id:'AT_CUSTOMER',
            name:'Da Cliente'
        },
    ].filter(p=>(!filterP || !filterP.length || p.name.toLocaleLowerCase().indexOf(filterP.toLocaleLowerCase())>=0)));
    
}

const getEvaluationType = (filterP: string) => {
    return Promise.resolve([
        {
            id:'HR',
            name:'Valutazione Hr'
        },
        {
            id:'TECHNICAL',
            name:'Valutazione Tecnica'
        },
        {
            id:'TECHNICAL_CUSTOMER',
            name:'Valutazione Tecnica del cliente'
        }
    ].filter(p=>(!filterP || !filterP.length || p.name.toLocaleLowerCase().indexOf(filterP.toLocaleLowerCase())>=0)));
    
}

export const interviewAddedFields={
    "outcome-selector":withField(withAutoComplete(getOutcome)),
    'type-selector':withField(withAutoComplete(getType)),
    'evaluationtype-selector':withField(withAutoComplete(getEvaluationType)),
}