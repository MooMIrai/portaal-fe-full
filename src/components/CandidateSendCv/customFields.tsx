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

export const sendCvAddedFields={
    "outcome-selector":withField(withAutoComplete(getOutcome)),
    
}