// formFields.ts
import { companyOption, contractTypeOption, RoleOption, WokeScopeOption } from '../../adapters/personaleAdapters';
import { AnagraficaData, TrattamentoEconomicoData, RuoliData, PermessiData, Permesso } from './modelForms';



export const getFormAnagraficaFields = (formData: AnagraficaData) => ({

    sede: {
        name: "sede",
        label: "Sede",
        type: "select",
        value: formData.sede || "",
        required: true,
        options: ["Barletta", "Milano", "Roma"],
        validator: (value: any) => value ? "" : "Il campo sede è obbligatorio",
    },
    nome: {
        name: "nome",
        label: "Nome",
        type: "text",
        value: formData.nome || "",
        required: true,
        validator: (value: any) => value ? "" : "Il campo Nome è obbligatorio",
    },
    cognome: {
        name: "cognome",
        label: "Cognome",
        type: "text",
        value: formData.cognome || "",
        required: true,
        validator: (value: any) => value ? "" : "Il campo Cognome è obbligatorio",
    },
    email: {
        name: "email",
        label: "Email Aziendale",
        type: "email",
        value: formData.email || "",
        required: true,
        validator: (value: any) => value ? "" : "Il campo Email Aziendale è obbligatorio",
    },
    matricola: {
        name: "matricola",
        label: "Matricola",
        type: "text",
        value: formData.matricola || "",
    },
    sesso: {
        name: "sesso",
        label: "Sesso",
        type: "select",
        value: formData.sesso || "",
        options: ["Femmina", "Maschio"],
    },
    Provincianascita: {
        name: "Provincianascita",
        label: "Provincia di Nascita",
        type: "text",
        value: formData.Provincianascita || "",
    },
    comuneNascita: {
        name: "comuneNascita",
        label: "Comune di Nascita",
        type: "text",
        value: formData.comuneNascita || "",
    },
    residenza: {
        name: "residenza",
        label: "Provincia di Residenza",
        type: "text",
        value: formData.residenza || "",
    },
    comuneResidenza: {
        name: "comuneResidenza",
        label: "Comune di Residenza",
        type: "text",
        value: formData.comuneResidenza || "",
    },
    indirizzoResidenza: {
        name: "indirizzoResidenza",
        label: "Indirizzo di Residenza",
        type: "text",
        value: formData.indirizzoResidenza || "",
    },
    dataNascita: {
        name: "dataNascita",
        label: "Data di Nascita",
        type: "date",
        value: formData.dataNascita || "",
    },
    cap: {
        name: "cap",
        label: "CAP di Residenza",
        type: "number",
        spinners: false,
        value: formData.cap || 0,
    },
    cellulare: {
        name: "cellulare",
        label: "Cellulare",
        type: "number",
        value: formData.cellulare || 0,
    },
    telefonoCasa: {
        name: "telefonoCasa",
        label: "Telefono di Casa",
        type: "number",
        inputType: "tel",
        value: formData.telefonoCasa || 0,
    },
    telefonoLavoro: {
        name: "telefonoLavoro",
        label: "Telefono di Lavoro",
        type: "number",
        value: formData.telefonoLavoro || 0,
    },
    emailPrivata: {
        name: "emailPrivata",
        label: "Email Privata",
        type: "email",
        value: formData.emailPrivata || "",
    },
    iban: {
        name: "iban",
        label: "IBAN",
        type: "text",
        value: formData.iban || "",
    },
    codiceFiscale: {
        name: "codiceFiscale",
        label: "Codice Fiscale",
        type: "text",
        value: formData.codiceFiscale || "",
    },
});

