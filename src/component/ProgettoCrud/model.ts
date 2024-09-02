import { OfferBEModel } from "../OffertaCrud/model";

export interface ProjectBEModel{
    id: number,
    active: boolean,
    Offer?:OfferBEModel
}

export interface ProjectModel{
    id: number,
    active: boolean,
    account_manager:string,
    title:string,
    start_date:Date,
    end_date:Date,
    amount:number,
    protocol:string,
    description?:string
}