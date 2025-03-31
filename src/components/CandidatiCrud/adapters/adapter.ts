import { BaseAdapter } from 'common/gof/Adapter';
import { CandidateFields, CandidateGender, CandidateServer, PersonSkillArea, RecruitingSkill, ResidenceFields, SkillArea, SubResidenceFields } from '../models/models';
import { recruitingSkillType, RequestFields, RequestSeniority } from '../../RichiesteCrud/models';
import { RecruitingSkillAreaAi, SkillDetailsRecruiting } from '../models/models-ai';

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

        let location_id = source.sede?.id == "0" ? null : source.sede?.id;

        const files = source.files;
        if(files)
            files.create= files.create.map(p=>({...p,property:'Person.files'}));

        return {
            id: 0,
            willingToTransfer: source.willingToTransfer ? source.willingToTransfer : false,
            candidateProfile_id: source.profile_autocomplete?.id ? parseInt(source.profile_autocomplete.id.toString()) : 0,
            profileType: source.profile_type || '',
            currentRAL: source.ral ? parseInt(source.ral.toString()) : 0,
            minRequiredRAL: source.ralMin ? parseInt(source.ralMin.toString()) : 0,
            maxRequiredRAL: source.ralMax ? parseInt(source.ralMax.toString()) : 0,
            notice: source.notice ? parseInt(source.notice.toString()) : 0,
            currentContractType_id: source.contract_type?.id ? parseInt(source.contract_type.id.toString()) : undefined,
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
                location_id: location_id ? parseInt(location_id.toString()) : null,
                Seniority: source.seniority ? source.seniority.id.toString() : null,
                Attachment: files,
                PersonSkillAreas: combinedPersonSkillAreas, // Mappatura non specificata
                isActivity_104: source.isActivity_104 ? source.isActivity_104 : false,
                PersonActivities: []
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
            code: source.Person?.CityRes?.Province?.Country.code,
            name: source.Person?.CityRes?.Province?.Country.name,

        };
        let province: SubResidenceFields = {
            id: source.Person?.CityRes?.province_id,
            code: source.Person?.CityRes?.Province?.city_abbreviation,
            name: source.Person?.CityRes?.Province?.name,

        };

        let residence: ResidenceFields = { city, country, province };

        const isActivity_104 = source.Person?.PersonActivities ? source.Person.PersonActivities.some(activity => activity?.["Activity"]?.ActivityType?.code && activity?.["Activity"].ActivityType.code === "HPE_104") : false;

        //source.Person.PersonActivities[0].Activity.ActivityType.code

        return {
            firstName: source.Person.firstName,
            lastName: source.Person.lastName,
            files: source.Person.files,
            birthDate: source.Person.dateBirth,
            phoneNumber: source.Person.phoneNumber || undefined,
            email: source.Person.privateEmail || '',
            residenza: residence,
            //residenza: source.Person.cityRes_id ? { id: source.Person.cityRes_id, name: '' } : undefined, // Mappatura aggiuntiva se necessaria
            gender: CandidateGender.find(g => g.id === source.Person.gender_id) || { id: 0, name: '' },
            sede: source.Person.location_id ? { id: source.Person.location_id, name: source.Person.Location.description } : undefined, // Mappatura aggiuntiva se necessaria
            ral: source.currentRAL,
            ralMin: source.minRequiredRAL,
            ralMax: source.maxRequiredRAL,
            notice: source.notice,
            note: source.notes || undefined,
            profile_autocomplete: source.CandidateProfile ? { id: source.CandidateProfile.id, name: source.CandidateProfile.description } : undefined,
            profile_type: source.profileType || undefined,
            willingToTransfer: source.willingToTransfer,
            isActivity_104: isActivity_104,
            contract_type: source.currentContractType ? { id: source.currentContractType.id, name: source.currentContractType.description } : undefined,
            seniority: RequestSeniority.find(p => p.id === source.Person.Seniority) || { id: 0, name: '' },
            skills: source.Person.PersonSkillAreas ? convertPersonSkillAreaToSkillsAi(source.Person.PersonSkillAreas, 0) : [],
            languageSkills: source.Person.PersonSkillAreas ? convertPersonSkillAreaToSkillsAi(source.Person.PersonSkillAreas, 1) : [],
        };
    }

}