export const getFormTrattamentoEconomicoFields = (formData: TrattamentoEconomicoData, wokeScope:WokeScopeOption[],contractType:contractTypeOption[],company: companyOption[]) => {
    const wokeScopeOptions = wokeScope.map(scope => scope.label);
    const contractTypeOptions = contractType.map(contract => contract.label);
    const companyOptions = company.map(company => company.label);

    const fields = {
        tipologiaContratto: {
            name: "tipologiaContratto",
            label: "Tipologia di Contratto di Lavoro",
            type: "select",
            value: formData.tipologiaContratto || "",
            options: contractTypeOptions
        },
        societa: {
            name: "societa",
            label: "Società",
            type: "select",
            value: formData.societa || "",
            options: companyOptions
        },
        tipoAmbitoLavorativo: {
            name: "tipoAmbitoLavorativo",
            label: "Ambito Lavorativo",
            type: "select",
            value: formData.tipoAmbitoLavorativo || "",
            options: wokeScopeOptions,
        },
        dataInizioTrattamento: {
            name: "dataInizioTrattamento",
            label: "Data di Inizio del Trattamento",
            type: "date",
            value: formData.dataInizioTrattamento || "",
        },
        costoGiornaliero: {
            name: "costoGiornaliero",
            label: "Costo Giornaliero",
            type: "number",
            spinners: false,
            value: formData.costoGiornaliero || 0,
        },
        dataAssunzione: {
            name: "dataAssunzione",
            label: "Data Assunzione",
            type: "date",
            value: formData.dataAssunzione || "",
        },
        scadenzaEffettiva: {
            name: "scadenzaEffettiva",
            label: "Scadenza Effettiva",
            type: "date",
            value: formData.scadenzaEffettiva || "",
        },
        dataRecesso: {
            name: "dataRecesso",
            label: "Data del Recesso",
            type: "date",
            value: formData.dataRecesso || "",
        },
        motivazioneCessazione: {
            name: "motivazioneCessazione",
            label: "Motivazione della Cessazione",
            type: "textarea",
            value: formData.motivazioneCessazione || "",
        },
        trasformazioni: {
            name: "trasformazioni",
            label: "Trasformazioni",
            type: "textarea",
            value: formData.trasformazioni || "",
        },
        ccnl: {
            name: "ccnl",
            label: "CCNL",
            type: "text",
            value: formData.ccnl || "",
        },
        ral: {
            name: "ral",
            label: "RAL",
            type: "number",
            value: formData.ral || 0,
        },
        trasferta: {
            name: "trasferta",
            label: "Trasferta",
            type: "number",
            spinners: false,
            value: formData.trasferta || 0,
        },
        buoniPasto: {
            name: "buoniPasto",
            label: "Buoni Pasto",
            type: "number",
            spinners: false,
            value: formData.buoniPasto || 0,
        },
        nettoMese: {
            name: "nettoMese",
            label: "Netto del mese",
            type: "number",
            spinners: false,
            value: formData.nettoMese || 0,
        },
        costoAnnuale: {
            name: "costoAnnuale",
            label: "Costo Annuo",
            type: "number",
            spinners: false,
            value: formData.costoAnnuale || 0,
        },
        tariffaVendita: {
            name: "tariffaVendita",
            label: "Tariffa di Vendita",
            type: "number",
            spinners: false,
            value: formData.tariffaVendita || 0,
        },
        note: {
            name: "note",
            label: "Note",
            type: "textarea",
            value: formData.note || "",
        },
    }
    return fields

};


export const getFormRuoliFields = (formData: RuoliData, roles: RoleOption[]) => {

    const fields = {
        ADM: {
            name: "ADM",
            label: roles.find(role => role.name === 'ADM')?.label || 'Admin',
            type: "checkbox",
            value: formData.ADM || false,
        },
        AMMI: {
            name: "AMMI",
            label: roles.find(role => role.name === 'AMMI')?.label || 'Amministrazione',
            type: "checkbox",
            value: formData.AMMI || false,
        },
        COM: {
            name: "COM",
            label: roles.find(role => role.name === 'COM')?.label || 'Commerciale',
            type: "checkbox",
            value: formData.COM || false,
        },
        DIP: {
            name: "DIP",
            label: roles.find(role => role.name === 'DIP')?.label || 'Dipendente',
            type: "checkbox",
            value: formData.DIP || false,
        },
        LEA: {
            name: "LEA",
            label: roles.find(role => role.name === 'LEA')?.label || 'Capo Progetto',
            type: "checkbox",
            value: formData.LEA || false,
        },
        REC: {
            name: "REC",
            label: roles.find(role => role.name === 'REC')?.label || 'Recruiter',
            type: "checkbox",
            value: formData.REC || false,
        },
        RP: {
            name: "RP",
            label: roles.find(role => role.name === 'RP')?.label || 'Resp. Personale',
            type: "checkbox",
            value: formData.RP || false,
        },
        SEG: {
            name: "SEG",
            label: roles.find(role => role.name === 'SEG')?.label || 'Segreteria',
            type: "checkbox",
            value: formData.SEG || false,
        },
        RISEXT: {
            name: "RISEXT",
            label: roles.find(role => role.name === 'RISEXT')?.label || 'Risorsa esterna',
            type: "checkbox",
            value: formData.RISEXT || false,
        },
        ADD_CENS: {
            name: "ADD_CENS",
            label: roles.find(role => role.name === 'ADD_CENS')?.label || 'Addetto censimento',
            type: "checkbox",
            value: formData.ADD_CENS || false,
        },
        TESTROLE2: {
            name: "TESTROLE2",
            label: roles.find(role => role.name === 'TESTROLE2')?.label || 'TestEditUpdateThird',
            type: "checkbox",
            value: formData.TESTROLE2 || false,
        }
    };

    return fields;
};


export const getFormPermessiFields = (formData: PermessiData) => {
    const permessi: { label: string; value: Permesso }[] = [
        { label: "Malattia", value: "malattia" },
        { label: "Permesso", value: "permesso" },
        { label: "Ferie", value: "ferie" },
        { label: "Permesso 104", value: "permesso104" },
        { label: "Maternità", value: "maternita" },
        { label: "Congedo Paternità", value: "congedoPaternita" },
        { label: "Permessi per lutto", value: "permessiPerLutto" }
    ];

    const fields = permessi.reduce((acc, permesso) => {
        acc[permesso.value] = {
            name: permesso.value,
            label: permesso.label,
            type: "checkbox",
            value: formData[permesso.value] || false,
            required: false
        };
        return acc;
    }, {} as { [key in Permesso]: any });

    return fields;
};