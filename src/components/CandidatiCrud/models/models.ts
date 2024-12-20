import { RequestServer } from "../../RichiesteCrud/models";
import { SkillsAi } from "./models-ai";

export interface OptionCandidateField {
  id: number | string;
  name: string;
}

export interface CandidateFields {

  id?: number,
  firstName: string,
  lastName: string,
  birthDate: string,
  phoneNumber?: string,
  email: string,
  residenza?: ResidenceFields,
  gender: OptionCandidateField,

  /*   residenza?: {
      country: { id: number; name: string; code: string };
      province?: { id: number; name: string; code: string };
      city: { id: number; name: string; code: string };
    }; */
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
  seniority?: OptionCandidateField,
  skills: SkillsAi[],
  languageSkills: SkillsAi[]

}


export interface CandidateSkills {

  seniority?: OptionCandidateField,
  skills?: SkillsAi[],
  languageSkills?: SkillsAi[]
}

export interface ResidenceFields {

  country: SubResidenceFields;
  province?: SubResidenceFields;
  city: SubResidenceFields;

}

export interface SubResidenceFields {
  id: number;
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

export interface CandidateProfile {
  id: number;
  code: string;
  description: string;
}

export interface CurrentContractType {
  id: number;
  code: string;
  description: string;
  dailyHours: number;
  fillTimesheet: boolean;
}

export interface RecruitingContact {
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

export interface SkillArea {
  id: number;
  code: string;
  name: string;
  description: string | null;
  skillCategory_id: number;
  date_created?: string; // ISO date string
  date_modified?: string; // ISO date string
}

export interface PersonSkillArea {
  person_id?: number | null;
  skillArea_id: number;
  SkillArea: SkillArea;
}


export interface Person {

  id: number;
  firstName: string;
  lastName: string;
  gender_id: number;
  Gender?: any | null;
  cityRes_id: number | null;
  CityRes: any | null,
  location_id: number | null;
  Location: any | null;
  phoneNumber: string | null;
  privateEmail: string | null;
  dateBirth: string; // ISO date string
  Attachment: any; //
  PersonSkillAreas: PersonSkillArea[];
  isActivity_104: boolean;
  Seniority: string | null;
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


export const CandidateGender = [
  {
    id: 1,
    name: 'M'
  },
  {
    id: 2,
    name: 'F'
  }
];