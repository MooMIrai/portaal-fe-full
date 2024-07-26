// types.ts
export interface AnagraficaData {
    sede?: string;
    nome?: string;
    cognome?: string;
    email?: string;
    matricola?: string;
    sesso?: string;
    Provincianascita?: string;
    comuneNascita?: string;
    residenza?: string;
    comuneResidenza?: string;
    indirizzoResidenza?: string;
    dataNascita?: string;
    cap?: number;
    cellulare?: number;
    telefonoCasa?: number;
    telefonoLavoro?: number;
    emailPrivata?: string;
    iban?: string;
    codiceFiscale?: string;
}

export interface TrattamentoEconomicoData {
    tipologiaContratto?: string;
    societa?: string;
    tipoAmbitoLavorativo?: string;
    dataInizioTrattamento?: string;
    costoGiornaliero?: number;
    dataAssunzione?: string;
    scadenzaEffettiva?: string;
    dataRecesso?: string;
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
    ruolo?: string;
    // Add other fields as needed
}
