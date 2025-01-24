import { BaseAdapter } from 'common/gof/Adapter';
import { CandidateFields, CandidateGender, CandidateSkills, SubResidenceFields } from "../models/models";
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
            gender_id: source.gender ? parseInt(source.gender.id.toString()) : 1,
            cityRes_id: source.residenza?.city?.id != null ? source.residenza.city.id : null,
            phoneNumber: source.phoneNumber,
            privateEmail: source.email,
            note: source.note ? source.note : ""
        };
    }

    // Mappa CandidateAi in CandidateFields
    reverseAdapt(source?: CandidateAi): CandidateFields | null {

        if (!source || !Object.keys(source).length)
            return null;

        let city: SubResidenceFields = {
            id: source.cityRes.Person?.cityRes_id ? source.cityRes.Person?.cityRes_id : 0,
            code: source.cityRes.Person?.CityRes?.city_abbreviation,
            name: source.cityRes.Person?.CityRes?.name ? source.cityRes.Person?.CityRes?.name : "",

        };
        let country: SubResidenceFields = {

            id: source.cityRes.Person?.CityRes?.isProvince ? source.cityRes.Person?.CityRes?.country_id : source.cityRes.Person?.CityRes?.Province?.country_id,
            code: source.cityRes.Person?.CityRes?.Province?.Country.code,
            name: source.cityRes.Person?.CityRes?.Province?.Country.name,

        };
        let province: SubResidenceFields = {
            id: source.cityRes.Person?.CityRes?.province_id,
            code: source.cityRes.Person?.CityRes?.Province?.city_abbreviation,
            name: source.cityRes.Person?.CityRes?.Province?.name,

        };

        return {
            firstName: source.firstName,
            lastName: source.lastName,
            birthDate: source.dateBirth,
            gender: CandidateGender.find(g => g.id === source.gender_id) || { id: 0, name: '' },
            phoneNumber: source.phoneNumber,
            email: source.privateEmail,
            residenza: {
                city: city,
                country: country,
                province: province,
            },
            note: source.note,
            skills: [],  // da sistemare
            languageSkills: [],  // da sistemare
        };
    }

    // Mappa CandidateSkillsAi in CandidateFields
    reverseAdaptSkills(source?: CandidateSkillsAi): CandidateSkills | null {

        if (!source || !Object.keys(source).length)
            return null;

        let id_spoken = process.env.SPOKEN_LANGUAGES ? process.env.SPOKEN_LANGUAGES : "116";

        return {
            skills: source.data.skills.filter((x) => x.skillCategory_id != parseInt(id_spoken)),
            languageSkills: source.data.skills.filter((x) => x.skillCategory_id == parseInt(id_spoken)),
            seniority: RequestSeniority.find(p => p.id == source.data.seniority) || { id: 0, name: '' },
        };
    }
}

export const candidateAiAdapter = new CandidateAiFieldsAdapter();