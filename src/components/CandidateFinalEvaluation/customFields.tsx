import withField from "common/hoc/Field";
import withAutoComplete from "common/hoc/AutoComplete";

const getContactType = (filterP: string) => {
    return Promise.resolve([
        {
            id:'SCREENING',
            name:'Screening telefonico'
        },
        {
            id:'EMAIL',
            name:'Email'
        },
        {
            id:'IN_PERSON',
            name:'Di persona'
        }
    ].filter(p=>(!filterP || !filterP.length || p.name.toLocaleLowerCase().indexOf(filterP.toLocaleLowerCase())>=0)));
}

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

export const sendFinalEvaluationAddedFields={
    "contact-selector":withField(withAutoComplete(getContactType)),
    "outcome-selector":withField(withAutoComplete(getOutcome)),
}