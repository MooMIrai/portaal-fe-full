import { SkillsAi } from "../CandidatiCrud/models/models-ai";

export interface OptionRequestField {
    id: number|string;
    name: string;
}

export interface RequestFields {
    ReferrerHr: OptionRequestField;
    RequestState: OptionRequestField;
    Priority: OptionRequestField;
    Customer: OptionRequestField;
    CustomerReferer: string;
    ref_code: string; // Tipizzato direttamente per coerenza
    id_code: string; // Tipizzato direttamente per coerenza
    Seniority: OptionRequestField;
    PrimarySkill: SkillsAi[];
    SecondarySkill: SkillsAi[];
    LanguagesSkill: SkillsAi[];
    saleRate: number | null;
    continuative: boolean;
    notes: string;
    Location: OptionRequestField,
    Profile:OptionRequestField
}

  

export interface RequestServer {
    id: number;
    requestingEmployee_id: number;
    RequestState: string;
    Priority: string;
    customer_id: number;
    ref_code: string;
    location_id: number;
    id_code: string;
    WorkModel: string;
    candidateProfile_id: number;
    profileType: string;
    Seniority: string;
    notes: string;
    saleRate: number;
    continuative: boolean;
    //tenant_code: string;
    RequestingEmployee: RequestingEmployee;
    Customer: Customer;
    Location: Location;
    CandidateProfile: CandidateProfile;
    Skills: Skill[];
  }
  
   interface RequestingEmployee {
    id: number;
    email: string;
    person_id: number;
    accountStatus_id: number | null;
    Person: Person;
  }
  
   interface Person {
    id: number;
    firstName: string;
    lastName: string;
    privateEmail: string | null;
    dateBirth: string; // ISO date format
    isExternal: boolean;
    Seniority: string | null;

  }
  
   interface Customer {
    id: number;
    customer_code: string;
    name: string;
  }
  
   interface Location {
    id: number;
    code: string;
    description: string;
    city_id: number;
  }
  
   interface CandidateProfile {
    id: number;
    code: string;
    description: string;
  }
  
  // non usata
   class Skill {
    // Assuming skills have properties; adjust if needed
  }
  

  export const RequestSeniority = [
    {
        id:'J',
        name:'Junior'
    },
    {
        id:'J_A',
        name:'Junior advanced'
    },
    {
        id:'M',
        name:'Middle'
    },
    {
        id:'M_A',
        name:'Middle advanced'
    },
    {
        id:'S',
        name:'Senior'
    },
    {
        id:'S_A',
        name:'Senior advanced'
    }
];

export const RequestPriority = [
        {
            id:'L',
            name:'Bassa'
        },
        {
            id:'M',
            name:'Media'
        },
        {
            id:'H',
            name:'Alta'
        },
        {
            id:'U',
            name:'Urgente'
        }
    ];

export const RequestStatus = [
        {
            id:'A',
            name:'Aperta'
        },
        {
            id:'S',
            name:'Sospesa'
        },
        {
            id:'C',
            name:'Chiusa'
        },
        {
            id:'E',
            name:'Eliminata'
        }
    ];