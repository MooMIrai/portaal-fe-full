export interface OfferBEModel{
    id?:number,
    project_code: string,
    name: string,
    start_date: string,
    end_date: string,
    other_details: string,
    rate: 0,//?
    amount: 0,//?
    customer_id: number,
    accountManager_id: number,
    project_type_id: number,
    billing_type: number
      
}

export interface OfferModel{
    id?:number,
    protocol: string,
    title: string,
    start_date: string,
    end_date: string,
    description: string,
    rate: 0,//?
    amount: 0,//?
    customer_id: number,
    accountManager_id: number,
    project_type_id: number,
    billing_type_id: number
      
}