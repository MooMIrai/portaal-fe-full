import { BaseAdapter } from 'common/gof/Adapter';
import { CandidateFields, CandidateSkills } from "../models/models";
import { CandidateAi, CandidateSkillsAi } from "../models/models-ai";
import { RequestSeniority } from '../../RichiesteCrud/models';

class CandidateAiFieldsAdapter extends BaseAdapter<CandidateFields, CandidateAi> {

    // Mappa CandidateFields in CandidateAi
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
            cityRes_id: source.residenza?.city?.id ? source.residenza.city.id : null,
            phoneNumber: source.phoneNumber,
            email: source.email
        };
    }

    // Mappa CandidateAi in CandidateFields
    reverseAdapt(source?: CandidateAi): CandidateFields | null {

        if (!source || !Object.keys(source).length)
            return null;

        return {
            firstName: source.firstName,
            lastName: source.lastName,
            birthDate: source.dateBirth,
            gender: { id: 1, name: "M" },
            phoneNumber: source.phoneNumber,
            email: source.email,
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
            seniority: undefined,
            skills: [],
            languageSkills: [],
        };
    }

    // Mappa CandidateSkillsAi in CandidateFields
    reverseAdaptSkills(source?: CandidateSkillsAi): CandidateSkills | null {

        if (!source || !Object.keys(source).length)
            return null;

        debugger;
        let id_spoken= process.env.SPOKEN_LANGUAGES ? process.env.SPOKEN_LANGUAGES : "116";

        return {
            skills: source.data.skills.filter((x) => x.skillCategory_id != parseInt(id_spoken)),
            languageSkills: source.data.skills.filter((x) => x.skillCategory_id == parseInt(id_spoken)),

            seniority: RequestSeniority.find(p => p.name == source.data.seniority) || { id: 0, name: 'Seleziona Seniority' },
        };
    }
}

export const candidateAiAdapter = new CandidateAiFieldsAdapter();