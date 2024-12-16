import {BaseAdapter} from 'common/gof/Adapter';
import { OptionRequestField, RequestFields, RequestPriority, RequestSeniority, RequestServer, RequestStatus } from './models';

// Adapter per RequestFields e RequestServer
class RequestFieldsServerAdapter extends BaseAdapter<RequestFields, RequestServer> {
    // Adatta RequestFields in RequestServer
    adapt(source?: RequestFields): RequestServer|null {
      if (!source) {
        return null;
      }
      
      return {
        id: 0, // Valore predefinito, potrebbe dipendere dal sistema
        requestingEmployee_id: typeof source.ReferrerHr.id === 'number'?source.ReferrerHr.id: parseInt(source.ReferrerHr.id), // Valore predefinito, dipende dalla logica applicativa
        RequestState: source.RequestState.id.toString(), // Assuming RequestState in RequestFields has name
        Priority: source.Priority.id.toString(), // Same assumption for Priority
        customer_id:  typeof source.Customer.id === 'number'?source.Customer.id: parseInt(source.Customer.id), // Valore predefinito, dipende dal sistema
        ref_code: source.ref_code,
        location_id: typeof source.Location.id === 'number' ?source.Location.id:parseInt(source.Location.id), // Valore predefinito, dipende dal sistema
        id_code: source.id_code,
        WorkModel: '', // Potresti voler mappare un campo se presente
        candidateProfile_id: typeof source.Profile.id === 'number' ?source.Profile.id:parseInt(source.Profile.id), // Valore predefinito, dipende dalla logica applicativa
        profileType: '', // Mappatura aggiuntiva se necessaria
        Seniority: source.Seniority.toString(), // Assuming Seniority in RequestFields has name
        notes: source.notes,
        saleRate: source.saleRate ?? 0, // Usa 0 se saleRate è null
        continuative: source.continuative,
        //tenant_code: '', // Potresti voler mappare un campo se presente
        RequestingEmployee: { id: 0, email: '', person_id: 0, accountStatus_id: null, Person: { id: 0, firstName: '', lastName: '', privateEmail: null, dateBirth: '', isExternal: false, Seniority: null } },
        Customer: { 
            id: typeof source.Customer.id === 'number'?source.Customer.id: parseInt(source.Customer.id),
            customer_code: '', name: source.Customer.name },
        Location: { id: typeof source.Location.id === 'number'?source.Location.id: parseInt(source.Location.id), code: '', description: source.Location.name, city_id: 0 },
        CandidateProfile: { id: typeof source.Profile.id === 'number' ?source.Profile.id:parseInt(source.Profile.id), code: '', description: source.Profile.name },
        Skills: source.PrimarySkill
      };
    }
  
    // Adatta RequestServer in RequestFields
    reverseAdapt(source?: RequestServer): RequestFields|null {
      if (!source || !Object.keys(source).length) {
        return null;
      }
  
      return {
        ReferrerHr: { id: source.RequestingEmployee.id, name: source.RequestingEmployee.Person.firstName + ' '+ source.RequestingEmployee.Person.lastName}, // Aggiungi mappatura se necessario
        RequestState: RequestStatus.find(p=>p.id===source.RequestState) || {id:0,name:'Seleziona Stato'},
        Priority: RequestPriority.find(p=>p.id===source.Priority) || {id:0,name:'Seleziona Priorità'},
        Customer: { id: source.Customer.id, name: source.Customer.name },
        CustomerReferer: '', // Aggiungi mappatura se necessario
        ref_code: source.ref_code,
        id_code: source.id_code,
        Seniority: RequestSeniority.find(p=>p.id===source.Seniority) || {id:0,name:'Seleziona Seniority'},
        PrimarySkill: [], // Aggiungi mappatura se disponibile in RequestServer
        SecondarySkill: [], // Aggiungi mappatura se disponibile in RequestServer
        saleRate: source.saleRate,
        continuative: source.continuative,
        notes: source.notes,
        Location: {id:source.Location.id,name:source.Location.description},
        Profile:{id:source.CandidateProfile.id,name:source.CandidateProfile.description}
      };
    }
  }

export const requestAdapter = new RequestFieldsServerAdapter();