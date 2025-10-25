import { richiestaService } from "../../services/richiestaService";
import withField from "common/hoc/Field";
import withAutoComplete from "common/hoc/AutoComplete";
import { RequestPriority, RequestSeniority, RequestStatus, WorkModel } from "./models";

const getEmployee = (filterP: string) => {
    return richiestaService.searchAccount(filterP).then((res) => {
        if (res) {
            return res.map(r => ({ id: r.account_id, name: r.firstName + ' ' + r.lastName }));
        }
        return []
    });
}

const getStatus = (filterP: string) => {
    return Promise.resolve(RequestStatus.filter(p=>!filterP || !filterP.length || p.name.toLowerCase().indexOf(filterP.toLowerCase())>=0))
}

const getPriority = (filterP: string) => {
    return Promise.resolve(RequestPriority.filter(p=>!filterP || !filterP.length || p.name.toLowerCase().indexOf(filterP.toLowerCase())>=0))
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
    return Promise.resolve(RequestSeniority.filter(p=>!filterP || !filterP.length || p.name.toLowerCase().indexOf(filterP.toLowerCase())>=0))
}

const getWorkModel = (filterP: string) => {
    return Promise.resolve(WorkModel.filter(p=>!filterP || !filterP.length || p.name.toLowerCase().indexOf(filterP.toLowerCase())>=0))
}

const getLocation = (filterP:string) =>{
    return richiestaService.searchLocation(filterP).then((res)=>{
        if(res ){
            return res.map(r => ({ id: r.id, name:r.description }));
        }
    });  
}

const getProfile = (filterP:string) =>{
    return richiestaService.searchProfile(filterP).then((res)=>{
        if(res ){
            return res.map(r => ({ id: r.id, name:r.description }));
        }
    });  
}

export const LocationSelector = withField(withAutoComplete(getLocation));
export const SenioritySelector = withField(withAutoComplete(getSeniority));
export const WorkModelSelector = withField(withAutoComplete(getWorkModel));

export const customFields={
    "hr-selector":withField(withAutoComplete(getEmployee)),
    "status-selector":withField(withAutoComplete(getStatus)),
    "priority-selector":withField(withAutoComplete(getPriority)),
    "customer-selector":withField(withAutoComplete(getDataCustomer)),
    "seniority-selector":SenioritySelector,
    "location-selector":LocationSelector,
    "workModel-selector":WorkModelSelector,
    "profile-selector":withField(withAutoComplete(getProfile))
}