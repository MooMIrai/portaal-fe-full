export interface CustomerModel{
    id?:number,
    customer_code:string;
    name:string;
    vatNumber?:string;
    website?:string;
    email?:string;
    phone?:string;
    fax?:string;
    address?:string;
    zipCode?:string;
    city?:string | number;
    discountPerc?:number;
}

export interface CustomerBEModel {
    id?:number,
    customer_code: string;
    name: string;
    phoneNumber?: string;
    web_site?: string;
    fax?: string;
    email?: string;
    note?: string;
    address?: string;
    city?: string;
    province?: string;
    state?: string;
    zipCode?: string;
    taxCode?: string;
    vatNumber?: string;
    data?: Record<string, any>;
  }