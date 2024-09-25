import { locationOption } from "../../adapters/offertaAdapters";
import { CustomerBEModel } from "../ClienteCrud/model";

export interface OfferTypeBE {
  id: number;
  code: string;
  description: string;
}

export interface OfferBEModel {
  id?: number;
  accountManager_id?: number;
  amount: number;
  billing_type: string;
  customer_id?: number;
  date_created?: string;
  name: string;
  other_details: string;
  project_code: string;
  project_type_id?: number;
  rate: number;
 Project?:any;
  OutcomeType?: string;
  ProjectType?: OfferTypeBE;
  Customer?: CustomerBEModel;
  days?: number;
  AccountManager?: {
    account_status_id: number;
    email: string;
    id: string;
    person_id: string;
    Person: any;
  };
  attachment_id?:number;
  year: number;
  location_id: number;
  Attachment?: {
    file_name: string;
    content_type?: string;
    data?: number[];
  };
  skill_ids?: number[];
  noCollective?: boolean;
  approval_date?: string;
  deadline_date?: string;
  start_date?:string;
  end_date?:string;
  orderNum?:string;

}

export interface OfferModel {
  id?: number;
  protocol: string;
  title: string;
  start_date?: Date;
  end_date?: Date;
  creation_date?: Date;
  description: string;
  rate: number;
  thereisProject?:boolean;
  amount: number;
  customer_id: number;
  customer_name?: string;
  customer?: { id: number; name: string };
  location_id:number
  location?: { id: number; name: string };
  accountManager_id: number;
  accountManager_name?: string;
  locations?:locationOption[]
  accountManager?: { id: number; name: string };
  NoCollective?: boolean;
  billing_type?: { id: string; name: string };
  approval_date?: Date;
  project_type?: { id: number; name: string };
  project_type_id: number;
  attachment?: [
    {
      extension?: string;
      name: string;
      data?: number[];
    }
  ];
  attachment_id?: number;
  existingFile?: { name: string };
  outcome_type?: { id: string; name: string };
  year: Date;
  days?: number;
  orderNum?:string;
}
export interface Projects {
  start_date: Date;
  end_date?: Date;
  orderNum?:string;
}