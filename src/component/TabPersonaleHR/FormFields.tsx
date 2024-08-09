// formFields.ts
import { ActivityTypeOption, cityTypeOption, companyOption, contractTypeOption, countryOption, genderOption, RoleOption, WokeScopeOption } from '../../adapters/personaleAdapters';
import { AnagraficaData, TrattamentoEconomicoData, RuoliData, PermessiData } from './modelForms';



export const getFormAnagraficaFields = (formData: AnagraficaData, gender: genderOption[],type: any,city: cityTypeOption[],country:countryOption[]) => {
    const genderOptions = gender.map(company => company.label)
    const cityOptions = city.map(city=> city.label)
    const countryOptions = country.map(country=> country.label)
    const onlyLettersValidator = (value: any) => /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(value) ? "" : "Il campo deve contenere solo lettere";

    const dateValidator = (value: any) => {
        if (!value) return "Il campo Data di Nascita è obbligatorio";
        const selectedDate = new Date(value);
        const currentDate = new Date();
        const adultDate = new Date();
        adultDate.setFullYear(currentDate.getFullYear() - 18);

        if (selectedDate >= currentDate) {
            return "La data di nascita non può essere una data futura o la data di oggi";
        }
        if (selectedDate > adultDate) {
            return "L'età deve essere maggiore di 18 anni";
        }
        return "";
    };


    const optionalCapValidator = (value: any) => {
        if (!value) return true;
        return /^[0-9]{5}$/.test(value);
    };

    const optionalCellulareValidator = (value: any) => {
        if (!value) return true;
        return /^(\+?\d{1,4}\s?\d{7,15}|00\d{1,4}\s?\d{7,15})$/.test(value);

    };

    const optionalTelefonoCasaValidator = (value: any) => {
        if (!value) return true;
        return /^(0\d{1,4}\d{5,9}|\+39\s?0\d{1,4}\d{5,9})$/.test(value);
    };
    const fields = {
        sede: {
            name: "sede",
            label: "Sede",
            type: "select",
            value: formData.sede || "",
            required: true,
            disabled:type === "view",
            options: ["Barletta", "Milano", "Roma"],
            validator: (value: any) => value ? "" : "Il campo sede è obbligatorio",
        },
        nome: {
            name: "nome",
            label: "Nome",
            type: "text",
            value: formData.nome || "",
            required: true,
            disabled:type === "view",
            validator: (value: any) => value ? onlyLettersValidator(value) : "Il campo Nome è obbligatorio",
        },
        cognome: {
            name: "cognome",
            label: "Cognome",
            type: "text",
            value: formData.cognome || "",
            disabled:type === "view",
            required: true,
            validator: (value: any) => value ? onlyLettersValidator(value) : "Il campo Cognome è obbligatorio",
        },
        email: {
            name: "email",
            label: "Email Aziendale",
            type: "email",
            value: formData.email || "",
            required: true,
            disabled:type === "view",
            validator: (value: any) => value ? "" : "Il campo Email Aziendale è obbligatorio",
        },
        matricola: {
            name: "matricola",
            label: "Matricola",
            type: "text",
            disabled:type === "view",
            value: formData.matricola || "",
        },
        sesso: {
            name: "sesso",
            label: "Sesso",
            type: "select",
            disabled:type === "view",
            value: formData.sesso || "",
            require:true,
            options: genderOptions,
            validator: (value: any) => value ? "" : "Il campo sesso è obbligatorio",
        },
        stato:{
            name:"stato",
            label:"Stato",
            type:"select",
            disabled:type === "view",
            value: formData.stato || "",
            options:countryOptions
        },
        Provincianascita: {
            name: "Provincianascita",
            label: "Provincia di Nascita",
            type: "text",
            disabled:type === "view",
            value: formData.Provincianascita || "",
        },
        comuneNascita: {
            name: "comuneNascita",
            label: "Comune di Nascita",
            type: "text",
            disabled:type === "view",
            value: formData.comuneNascita || "",
        },
        residenza: {
            name: "residenza",
            label: "Provincia di Residenza",
            type: "text",
            disabled:type === "view",
            value: formData.residenza || "",
        },
        comuneResidenza: {
            name: "comuneResidenza",
            label: "Comune di Residenza",
            type: "text",
            value: formData.comuneResidenza || "",
        },
        cittaResidenza: {
            name: "cittàResidenza",
            label: "Città di Residenza",
            type: "select",
            value: formData.città || "",
            options: cityOptions,
        },
        indirizzoResidenza: {
            name: "indirizzoResidenza",
            label: "Indirizzo di Residenza",
            type: "text",
            disabled:type === "view",
            value: formData.indirizzoResidenza || "",
        },
        dataNascita: {
            name: "dataNascita",
            label: "Data di Nascita",
            type: "date",
            disabled:type === "view",
            value: formData.dataNascita || "",
            required:true,
            validator: dateValidator,
        },
        cap: {
            name: "cap",
            label: "CAP di Residenza",
            type: "text",
            disabled:type === "view",
            value: formData.cap || 0,
            validator: (value: any) => optionalCapValidator(value) ? "" : "Il campo CAP deve contenere solo 5 numeri",
        },
        cellulare: {
            name: "cellulare",
            label: "Cellulare",
            type: "text",
            disabled:type === "view",
            value: formData.cellulare || 0,
            validator: (value: any) => optionalCellulareValidator(value) ? "" : "Il campo Cellulare deve essere nel formato +39XXXXXXXXXX o XXXXXXXXXX",
        },
        telefonoCasa: {
            name: "telefonoCasa",
            label: "Telefono di Casa",
            type: "text",
            disabled:type === "view",
            value: formData.telefonoCasa || 0,
            validator: (value: any) => optionalTelefonoCasaValidator(value) ? "" : "Il campo Telefono di Casa deve essere nel formato +0XXXXXXXXX",
        },
        telefonoLavoro: {
            name: "telefonoLavoro",
            label: "Telefono di Lavoro",
            type: "text",
            spinners:false,
            disabled:type === "view",
            value: formData.telefonoLavoro || 0,
            validator: (value: any) => optionalCellulareValidator(value) ? "" : "Il campo Telefono di Lavoro deve essere nel formato +39XXXXXXXXXX o XXXXXXXXXX",
        },
        emailPrivata: {
            name: "emailPrivata",
            label: "Email Privata",
            type: "email",
            disabled:type === "view",
            value: formData.emailPrivata || "",
        },
        iban: {
            name: "iban",
            label: "IBAN",
            type: "text",
            disabled:type === "view",
            value: formData.iban || "",
        },
        codiceFiscale: {
            name: "codiceFiscale",
            label: "Codice Fiscale",
            type: "text",
            disabled:type === "view",
            value: formData.codiceFiscale || "",
        },
        partitaIva:{
            name: "partitaIva",
            label: "Partita Iva",
            type: "text",
            disabled:type === "view",
            value: formData.partitaIva || "",
        }
    }
    return fields

};

