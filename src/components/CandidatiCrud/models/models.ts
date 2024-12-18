import { RequestServer } from "../../RichiesteCrud/models";

export interface OptionCandidateField {
    id: number|string;
    name: string;
}

export interface CandidateFields {

    firstName: string,
    lastName: string,
    birthDate: string,
    phoneNumber?: string,
    email: string,
    residenza?: ResidenceFields,
    sede?: OptionCandidateField,
    ral?: number,
    ralMin?: number,
    ralMax?: number,
    notice?: number,
    note?: string,
    profile_autocomplete?: OptionCandidateField,
    profile_type?: string,
    willingToTransfer: boolean,
    isActivity_104: boolean,
    contract_type?: OptionCandidateField,
    seniority?: OptionCandidateField

}

  export interface ResidenceFields {
    
    country?: SubResidenceFields;
    province?: SubResidenceFields;
    city?: SubResidenceFields;

  }

  export interface SubResidenceFields {
    id?: number;
    name?: string;
    code?: string;
  }

  export interface CandidateServer {
    id: number;
    Person: Person;
    currentRAL: number;
    minRequiredRAL: number;
    maxRequiredRAL: number;
    notice?: number;
    notes: string;
    candidateProfile_id: number;
    CandidateProfile: CandidateProfile;
    currentContractType_id: number;
    currentContractType: CurrentContractType;
    profileType: string;
    willingToTransfer: boolean;
    // RecruitingAssignments: RecruitingAssignment[];
  }
  
  interface CandidateProfile {
    id: number;
    code: string;
    description: string;
  }
  
  interface CurrentContractType {
    id: number;
    code: string;
    description: string;
    dailyHours: number;
    fillTimesheet: boolean;
  }
  
  interface RecruitingContact {
    id: number;
    assignment_id: number;
    date_log: string; // ISO date string
    ContactType: string;
    notes: string | null;
    user_created: string;
    user_modified: string;
    date_created: string; // ISO date string
    date_modified: string; // ISO date string
  }
  
  /* interface RecruitingSendCv {
    id: number;
    assignment_id: number;
    date_log: string; // ISO date string
    notes: string | null;
    OutComeType: string;
    user_created: string;
    user_modified: string;
    date_created: string; // ISO date string
    date_modified: string; // ISO date string
  } */
  
  /* interface RecruitingAssignment {
    id: number;
    candidate_id: number;
    request_id: number;
    hiring_date: string; // ISO date string
    user_created: string;
    user_modified: string;
    date_created: string; // ISO date string
    date_modified: string; // ISO date string
    Candidate: CandidateServer;
    Request: RequestServer;
    RecruitingContact: RecruitingContact;
    RecruitingInterview: any[]; // Define as needed
    RecruitingFinalEvaluation: any | null; // Define as needed
    RecruitingOffer: any | null; // Define as needed
    RecruitingSendCv: RecruitingSendCv | null;
    RecruitingSendContract: any | null; // Define as needed
  } */

  interface SkillArea {
    id: number;
    code: string;
    name: string;
    description: string | null;
    skillCategory_id: number;
    date_created: string; // ISO date string
    date_modified: string; // ISO date string
  }
  
  interface PersonSkillArea {
    person_id: number;
    skillArea_id: number;
    SkillArea: SkillArea;
  }
  
  interface Person {

    id: number;
    firstName: string;
    lastName: string;
    cityRes_id: number | null;
    location_id: number | null;
    phoneNumber: string | null;
    privateEmail: string | null;
    dateBirth: string; // ISO date string
    Attachment: any; //
    PersonSkillAreas: PersonSkillArea[];
    isActivity_104: boolean;
    Seniority: string;
    date_created: string; // ISO date string
    date_modified: string; // ISO date string
    user_created: string;
    user_modified: string;

    /* phoneNumber2: string | null;
    address: string | null;
    files: any[]; // Define as needed
    bankAddress: string | null;
    zipCode: string;
    taxCode: string;
    vatNumber: string;
    employee_id: string;
    note: string;
    cityBirth_id: number | null;
    gender_id: number;
    isExternal: boolean;
    data: any | null; // Define as needed
    */
    
  }
  