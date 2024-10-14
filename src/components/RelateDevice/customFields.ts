import withField from "common/hoc/Field";
import withAutoComplete from "common/hoc/AutoComplete";
import { deviceService } from "../../services/deviceService";


const getDataUtente= (filterP:string)=>{
    return deviceService.searchAccount(filterP).then((res)=>{
        if(res ){
            return res.map(r=>({id:r.person_id,name:r.firstName+ ' '+r.lastName}));
        }
        return []
    });
}

export const AutoCompletePerson = withField(withAutoComplete(getDataUtente))

export const formFields = {
    "account-selector": AutoCompletePerson,
    
};
