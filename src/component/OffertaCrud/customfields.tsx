
import withField from "common/hoc/Field"
import withAutoComplete from "common/hoc/AutoComplete"
import { offertaService } from "../../services/offertaService";
import { customerService } from "../../services/clienteService";
import { CrudGenericService } from "../../services/personaleServices";

const getDataOutcome= (filterP:string)=>{
    return offertaService.getOutcomeType(filterP);
}

const getDataBilling= (filterP:string)=>{
    return offertaService.getBillingType(filterP);
}

const getDataCustomer= (filterP:string)=>{
    return customerService.search(1,20,
        {"logic":"or","filters":[{"field":"name","operator":"contains","value":filterP}]
    }).then((res)=>{
        if(res ){
            return res.data
        }
    });
}

const getDataCommerciale= (filterP:string)=>{
    return CrudGenericService.searchCommerciale(filterP).then((res)=>{
        if(res ){
            return res.map(r=>({id:r.id,name:r.Person.firstName+ ' '+r.Person.lastName}));
        }
        return []
    });
}

const getDataProjectType= (filterP:string)=>{
    return offertaService.getProjectType(filterP).then((res)=>{
        if(res){
            return res.data.data.map(p=>({id:p.id,name:p.description}));
        }
        return [];
    });
}

export const offertaCustomFields = {
    "projecttype-selector":withField(withAutoComplete(getDataProjectType)),
    "commerciale-selector": withField(withAutoComplete(getDataCommerciale)),
    "customer-selector":withField(withAutoComplete(getDataCustomer)),
    "outcometype-selector":withField(withAutoComplete(getDataOutcome)),
    "billingtype-selector":withField(withAutoComplete(getDataBilling))
}

