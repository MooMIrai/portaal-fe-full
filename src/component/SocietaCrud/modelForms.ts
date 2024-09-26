

export interface CompanyModel {
    id?: number;
    name: string;
    code?: string | null;
    phoneNumber?: string;
    address?: string;
    province_id?: number | null;
    country_id?: number;
    zipCode?: string;
    taxCode?: string;
    vatNumber?: string;
    city_id?: number | null;
    sede?:{country:{id:number,name:string,code:string},province?:{id:number,name:string,code:string},city:{id:number,name:string,code:string}},
        
}

interface Province {
    id: number;
    city_abbreviation: string;
    code: string;
    name: string;
    province_id: number;
    country_id: number;
    isProvince: boolean;
  }
  
  // Interfaccia per la città
  interface City {
    id: number;
    city_abbreviation: string;
    code: string;
    name: string;
    province_id: number;
    country_id: number;
    isProvince: boolean;
    Province?: Province; // Opzionale, in quanto potrebbe non essere presente in tutti i casi
  }
  
  // Interfaccia per il paese
  interface Country {
    id: number;
    code: string;
    name: string;
  }

export interface CompanyModelBe{
    id?: number;
    name: string;
    code?: string | null;
    phoneNumber?: string;
    address?: string;
    province_id?: number | null;
    country_id?: number;
    zipCode?: string;
    taxCode?: string;
    vatNumber?: string;
    city_id?: number | null;
    City?: City;
    Country?: Country;
    Province?:Province;
   
}