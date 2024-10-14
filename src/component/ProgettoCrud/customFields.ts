import withField from "common/hoc/Field";
import withAutoComplete from "common/hoc/AutoComplete";
import { offertaService } from "../../services/offertaService";


const getOfferte = (filterP: string) => {
    return offertaService.searchOfferte(filterP).then((res) => {
        if (res && res.data) {
            return res.data.map(r => ({ id: r.id, name: r.name }));
        }
        return [];
    });
}

export const AutoCompleteOfferte = withField(withAutoComplete(getOfferte))

export const formFields = {
    "offerte-selector": AutoCompleteOfferte,
};
