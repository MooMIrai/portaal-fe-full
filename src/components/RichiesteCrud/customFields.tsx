import { richiestaService } from "../../services/richiestaService";
import withField from "common/hoc/Field";
import withAutoComplete from "common/hoc/AutoComplete";

const getEmployee = (filterP: string) => {
    return richiestaService.searchAccount(filterP).then((res) => {
        if (res) {
            return res.map(r => ({ id: r.id, name: r.firstName + ' ' + r.lastName }));
        }
        return []
    });
}

const getStatus = (filterP: string) => {
    return Promise.resolve([
        {
            id:'A',
            name:'Aperta'
        },
        {
            id:'S',
            name:'Sospesa'
        },
        {
            id:'C',
            name:'Chiusa'
        },
        {
            id:'E',
            name:'Eliminata'
        }
    ].filter(p=>!filterP || !filterP.length || p.name.toLowerCase().indexOf(filterP.toLowerCase())>=0))
}

const getPriority = (filterP: string) => {
    return Promise.resolve([
        {
            id:'L',
            name:'Bassa'
        },
        {
            id:'M',
            name:'Media'
        },
        {
            id:'H',
            name:'Alta'
        },
        {
            id:'U',
            name:'Urgente'
        }
    ].filter(p=>!filterP || !filterP.length || p.name.toLowerCase().indexOf(filterP.toLowerCase())>=0))
}

const getDataCustomer= (filterP:string)=>{
    return richiestaService.searchCustomer(1,20,
        {"logic":"or","filters":[{"field":"name","operator":"contains","value":filterP}]
    },[],undefined,true).then((res)=>{
        if(res ){
            return res.data
        }
    });
}

const getSeniority= (filterP:string)=>{
    return Promise.resolve([
        {
            id:'J',
            name:'Junior'
        },
        {
            id:'J_A',
            name:'Junior Avanzato'
        },
        {
            id:'M',
            name:'Middle'
        },
        {
            id:'M_A',
            name:'Middle Avanzato'
        },
        {
            id:'S',
            name:'Senior'
        },
        {
            id:'S_A',
            name:'Senior Avanzato'
        }
    ].filter(p=>!filterP || !filterP.length || p.name.toLowerCase().indexOf(filterP.toLowerCase())>=0))
}

export const customFields={
    "account-selector":withField(withAutoComplete(getEmployee)),
    "status-selector":withField(withAutoComplete(getStatus)),
    "priority-selector":withField(withAutoComplete(getPriority)),
    "customer-selector":withField(withAutoComplete(getDataCustomer)),
    "seniority-selector":withField(withAutoComplete(getSeniority)),
}