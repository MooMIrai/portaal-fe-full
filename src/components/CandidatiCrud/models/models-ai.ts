
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
    skills: SkillsAi[]
}

export interface SkillsAi {
    id: number
    code: string
    name: string
    skillCategory_id: number

}

// Recruiting
export interface SkillDetailsRecruiting {
    type: string; // enum primary, secondary, languages 
    skills: SkillsAi[];
  }
  export interface RecruitingSkillArea {
  
    seniority?: string | null;  // enum
    profileType?: string | null; // enum
    skillDetails: SkillDetailsRecruiting[];
  
  }


