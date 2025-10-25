import { deviceService } from "../../services/deviceService";
import withField from "common/hoc/Field"
import withAutoComplete from "common/hoc/AutoComplete"

const getDeviceType= (filterP:string)=>{
    return deviceService.getDeviceTypes(filterP).then((res)=>{
        if(res){
            return res.data.data;
        }
        return [];
    });
}

export const deviceCustomFields = {
    "devicetype-selector":withField(withAutoComplete(getDeviceType)),
}