export const getFormTrattamentoEconomicoFields = (formData:TrattamentoEconomicoData | null, wokeScope: WokeScopeOption[], contractType: contractTypeOption[], company: companyOption[],type:any,newFormContract?:boolean) => {
    const wokeScopeOptions = wokeScope.map(scope => scope.label);
    const contractTypeOptions = contractType.map(contract => contract.label);
    const companyOptions = company.map(company => company.label);
    console.log("formdata",formData)
 
    const optionalDateValidator = (field: string) => (value: any, formData: TrattamentoEconomicoData | null) => {
        if (!value) return true; 
        const selectedDate = new Date(value);
        const hireDate = new Date(formData?.dataAssunzione);
        const startDate = new Date(formData?.dataInizioTrattamento);

        if (selectedDate <= hireDate || selectedDate <= startDate) {
            return false;  
        }
        return true;
    };

    const fields = {
        tipologiaContratto: {
            name: "tipologiaContratto",
            label: "Tipologia di Contratto di Lavoro",
            type: "select",
            disabled:(type === "view"|| type === "edit" ) && !newFormContract,
            value: formData?.tipologiaContratto || "",
            required: true,
            validator: (value: any) => value ? "" : "Il campo Tipologia di Contratto è obbligatorio",
            options: contractTypeOptions
        },
        societa: {
            name: "societa",
            label: "Società",
            type: "select",
            disabled:(type === "view"|| type === "edit" ) && !newFormContract,
            value: formData?.societa || "",
         /*    required:true,
            validator: (value: any) => value ? "" : "Il campo Società è obbligatorio", */
            options: companyOptions
        },
        tipoAmbitoLavorativo: {
            name: "tipoAmbitoLavorativo",
            label: "Ambito Lavorativo",
            type: "select",
            disabled:(type === "view"|| type === "edit" ) && !newFormContract,
            value: formData?.tipoAmbitoLavorativo || "",
            required:true,
            validator: (value: any) => value ? "" : "Il campo Ambito Lavorativo è obbligatorio",
            options: wokeScopeOptions,
        },
        dataInizioTrattamento: {
            name: "dataInizioTrattamento",
            label: "Data di Inizio del Trattamento",
            type: "date",
            disabled:(type === "view"|| type === "edit" ) && !newFormContract,
            required:true,
            validator: (value: any) => value ? "" : "Il campo Data Inizio Trattamento è obbligatorio",
            value: formData?.dataInizioTrattamento || "",
        },
        costoGiornaliero: {
            name: "costoGiornaliero",
            label: "Costo Giornaliero",
            type: "number",
            spinners: false,
            disabled:(type === "view"|| type === "edit" ) && !newFormContract,
            required:true,
            validator: (value: any) => value ? "" : "Il campo Costo Giornaliero è obbligatorio",
            value: formData?.costoGiornaliero || 0,
        },
        dataAssunzione: {
            name: "dataAssunzione",
            label: "Data Assunzione",
            type: "date",
            disabled:(type === "view"|| type === "edit" ) && !newFormContract,
            value: formData?.dataAssunzione || "",
        },
        scadenzaEffettiva: {
            name: "scadenzaEffettiva",
            label: "Scadenza Effettiva",
            type: "date",
            disabled:(type === "view"|| type === "edit" ) && !newFormContract,
            value: formData?.scadenzaEffettiva || "",
            validator: (value: any) => optionalDateValidator("Scadenza Effettiva")(value, formData) ? "" : "Il campo Scadenza Effettiva non può essere lo stesso giorno o prima della Data di Assunzione o della Data di Inizio del Trattamento",
        },
        dataRecesso: {
            name: "dataRecesso",
            label: "Data del Recesso",
            type: "date",
            disabled:(type === "view"|| type === "edit" ) && !newFormContract,
            value: formData?.dataRecesso || "",
            validator: (value: any) => optionalDateValidator("Data del Recesso")(value, formData) ? "" : "Il campo Data del Recesso non può essere lo stesso giorno o prima della Data di Assunzione o della Data di Inizio del Trattamento",
        },
        motivazioneCessazione: {
            name: "motivazioneCessazione",
            label: "Motivazione della Cessazione",
            type: "textarea",
            disabled:(type === "view"|| type === "edit" ) && !newFormContract,
            value: formData?.motivazioneCessazione || "",
        },
        trasformazioni: {
            name: "trasformazioni",
            label: "Trasformazioni",
            type: "textarea",
            disabled:(type === "view"|| type === "edit" ) && !newFormContract,
            value: formData?.trasformazioni || "",
        },
        ccnl: {
            name: "ccnl",
            label: "CCNL",
            type: "text",
            disabled:(type === "view"|| type === "edit" ) && !newFormContract,
            value: formData?.ccnl || "",
        },
        ral: {
            name: "ral",
            label: "RAL",
            type: "number",
            spinners:false,
            disabled:(type === "view"|| type === "edit" ) && !newFormContract,
            value: formData?.ral || 0,
        },
        trasferta: {
            name: "trasferta",
            label: "Trasferta",
            type: "number",
            disabled:(type === "view"|| type === "edit" ) && !newFormContract,
            spinners: false,
            value: formData?.trasferta || 0,
        },
        buoniPasto: {
            name: "buoniPasto",
            label: "Buoni Pasto",
            type: "select",
            disabled:(type === "view"|| type === "edit" ) && !newFormContract,
            options: ["SI", "NO"],
            value: formData?.buoniPasto,
        },
        nettoMese: {
            name: "nettoMese",
            label: "Netto del mese",
            type: "number",
            disabled:(type === "view"|| type === "edit" ) && !newFormContract,
            spinners: false,
            value: formData?.nettoMese || 0,
        },
        costoAnnuale: {
            name: "costoAnnuale",
            label: "Costo Annuo",
            disabled:(type === "view"|| type === "edit" ) && !newFormContract,
            type: "number",
            spinners: false,
            value: formData?.costoAnnuale || 0,
        },
        tariffaVendita: {
            name: "tariffaVendita",
            label: "Tariffa di Vendita",
            type: "number",
            disabled:(type === "view"|| type === "edit" ) && !newFormContract,
            spinners: false,
            value: formData?.tariffaVendita || 0,
        },
        note: {
            name: "note",
            disabled:(type === "view"|| type === "edit" ) && !newFormContract,
            label: "Note",
            type: "textarea",
            value: formData?.note || "",
        },
    }
    return fields

};


