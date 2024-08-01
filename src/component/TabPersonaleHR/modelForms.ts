
export interface AnagraficaData {
    person_id?:any;
    sede?: any;
    nome?: string;
    cognome?: string;
    email?: string;
    matricola?: string;
    sesso?: any;
    Provincianascita?: string;
    comuneNascita?: string;
    residenza?: string;
    comuneResidenza?: string;
    indirizzoResidenza?: string;
    dataNascita?: any;
    cap?: number;
    cellulare?: number;
    telefonoCasa?: number;
    telefonoLavoro?: number;
    emailPrivata?: string;
    iban?: string;
    note?:string;
    codiceFiscale?: string;
    accountStatus_id?:any;
}

export interface TrattamentoEconomicoData {
    id?:any;
    tipologiaContratto?: any;
    societa?: any;
    tipoAmbitoLavorativo?: any;
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
    buoniPasto?: number;
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

/* export const roleMap: { [key: number]: keyof RuoliData } = {
    1: 'admin',
    2: 'amministrazione',
    3: 'commerciale',
    4: 'dipendente',
    5: 'capo_progetto',
    6: 'recruiter',
    7: 'resp_personale',
    8: 'segreteria',
    9: 'risorsa_esterna',
    10: 'addetto_censimento'
}; */

export interface PermessiData {
    [key: string]: boolean;
    HMA?: any;        // Malattia
    HPE?: any;        // Permesso
    HFE?: any;        // Ferie
    HPE_104?: any;    // Permesso 104
    MAT?: any;        // Maternità
    HCPT?: any;       // Congedo Paternità
    LUT?: any;        // Permessi per lutto
    CMATR?:any;      // Congedo Matrimoniale
  }
  

export type Permesso = 'malattia' | 'permesso' | 'ferie' | 'permesso104' | 'maternita' | 'congedoPaternita' | 'permessiPerLutto';