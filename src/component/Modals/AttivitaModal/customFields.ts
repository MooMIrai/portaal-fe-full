import withField from "common/hoc/Field";
import withAutoComplete from "common/hoc/AutoComplete";
import { CrudGenericService } from "../../../services/personaleServices";
import { attivitaService } from "../../../services/attivitaService";


const getManager = (filterP: string) => {
    return CrudGenericService.searchCommerciale(filterP).then((res) => {
        if (res) {
            return res.map(r => ({ id: r.id, name: r.Person.firstName + ' ' + r.Person.lastName }));
        }
        return []
    });
}

const getActivityTypes = () => {
    return attivitaService.getActivityTypes().then((res) => {
        if (res) {
            return res.map(a => ({ id: a.id, name: a.description }));
        }

        return [];
    });
}

export const AutoCompleteManager = withField(withAutoComplete(getManager));
export const AutoCompleteActivityType = withField(withAutoComplete(getActivityTypes));

export const formFields = {
    "manager-selector": AutoCompleteManager,
    "activity-type-selector": AutoCompleteActivityType,
};
