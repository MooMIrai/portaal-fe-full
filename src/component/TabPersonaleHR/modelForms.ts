
export interface AnagraficaData {
    person_id?:any;
    sede?: any; //sia per il name dell'autocomplete che per la select
    nome?: string;
    cognome?: string;
    email?: string;
    matricola?: string;
    sesso?: any;
    stato?:any;
    //Provincianascita?: string;
    //comuneNascita?: string;
    //residenza?: string;
    //comuneResidenza?: string;
    indirizzoResidenza?: string;
    dataNascita?: any;
    
    residenza?:{country:number,province:number,city:number},
    nascita?:{country:number,province:number,city:number},

    cap?: number;
    cellulare?: number;
    telefonoCasa?: number;
    telefonoLavoro?: number;
    emailPrivata?: string;
    iban?: string;
    note?:string;
    città?:any;
    codiceFiscale?: string;
    accountStatus_id?:any;
    partitaIva?:number;
    sede_autocomplete_id?:number;
    sede_autocomplete?:{id:number,name:string},
}

export interface TrattamentoEconomicoData {
    id?:any;
    tipologiaContratto?: any;
    tipologiaContratto_autocomplete?:{id:number,name:string},
    tipologiaContratto_id?:number,
    societa?: any;
    tipoAmbitoLavorativo?: any; //name e per la select
    tipoAmbitoLavorativo_autocomplete?:{id:number,name:string},
    tipoAmbitoLavorativo_autocomplete_id?:number,
    dataInizioTrattamento?: any;
    costoGiornaliero?: number;
    dataAssunzione?: any;
    scadenzaEffettiva?: any;
    dataRecesso?: any;
    motivazioneCessazione?: string;
    trasformazioni?: string;
    ccnl?: string;
    ral?: number;
    trasferta?: number;
    buoniPasto?: string;
    nettoMese?: number;
    costoAnnuale?: number;
    tariffaVendita?: number;
    note?: string;
}

export interface RuoliData {
    [key: string]: boolean;
    ADM?: any
    AMMI?: any;
    COM?: any;
    DIP?: any;
    LEA?: any;
    REC?: any;
    RP?:any;
    SEG?:any;
    RISEXT?:any;
   ADD_CENS?:any;
   TESTROLE2?:any;
}


export interface PermessiData {
    [key: string]: boolean;
    HMA?: any;        // Malattia
    HPE?: any;        // Permesso
    HFE?: any;        // Ferie
    HPE_104?: any;    // Permesso 104
    MAT?: any;        // Maternità
    HCPT?: any;       // Congedo Paternità
    LUT?: any;        // Permessi per lutt
    CMATR?:any;      // Congedo Matrimoniale
  }
  
