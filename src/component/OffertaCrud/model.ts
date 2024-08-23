import { CustomerBEModel } from "../ClienteCrud/model"

export interface OfferTypeBE {
    id: number,
    code: string,
    description: string 
}

export interface OfferBEModel {
    id?:number,
    accountManager_id:number,
    amount:number,
    billing_type:string,
    customer_id:number
    date_created?:string,
    end_date?:string,
    name:string,
    other_details:string,
    project_code:string,
    project_type_id:number,
    rate:number,
    start_date:string,
    OutcomeType?:string,
    ProjectType?:OfferTypeBE,
    Customer?: CustomerBEModel,
    AccountManager?: {
        account_status_id: number,
        email: string,
        id: string,
        person_id: string,
        Person:any
    }
    
}

export interface OfferModel {
    id?: number,
    protocol: string,
    title: string,
    start_date: Date,
    end_date?: Date,
    creation_date?:Date,
    description: string,
    rate: number,
    amount: number,
    customer_id: number,
    customer_name?: string,
    customer?:{id:number,name:string},

    accountManager_id: number,
    accountManager_name?: string,
    accountManager?:{id:number,name:string},
    
    billing_type?:{id:string,name:string},

    project_type?:{id:number,name:string},
    project_type_id: number,
    
    outcome_type?:{id:string,name:string}
}