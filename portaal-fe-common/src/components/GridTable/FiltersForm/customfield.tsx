import withField from "../../../hoc/Field";
import withAutoComplete from "../../../hoc/AutoComplete";
import { FieldConfig } from "../../../models/formModel";

export function getAddedFields(formFields: FieldConfig[]) {

    const addedField: any = {};

    const customFields = formFields.filter(f => f.type.indexOf('filter-autocomplete') >= 0);
    customFields.forEach(cf => {
        addedField[cf.type+'_'+cf.name] = withField(withAutoComplete(((term:string) => {
            if(cf.options) return cf.options.getData(term);
            return Promise.resolve([]);
        })));
    });

    return addedField;
}
