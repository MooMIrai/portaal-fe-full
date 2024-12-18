import { BaseAdapter } from 'common/gof/Adapter';
import { CandidateFields, CandidateServer, OptionCandidateField } from '../models/models';
import { RequestSeniority } from '../../RichiesteCrud/models';

class CandidateFieldsServerAdapter extends BaseAdapter<CandidateFields, CandidateServer> {
    // Adatta CandidateFields in CandidateServer
    adapt(source?: CandidateFields): CandidateServer | null {
        if (!source) {
            return null;
        }

        return {
            id: 0, // ID predefinito, potrebbe essere generato dal sistema
            willingToTransfer: source.willingToTransfer,
            candidateProfile_id: source.profile_autocomplete?.id ? parseInt(source.profile_autocomplete.id.toString()) : 0,
            profileType: source.profile_type || '',
            currentRAL: source.ral || 0,
            minRequiredRAL: source.ralMin || 0,
            maxRequiredRAL: source.ralMax || 0,
            notice: source.notice,
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
                phoneNumber: source.phoneNumber || null,
                privateEmail: source.email,
                dateBirth: source.birthDate,
                cityRes_id: source.residenza?.id ? parseInt(source.residenza.id.toString()) : null,
                date_created: '', // Da aggiungere se disponibile
                date_modified: '', // Da aggiungere se disponibile
                user_created: '', // Da aggiungere se disponibile
                user_modified: '', // Da aggiungere se disponibile
                location_id: source.sede?.id ? parseInt(source.sede.id.toString()) : null,
                Seniority: source.seniority ? source.seniority.id.toString() : "",
                Attachment: null,
                PersonSkillAreas: [], // Mappatura non specificata
                isActivity_104: source.isActivity_104
            }
        };
    }

    // Adatta CandidateServer in CandidateFields
    reverseAdapt(source?: CandidateServer): CandidateFields | null {

        if (!source || !Object.keys(source).length)
            return null;

        debugger;
        return {
            firstName: source.Person.firstName,
            lastName: source.Person.lastName,
            birthDate: source.Person.dateBirth,
            phoneNumber: source.Person.phoneNumber || undefined,
            email: source.Person.privateEmail || '',
            residenza: source.Person.cityRes_id ? { id: source.Person.cityRes_id, name: '' } : undefined, // Mappatura aggiuntiva se necessaria
            sede: source.Person.location_id ? { id: source.Person.location_id, name: '' } : undefined, // Mappatura aggiuntiva se necessaria
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
            seniority: RequestSeniority.find(p=>p.id===source.Person.Seniority) || {id:0,name:'Seleziona Seniority'},
        };
    }
}

export const candidateAdapter = new CandidateFieldsServerAdapter();
