import withField from "common/hoc/Field";
import withAutoComplete from "common/hoc/AutoComplete";
import { profileService } from "../../services//profileService"
import { contractService } from "../../services/contractService";
import { LocationSelector, SenioritySelector } from "../RichiesteCrud/customFields";
import { candidatoService } from "../../services/candidatoService";

const getDataProfile = () => {

    return profileService.getAll().then((res) => {
        if (res) {
            return res.data.map((r: any) => ({ id: r.id, name: r.description }));
        }
        return []
    });
}
const getDataContract = () => {

    return contractService.getAll().then((res) => {
        if (res) {
            return res.data.map((r: any) => ({ id: r.id, name: r.description }));
        }
        return []
    });
}
const getGenders = () => {

    return candidatoService.getGenders().then((res) => {
        if (res) {
            return res.data.map((r: any) => ({ id: r.id, name: r.code }));
        }
        return []
    });
}


export const AutoCompleteProfile = withField(withAutoComplete(getDataProfile))
export const AutoCompleteContract = withField(withAutoComplete(getDataContract))
export const AutoCompleteGender = withField(withAutoComplete(getGenders))


export const formFields = {
    "profile-selector": AutoCompleteProfile,
    "contract_type-selector": AutoCompleteContract,
    "gender-selector": AutoCompleteGender,
    "location-selector": LocationSelector,
    "seniority-selector": SenioritySelector

};