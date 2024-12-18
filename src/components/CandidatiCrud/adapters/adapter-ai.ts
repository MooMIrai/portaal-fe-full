import { BaseAdapter } from 'common/gof/Adapter';
import { CandidateFields } from "../models/models";
import { CandidateAi } from "../models/models-ai";

class CandidateAiFieldsAdapter extends BaseAdapter<CandidateFields, CandidateAi> {
    // Adatta CandidateFields in CandidateAi
    adapt(source?: CandidateFields): CandidateAi | null {
        if (!source) {
            return null;
        }

        return {
            firstName: source.firstName,
            lastName: source.lastName,
            dateBirth: source.birthDate,
            country_id: 0,
            province_id: 0,
            cityRes_id: source.residenza?.city?.id ? source.residenza.city.id : null
        };
    }

    // Adatta CandidateAi in CandidateFields
    reverseAdapt(source?: CandidateAi): CandidateFields | null {

        if (!source || !Object.keys(source).length)
            return null;

        return {
            firstName: source.firstName,
            lastName: source.lastName,
            birthDate: source.dateBirth,
            phoneNumber: undefined,
            email: '',
            residenza: undefined, // Mappatura aggiuntiva se necessaria
            sede: undefined, // Mappatura aggiuntiva se necessaria
            ral: 0,
            ralMin: 0,
            ralMax: 0,
            notice: 0,
            note: undefined,
            profile_autocomplete: undefined,
            profile_type: undefined,
            willingToTransfer: false,
            isActivity_104: false,
            contract_type: undefined,
            seniority: undefined
        };
    }
}

export const candidateAiAdapter = new CandidateAiFieldsAdapter();