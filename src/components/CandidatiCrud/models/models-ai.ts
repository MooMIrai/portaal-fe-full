import { SkillArea } from "./models"

// Candidate
export interface CandidateAi {

    firstName: string
    lastName: string
    dateBirth: string
    country_id: number
    province_id: number
    cityRes_id: number | null
    phoneNumber?: string
    email: string

}

export interface CandidateSkillsAi {

    data: ContentSkill
    warning: string[]
    error: string[]

}
export interface ContentSkill {
    seniority: string
    skills: SkillArea[]
}


// Recruiting Ai
export interface SkillDetailsRecruiting {
    type: string; // enum primary, secondary, languages 
    skills: SkillArea[];
  }
  export interface RecruitingSkillAreaAi {
  
    seniority?: string | null;  // enum
    profileType?: string | null; // enum
    id_code?: string | null;
    candidateProfile_id?:number|null; 
    skillDetails: SkillDetailsRecruiting[];
  
  }


