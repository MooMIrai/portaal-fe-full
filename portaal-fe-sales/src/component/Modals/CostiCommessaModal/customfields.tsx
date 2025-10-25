
import withField from "common/hoc/Field"
import withAutoComplete from "common/hoc/AutoComplete"
import { progettoService } from "../../../services/progettoServices";

const getDataProjectExpensesType = (filterP: string) => {
    return progettoService.getProjectExpensesTypes(filterP).then((res) => {
        if (res) {
            return res.map(p => ({ id: p.id, name: p.description }));
        }
        return [];
    });
}

export const projectExpensesCustomFields = {
    "project-type-selector": withField(withAutoComplete(getDataProjectExpensesType))
}