export const getFormRuoliFields = (formData: RuoliData, roles: RoleOption[],type:any) => {
    const fields = {
        ADM: {
            name: "ADM",
            label: roles.find(role => role.name === 'ADM')?.label || 'Admin',
            type: "checkbox",
            disabled:type === "view",
            value: formData.ADM || false,
        },
        AMMI: {
            name: "AMMI",
            label: roles.find(role => role.name === 'AMMI')?.label || 'Amministrazione',
            type: "checkbox",
            disabled:type === "view",
            value: formData.AMMI || false,
        },
        COM: {
            name: "COM",
            label: roles.find(role => role.name === 'COM')?.label || 'Commerciale',
            type: "checkbox",
            disabled:type === "view",
            value: formData.COM || false,
        },
        DIP: {
            name: "DIP",
            label: roles.find(role => role.name === 'DIP')?.label || 'Dipendente',
            type: "checkbox",
            disabled:type === "view",
            value: formData.DIP || false,
        },
        LEA: {
            name: "LEA",
            label: roles.find(role => role.name === 'LEA')?.label || 'Capo Progetto',
            type: "checkbox",
            disabled:type === "view",
            value: formData.LEA || false,
        },
        REC: {
            name: "REC",
            label: roles.find(role => role.name === 'REC')?.label || 'Recruiter',
            type: "checkbox",
            disabled:type === "view",
            value: formData.REC || false,
        },
        RP: {
            name: "RP",
            label: roles.find(role => role.name === 'RP')?.label || 'Resp. Personale',
            type: "checkbox",
            disabled:type === "view",
            value: formData.RP || false,
        },
        SEG: {
            name: "SEG",
            label: roles.find(role => role.name === 'SEG')?.label || 'Segreteria',
            type: "checkbox",
            disabled:type === "view",
            value: formData.SEG || false,
        },
        RISEXT: {
            name: "RISEXT",
            label: roles.find(role => role.name === 'RISEXT')?.label || 'Risorsa esterna',
            type: "checkbox",
            disabled:type === "view",
            value: formData.RISEXT || false,
        },
        ADD_CENS: {
            name: "ADD_CENS",
            label: roles.find(role => role.name === 'ADD_CENS')?.label || 'Addetto censimento',
            type: "checkbox",
            disabled:type === "view",
            value: formData.ADD_CENS || false,
        },
        TESTROLE2: {
            name: "TESTROLE2",
            label: roles.find(role => role.name === 'TESTROLE2')?.label || 'TestEditUpdateThird',
            type: "checkbox",
            disabled:type === "view",
            value: formData.TESTROLE2 || false,
        }
    };

    return fields;
};
export const getFormPermessiFields = (formData: PermessiData, permessiOptions: ActivityTypeOption[],type:any) => {
    const fields = {
        HMA: {
            name: "HMA",
            label: permessiOptions.find(permesso => permesso.code === 'HMA')?.label || "Malattia",
            type: "checkbox",
            value: formData.HMA || false,
            required: false,
            disabled:type === "view",
        },
        HPE: {
            name: "HPE",
            label: permessiOptions.find(permesso => permesso.code === 'HPE')?.label || "Permesso",
            type: "checkbox",
            value: formData.HPE || false,
            disabled:type === "view",
            required: false
        },
        HFE: {
            name: "HFE",
            label: permessiOptions.find(permesso => permesso.code === 'HFE')?.label || "Ferie",
            type: "checkbox",
            value: formData.HFE || false,
            disabled:type === "view",
            required: false
        },
        HPE_104: {
            name: "HPE_104",
            label: permessiOptions.find(permesso => permesso.code === 'HPE_104')?.label || "Permesso 104",
            type: "checkbox",
            value: formData.HPE_104 || false,
            disabled:type === "view",
            required: false
        },
        MAT: {
            name: "MAT",
            label: permessiOptions.find(permesso => permesso.code === 'MAT')?.label || "Maternità",
            type: "checkbox",
            value: formData.MAT || false,
            disabled:type === "view",
            required: false
        },
        HCPT: {
            name: "HCPT",
            label: permessiOptions.find(permesso => permesso.code === 'HCPT')?.label || "Congedo Paternità",
            type: "checkbox",
            value: formData.HCPT || false,
            disabled:type === "view",
            required: false
        },
        LUT: {
            name: "LUT",
            label: permessiOptions.find(permesso => permesso.code === 'LUT')?.label || "Permessi per lutto",
            type: "checkbox",
            value: formData.LUT || false,
            disabled:type === "view",
            required: false
        },
        CMATR: {
            name: "CMATR",
            label: permessiOptions.find(permesso => permesso.code === 'CMATR')?.label || "Congedo Matrimoniale",
            type: "checkbox",
            value: formData.CMATR || false,
            disabled:type === "view",
            required: false
        }
    };
    return fields;
};