// Field => Server (Candidate)
export function convertSkillsAiToPersonSkillArea(skillsAiArray: SkillArea[], personId?: number | null): PersonSkillArea[] {
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

// Server => Field (Candidate)
///  type = 1 => only languages , type != 1 => others
export function convertPersonSkillAreaToSkillsAi(personSkillAreas: PersonSkillArea[], type: number): SkillArea[] {
    const filtered_skills = type === 1 ? personSkillAreas?.filter(skillAi => skillAi.SkillArea.skillCategory_id == 116) : personSkillAreas?.filter(skillAi => skillAi.SkillArea.skillCategory_id != 116);

    return filtered_skills?.map(psa => ({
        id: psa.skillArea_id,
        code: psa.SkillArea.code,
        name: psa.SkillArea.name,
        skillCategory_id: psa.SkillArea.skillCategory_id,
    }));
}

//(Recruiting)
//
// Field => Server (Recruiting)
export function convertSkillsFormsToRecruitingSkills(skillsArray: SkillArea[], type: string): RecruitingSkill[] {
    return skillsArray?.map(skillAi => ({
        type: type,
        skillArea_id: skillAi.id,
        SkillArea: {
            id: skillAi.id,
            code: skillAi.code,
            skillCategory_id: skillAi.skillCategory_id,
            name: skillAi.name
        }
    }));
}

// Server => Field (Recruiting)
export function convertRecruitingSkillAreaToSkillsForms(recruitingSkillAreas: RecruitingSkill[], type: string): SkillArea[] {

    if (recruitingSkillAreas.length == 0) {
        return [] as SkillArea[];
    }
    switch (type) {
        case "PRIMARY":
            return recruitingSkillAreas.filter(detail => detail.type === "PRIMARY").map(x => x.SkillArea).filter(skillArea => skillArea !== undefined) as SkillArea[];
        case "SECONDARY":
            return recruitingSkillAreas.filter(detail => detail.type === "SECONDARY").map(x => x.SkillArea).filter(skillArea => skillArea !== undefined) as SkillArea[];
        case "LANGUAGE":
            return recruitingSkillAreas.filter(detail => detail.type === "LANGUAGE").map(x => x.SkillArea).filter(skillArea => skillArea !== undefined) as SkillArea[];
        default:
            return [] as SkillArea[];
    }
}

// Server => Field (Recruiting Ai)
export function adaptSkillsAi(form: RequestFields | null, data: any): RequestFields | null {

    if (form != null) {
        const primarySkills = data.skillDetails.find(detail => detail.type === "PRIMARY")?.skills || [];
        const secondarySkills = data.skillDetails.find(detail => detail.type === "SECONDARY")?.skills || [];
        const languageSkills = data.skillDetails.find(detail => detail.type === "LANGUAGE")?.skills || [];

        form.PrimarySkill = convertRecruitingSkillAiToSkillsForms(primarySkills);
        form.SecondarySkill = convertRecruitingSkillAiToSkillsForms(secondarySkills);
        form.LanguagesSkill = convertRecruitingSkillAiToSkillsForms(languageSkills);

        if (data.profileType)
            form.profileType = data.profileType;

        if (data.id_code)
            form.id_code = data.id_code;

        if (data.candidateProfile)
            form.Profile = { id: parseInt(data.candidateProfile.id), name: data.candidateProfile.description }

        if (data.seniority)
            form.Seniority = RequestSeniority.find(p => p.id === data.seniority) || { id: 0, name: '' }
    }

    return form;
}

function convertRecruitingSkillAiToSkillsForms(recruitingSkillAreas: SkillArea[]): SkillArea[] {
    if (recruitingSkillAreas.length == 0) {
        return [] as SkillArea[];
    }
    return recruitingSkillAreas.filter(skillArea => skillArea !== undefined) as SkillArea[];

}


export const candidateAdapter = new CandidateFieldsServerAdapter();
