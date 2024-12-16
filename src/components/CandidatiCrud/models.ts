import { RequestServer } from "../RichiesteCrud/models";

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
    residenza?: any,
    sede?: OptionCandidateField,
    ral?: number,
    ralMin?: number,
    ralMax?: number,
    notice?: number,
    note?: string,
    profile_autocomplete?: OptionCandidateField,
    profile_type?: string,
    willingToTransfer: boolean,
    assistance_104: boolean,
    contract_type?: OptionCandidateField,
    seniority?: OptionCandidateField

}

  export interface CandidateServer {
    id: number;
    person_id: number;
    willingToTransfer: boolean;
    candidateProfile_id: number;
    profileType: string;
    currentRAL: number;
    minRequiredRAL: number;
    maxRequiredRAL: number;
    notice: string;
    currentContractType_id: number;
    notes: string;
    CandidateProfile: CandidateProfile;
    currentContractType: CurrentContractType;
    RecruitingAssignments: RecruitingAssignment[];
    Person: Person;
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
  
  interface RecruitingSendCv {
    id: number;
    assignment_id: number;
    date_log: string; // ISO date string
    notes: string | null;
    OutComeType: string;
    user_created: string;
    user_modified: string;
    date_created: string; // ISO date string
    date_modified: string; // ISO date string
  }
  
  interface RecruitingAssignment {
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
  }

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
    phoneNumber: string | null;
    phoneNumber2: string | null;
    address: string | null;
    privateEmail: string | null;
    dateBirth: string; // ISO date string
    bankAddress: string | null;
    zipCode: string;
    taxCode: string;
    vatNumber: string;
    employee_id: string;
    note: string;
    cityBirth_id: number | null;
    cityRes_id: number | null;
    gender_id: number;
    isExternal: boolean;
    data: any | null; // Define as needed
    date_created: string; // ISO date string
    date_modified: string; // ISO date string
    user_created: string;
    user_modified: string;
    location_id: number | null;
    Seniority: string;
    files: any[]; // Define as needed
    PersonSkillAreas: PersonSkillArea[];
  }
  