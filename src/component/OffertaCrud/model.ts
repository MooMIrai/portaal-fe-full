import { locationOption } from "../../adapters/offertaAdapters";
import { CustomerBEModel } from "../ClienteCrud/model";

export interface OfferTypeBE {
  id: number;
  code: string;
  description: string;
}
export type FilesModel = {
  file_name?: string;
  uniqueRecordIdentifier?:string;
  content_type?: string; // Estensione del file, opzionale
  data?: number[]; // Array di byte del contenuto del file
  size?: number; // Dimensione del file
  uid?: string; // Identificativo univoco del file
};
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
  year?: number;
  location_id: number;
  Attachment?: FilesModel[]
  files?: FilesModel[];
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
  existingFile?: Array<{
    id?:string;
    name?: string;
  }>;
  attachment?: Array<{
    id?:string;
    name?: string;
    extension?: string;
    data?: number[]; // Array di byte se necessario
  }>;
  attachment_id?: number;

  outcome_type?: { id: string; name: string };
  year?: Date;
  days?: number;
  orderNum?:string;
}
export interface Projects {
  start_date: Date;
  end_date?: Date;
  orderNum?:string;
}