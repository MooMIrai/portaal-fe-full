import withField from "common/hoc/Field";
import withAutoComplete from "common/hoc/AutoComplete";
import { profileService } from "../../services//profileService"
import { contractService } from "../../services/contractService";
import { LocationSelector, SenioritySelector } from "../RichiesteCrud/customFields";

const getDataProfile = () => {

    return profileService.getAll().then((res) => {
        if (res) {
            return res.data.map((r:any) => ({ id: r.id, name: r.description }));
        }
        return []
    });
}
const getDataContract = () => {

    return contractService.getAll().then((res) => {
        if (res) {
            return res.data.map((r:any) => ({ id: r.id, name: r.description }));
        }
        return []
    });
}

export const AutoCompleteProfile = withField(withAutoComplete(getDataProfile))
export const AutoCompleteContract = withField(withAutoComplete(getDataContract))


export const formFields = {
    "profile-selector": AutoCompleteProfile,
    "contract_type-selector": AutoCompleteContract,
    "location-selector": LocationSelector,
    "seniority-selector": SenioritySelector
};