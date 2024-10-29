import withField from "common/hoc/Field";
import withAutoComplete from "common/hoc/AutoComplete";
import { CrudGenericService } from "../../../../../services/personaleServices";


const getDataUtente = (filterP: string) => {
    return CrudGenericService.searchAccount(filterP).then((res) => {
        if (res) {
            return res.map(r => ({ id: r.person_id, name: r.firstName + ' ' + r.lastName }));
        }
        return []
    });
}

export const AutoCompletePerson = withField(withAutoComplete(getDataUtente))

export const formFields = {
    "account-selector": AutoCompletePerson,
};
