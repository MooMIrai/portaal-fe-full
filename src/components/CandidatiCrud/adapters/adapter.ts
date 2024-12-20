import { BaseAdapter } from 'common/gof/Adapter';
import { CandidateFields, CandidateGender, CandidateServer, OptionCandidateField, PersonSkillArea, ResidenceFields, SubResidenceFields } from '../models/models';
import { RequestSeniority } from '../../RichiesteCrud/models';
import { SkillsAi } from '../models/models-ai';

class CandidateFieldsServerAdapter extends BaseAdapter<CandidateFields, CandidateServer> {

    // Mappa CandidateFields in CandidateServer
    adapt(source?: CandidateFields): CandidateServer | null {

        if (!source) {
            return null;
        }

        const personSkillAreas_1 = convertSkillsAiToPersonSkillArea(source.languageSkills, null);
        const personSkillAreas_2 = convertSkillsAiToPersonSkillArea(source.skills, null);

        const combinedPersonSkillAreas = [
            ...(personSkillAreas_1 ?? []),
            ...(personSkillAreas_2 ?? [])
        ];

        debugger;
        return {
            id: 0,
            willingToTransfer: source.willingToTransfer ? source.willingToTransfer : false,
            candidateProfile_id: source.profile_autocomplete?.id ? parseInt(source.profile_autocomplete.id.toString()) : 0,
            profileType: source.profile_type || '',
            currentRAL: source.ral ? parseInt(source.ral.toString()) : 0,
            minRequiredRAL: source.ralMin ? parseInt(source.ralMin.toString()) : 0,
            maxRequiredRAL: source.ralMax ? parseInt(source.ralMax.toString()) : 0,
            notice: source.notice ? parseInt(source.notice.toString()) : 0,
            currentContractType_id: source.contract_type?.id ? parseInt(source.contract_type.id.toString()) : 0,
            notes: source.note || '',

            CandidateProfile: {
                id: source.profile_autocomplete?.id ? parseInt(source.profile_autocomplete.id.toString()) : 0,
                code: '', // Da aggiungere se necessario
                description: source.profile_autocomplete?.name || ''
            },
            currentContractType: {
                id: source.contract_type?.id ? parseInt(source.contract_type.id.toString()) : 0,
                code: '', // Da aggiungere se necessario
                description: source.contract_type?.name || '',
                dailyHours: 0, // Valore predefinito
                fillTimesheet: false, // Valore predefinito
            },
            //RecruitingAssignments: [], // Mappatura non specificata, dipende dal sistema
            Person: {
                id: 0, // ID persona predefinito
                firstName: source.firstName,
                lastName: source.lastName,
                gender_id: source.gender ? parseInt(source.gender.id.toString()) : 1,
                CityRes: null,
                Location: null,
                phoneNumber: source.phoneNumber || null,
                privateEmail: source.email,
                dateBirth: source.birthDate,
                cityRes_id: source.residenza?.city?.id != null ? source.residenza.city.id : null,
                //cityRes_id: source.residenza?.id ? parseInt(source.residenza.id.toString()) : null,
                date_created: '', // Da aggiungere se disponibile
                date_modified: '', // Da aggiungere se disponibile
                user_created: '', // Da aggiungere se disponibile
                user_modified: '', // Da aggiungere se disponibile
                location_id: source.sede?.id ? parseInt(source.sede.id.toString()) : null,
                Seniority: source.seniority ? source.seniority.id.toString() : null,
                Attachment: null,
                PersonSkillAreas: combinedPersonSkillAreas, // Mappatura non specificata
                isActivity_104: source.isActivity_104 ? source.isActivity_104 : false,
            }
        };
    }

    // Mappa CandidateServer in CandidateFields
    reverseAdapt(source?: CandidateServer): CandidateFields | null {

        if (!source || !Object.keys(source).length)
            return null;

        let city: SubResidenceFields = {
            id: source.Person?.cityRes_id ? source.Person?.cityRes_id : 0,
            code: source.Person?.CityRes?.city_abbreviation,
            name: source.Person?.CityRes?.name ? source.Person?.CityRes?.name : "",

        };
        let country: SubResidenceFields = {

            id: source.Person?.CityRes?.isProvince ? source.Person?.CityRes?.country_id : source.Person?.CityRes?.Province?.country_id,
            code: source.Person?.CityRes?.Country.code,
            name: source.Person?.CityRes?.Country.name,

        };
        let province: SubResidenceFields = {
            id: source.Person?.CityRes?.province_id,
            code: source.Person?.CityRes?.Province?.city_abbreviation,
            name: source.Person?.CityRes?.Province?.name,

        };

        let residence: ResidenceFields = { city, country, province };

        return {
            firstName: source.Person.firstName,
            lastName: source.Person.lastName,
            birthDate: source.Person.dateBirth,
            phoneNumber: source.Person.phoneNumber || undefined,
            email: source.Person.privateEmail || '',
            residenza: residence,
            //residenza: source.Person.cityRes_id ? { id: source.Person.cityRes_id, name: '' } : undefined, // Mappatura aggiuntiva se necessaria
            gender: CandidateGender.find(g => g.id === source.Person.gender_id) || { id: 0, name: 'Seleziona Sesso' },
            sede: source.Person.location_id ? { id: source.Person.location_id, name: source.Person.Location.description } : undefined, // Mappatura aggiuntiva se necessaria
            ral: source.currentRAL,
            ralMin: source.minRequiredRAL,
            ralMax: source.maxRequiredRAL,
            notice: source.notice,
            note: source.notes || undefined,
            profile_autocomplete: source.CandidateProfile ? { id: source.CandidateProfile.id, name: source.CandidateProfile.description } : undefined,
            profile_type: source.profileType || undefined,
            willingToTransfer: source.willingToTransfer,
            isActivity_104: source.Person.isActivity_104,
            contract_type: source.currentContractType ? { id: source.currentContractType.id, name: source.currentContractType.description } : undefined,
            seniority: RequestSeniority.find(p => p.id === source.Person.Seniority) || { id: 0, name: 'Seleziona Seniority' },
            skills: source.Person.PersonSkillAreas ? convertPersonSkillAreaToSkillsAi(source.Person.PersonSkillAreas, 0) : [],
            languageSkills: source.Person.PersonSkillAreas ? convertPersonSkillAreaToSkillsAi(source.Person.PersonSkillAreas, 1) : [],
        };
    }

}

export function convertSkillsAiToPersonSkillArea(skillsAiArray: SkillsAi[], personId?: number | null): PersonSkillArea[] {
    return skillsAiArray?.map(skillAi => ({
        person_id: personId || null,
        skillArea_id: skillAi.id,
        SkillArea: {
            id: skillAi.id,
            code: skillAi.code,
            skillCategory_id: skillAi.skillCategory_id,
            name: skillAi.name
        }
    }));
}

export function convertPersonSkillAreaToSkillsAi(personSkillAreas: PersonSkillArea[], type: number): SkillsAi[] {

    const filtered_skills = type === 1 ? personSkillAreas?.filter(skillAi => skillAi.SkillArea.skillCategory_id == 116) : personSkillAreas?.filter(skillAi => skillAi.SkillArea.skillCategory_id != 116);

    return filtered_skills?.map(psa => ({
        id: psa.skillArea_id,
        code: psa.SkillArea.code,
        name: psa.SkillArea.name,
        skillCategory_id: psa.SkillArea.skillCategory_id,
    }));
}


export const candidateAdapter = new CandidateFieldsServerAdapter();
