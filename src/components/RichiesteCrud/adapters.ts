import { BaseAdapter } from 'common/gof/Adapter';
import { OptionRequestField, recruitingSkillType, RequestFields, RequestPriority, RequestSeniority, RequestServer, RequestStatus, WorkModel } from './models';
import { convertRecruitingSkillAreaToSkillsAi, convertRecruitingSkillAreaToSkillsForms, convertSkillsFormsToRecruitingSkills } from '../CandidatiCrud/adapters/adapter';

// Adapter per RequestFields e RequestServer
class RequestFieldsServerAdapter extends BaseAdapter<RequestFields, RequestServer> {
  // Adatta RequestFields in RequestServer
  adapt(source?: RequestFields): RequestServer | null {
    if (!source) {
      return null;
    }
    debugger;

    const primary = convertSkillsFormsToRecruitingSkills(source.PrimarySkill, recruitingSkillType.PRIMARY);
    const secondary = convertSkillsFormsToRecruitingSkills(source.SecondarySkill, recruitingSkillType.SECONDARY);
    const languages = convertSkillsFormsToRecruitingSkills(source.LanguagesSkill, recruitingSkillType.LANGUAGE);

    const combinedRecruitingSkills = [
      ...(primary ?? []),
      ...(secondary ?? []),
      ...(languages ?? [])
    ];
    return {
      //  source.sede?.id ? parseInt(source.sede.id.toString()) : null,

      id: 0, // Valore predefinito, potrebbe dipendere dal sistema
      requestingEmployee_id: source.ReferrerHr?.id ? parseInt(source.ReferrerHr.id.toString()) : 0,
      RequestState: source.RequestState.id.toString(), // Assuming RequestState in RequestFields has name
      Priority: source.Priority.id.toString(), // Same assumption for Priority
      customer_id: source.Customer?.id ? parseInt(source.Customer.id.toString()) : 0,
      ref_code: source.ref_code,
      location_id: source.Location?.id ? parseInt(source.Location.id.toString()) : 0,
      id_code: source.id_code,
      WorkModel: source.WorkModel?.id.toString(),
      candidateProfile_id: source.Profile?.id ? parseInt(source.Profile.id.toString()) : 0,
      profileType: source.profileType,
      Seniority: source.Seniority.id.toString(),
      Skills: combinedRecruitingSkills,
      notes: source.notes,
      saleRate: source.saleRate ? parseInt(source.saleRate.toString()) : 0, 
      continuative: source.continuative,
      //tenant_code: '', // Potresti voler mappare un campo se presente
      //RequestingEmployee: { id: 0, email: '', person_id: 0, accountStatus_id: null, Person: { id: 0, firstName: '', lastName: '', privateEmail: null, dateBirth: '', isExternal: false, Seniority: null } },
      //Customer: { 
      //    id: typeof source.Customer.id === 'number'?source.Customer.id: parseInt(source.Customer.id),
      //    customer_code: '', name: source.Customer.name },
      //Location: { id: typeof source.Location.id === 'number'?source.Location.id: parseInt(source.Location.id), code: '', description: source.Location.name, city_id: 0 },
      //CandidateProfile: { id: typeof source.Profile.id === 'number' ?source.Profile.id:parseInt(source.Profile.id), code: '', description: source.Profile.name },
    };
  }

  // Adatta RequestServer in RequestFields
  reverseAdapt(source?: RequestServer): RequestFields | null {
    if (!source || !Object.keys(source).length) {
      return null;
    }
    debugger;


    return {
      ReferrerHr: source.RequestingEmployee?.id ? { id: source.RequestingEmployee.id, name: source.RequestingEmployee.Person.firstName + ' ' + source.RequestingEmployee.Person.lastName } : undefined, // Aggiungi mappatura se necessario
      RequestState: RequestStatus.find(p => p.id === source.RequestState) || { id: 0, name: 'Seleziona Stato' },
      Priority: RequestPriority.find(p => p.id === source.Priority) || { id: 0, name: 'Seleziona Priorità' },
      Customer: source.Customer?.id ? { id: source.Customer.id, name: source.Customer.name } : undefined,
      ref_code: source.ref_code,
      id_code: source.id_code,
      Seniority: RequestSeniority.find(p => p.id === source.Seniority) || { id: 0, name: 'Seleziona Seniority' },
      PrimarySkill: convertRecruitingSkillAreaToSkillsForms(source.Skills, recruitingSkillType.PRIMARY), 
      SecondarySkill: convertRecruitingSkillAreaToSkillsForms(source.Skills, recruitingSkillType.SECONDARY),  
      LanguagesSkill: convertRecruitingSkillAreaToSkillsForms(source.Skills, recruitingSkillType.LANGUAGE),
      saleRate: source.saleRate,
      continuative: source.continuative,
      notes: source.notes,
      profileType: source.profileType,
      WorkModel: WorkModel.find(p => p.id === source.WorkModel) || { id: 0, name: 'Seleziona Tipologia di Lavoro' },
      Location: source.Location?.id ? { id: source.Location.id, name: source.Location.description } : undefined,
      Profile: source.CandidateProfile?.id ? { id: source.CandidateProfile.id, name: source.CandidateProfile.description } : undefined
    };
  }
}

export const requestAdapter = new RequestFieldsServerAdapter();