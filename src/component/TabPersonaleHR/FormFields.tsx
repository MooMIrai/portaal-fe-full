// formFields.ts

import { ActivityTypeOption, companyOption, genderOption, RoleOption } from '../../adapters/personaleAdapters';
import { AnagraficaData, TrattamentoEconomicoData, RuoliData, PermessiData } from './modelForms';

const createValidator = (isDisabled: boolean, validationFn: (value: any) => string) => {
    return (value: any) => {
        if (isDisabled) return ""; 
        return validationFn(value);
    };
};

export const getFormAnagraficaFields = (formData: AnagraficaData, gender: genderOption[], type: any, isViewOnly: boolean, handleDownload: () => void, combinedValueOnChange: (name: string, value: any) => void, download: boolean, name_attachment: string | null, valueOnChange: (name: string, value: any) => void, handleFileUpload: (file: File) => void,setExstingFile:any,fileJustUploaded) => {
    const genderOptions = gender.map(company => company.label)
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



    const fields: Record<string, any> = {
        sede_autocomplete: {
            name: "sede_autocomplete",
            label: "Sede",
            type: "sede-selector",
            value: formData.sede_autocomplete || "",
            required: true,
            disabled: (type === "view" || isViewOnly),
            valueOnChange: valueOnChange,
            /*  options: sede?.map(c => c.label), */
            validator: createValidator(type === "view" || isViewOnly, (value: any) =>
                value ? "" : "Il campo sede è obbligatorio"
            ),
        },
        nome: {
            name: "nome",
            label: "Nome",
            type: "text",
            value: formData.nome || "",
            required: true,
            disabled: (type === "view" || isViewOnly),
            valueOnChange: valueOnChange,
            validator: createValidator(type === "view" || isViewOnly, (value: any) =>
                value ? onlyLettersValidator(value) : "Il campo Nome è obbligatorio"
            ),
        },
        cognome: {
            name: "cognome",
            label: "Cognome",
            type: "text",
            value: formData.cognome || "",
            disabled: (type === "view" || isViewOnly),
            required: true,
            valueOnChange: valueOnChange,
            validator: createValidator(type === "view" || isViewOnly, (value: any) =>
                value ? onlyLettersValidator(value) : "Il campo Cognome è obbligatorio"
            ),
        },
        email: {
            name: "email",
            label: "Email Aziendale",
            type: "email",
            showLabel: false,
            value: formData.email || "",
            required: true,
            disabled: (type === "view" || isViewOnly),
            valueOnChange: valueOnChange,
            validator: createValidator(type === "view" || isViewOnly, (value: any) =>
                value ? "" : "Il campo Email Aziendale è obbligatorio"
            ),
        },
        matricola: {
            name: "matricola",
            label: "Matricola",
            type: "text",
            disabled: (type === "view" || isViewOnly),
            valueOnChange: valueOnChange,
            value: formData.matricola || "",
        },
        sesso: {
            name: "sesso",
            label: "Sesso",
            type: "select",
            showLabel: false,
            disabled: (type === "view" || isViewOnly),
            value: formData.sesso || "",
            required: true,
            options: genderOptions,
            valueOnChange: valueOnChange,
            validator: (value: any) => value ? "" : "Il campo sesso è obbligatorio",
        },
        skill: {
            name: "skill",
            label: "Skill",
            type: "skill",
            showLabel: false,
            disabled: (type === "view" || isViewOnly),
           /*  value: formData.sesso || "", */
            valueOnChange: valueOnChange,
            validator: (value: any) => value ? "" : "Il campo sesso è obbligatorio",
        },
        
        attachment: {
            name: "attachment",
            label: "Carica CV",
            type: "uploadSingleFile",
            withCredentials: false,
            disabled: (type === "view" || isViewOnly),
            value: formData.attachment || "",
            existingFile:setExstingFile,
            valueOnChange: (name: string, value: any) => {
                combinedValueOnChange(name, value); // Usa la funzione combinata
            },
            onDownload: download && name_attachment ? handleDownload : undefined,
            multiple: false,
        }
    }

    if (fileJustUploaded) {
        fields.generaInputAi = {
            name: "generaInputAi",
            label: "Genera Input AI",
            showLabel:false,
            type: "buttonCustom",
            valueOnChange: valueOnChange,
            loader:true,
            onClick: () => handleFileUpload(fileJustUploaded),
            disabled: (type === "view" || isViewOnly),
        };
    }
        fields.residenza= {
            name: "residenza",
            label: "Comune di Residenza",
            type: "country",
            valueOnChange: valueOnChange,
            disabled: (type === "view" || isViewOnly),
            value: formData.residenza,

        },
        fields.nascita= {
            name: "nascita",
            label: "Comune di nascita",
            type: "country",
            valueOnChange: valueOnChange,
            disabled: (type === "view" || isViewOnly),
            value: formData.nascita,
        },
        fields.dataNascita= {
            name: "dataNascita",
            label: "Data di Nascita",
            type: "date",
            disabled: (type === "view" || isViewOnly),
            value: formData.dataNascita || "",
            required: true,
            valueOnChange: valueOnChange,
            validator: createValidator(type === "view" || isViewOnly, dateValidator),
        },
        fields.indirizzoResidenza= {
            name: "indirizzoResidenza",
            label: "Indirizzo di Residenza",
            type: "text",
            valueOnChange: valueOnChange,
            disabled: (type === "view" || isViewOnly),
            value: formData.indirizzoResidenza || "",
        },
        fields.cap= {
            name: "cap",
            label: "CAP di Residenza",
            type: "text",
            valueOnChange: valueOnChange,
            disabled: (type === "view" || isViewOnly),
            value: formData.cap || 0,
            validator: createValidator(type === "view" || isViewOnly, (value: any) =>
                optionalCapValidator(value) ? "" : "Il campo CAP deve contenere solo 5 numeri"
            ),
        },
        fields.cellulare= {
            name: "cellulare",
            label: "Cellulare",
            type: "text",
            valueOnChange: valueOnChange,
            disabled: (type === "view" || isViewOnly),
            value: formData.cellulare || 0,
            validator: createValidator(type === "view" || isViewOnly, (value: any) =>
                optionalCellulareValidator(value) ? "" : "Il campo Cellulare deve essere nel formato +39XXXXXXXXXX o XXXXXXXXXX"
            ),
        },
        fields.telefonoCasa= {
            name: "telefonoCasa",
            label: "Telefono di Casa",
            type: "text",
            disabled: (type === "view" || isViewOnly),
            value: formData.telefonoCasa || 0,
            valueOnChange: valueOnChange,
            validator: createValidator(type === "view" || isViewOnly, (value: any) =>
                optionalTelefonoCasaValidator(value) ? "" : "Il campo Telefono di Casa deve essere nel formato +0XXXXXXXXX"
            ),
        },
        fields.telefonoLavoro= {
            name: "telefonoLavoro",
            label: "Telefono di Lavoro",
            type: "text",
            spinners: false,
            disabled: (type === "view" || isViewOnly),
            value: formData.telefonoLavoro || 0,
            valueOnChange: valueOnChange,
            validator: createValidator(type === "view" || isViewOnly, (value: any) =>
                optionalCellulareValidator(value) ? "" : "Il campo Telefono di Lavoro deve essere nel formato +39XXXXXXXXXX o XXXXXXXXXX"
            ),
        },
        fields.emailPrivata= {
            name: "emailPrivata",
            label: "Email Privata",
            type: "email",
            valueOnChange: valueOnChange,
            showLabel: false,
            disabled: (type === "view" || isViewOnly),
            value: formData.emailPrivata || "",
        },
        fields.iban= {
            name: "iban",
            label: "IBAN",
            type: "text",
            valueOnChange: valueOnChange,
            disabled: (type === "view" || isViewOnly),
            value: formData.iban || "",
        },
        fields.codiceFiscale= {
            name: "codiceFiscale",
            label: "Codice Fiscale",
            valueOnChange: valueOnChange,
            type: "text",
            disabled: (type === "view" || isViewOnly),
            value: formData.codiceFiscale || "",
        },
        fields.partitaIva= {
            name: "partitaIva",
            label: "Partita Iva",
            valueOnChange: valueOnChange,
            type: "text",
            disabled: (type === "view" || isViewOnly),
            value: formData.partitaIva || "",
        }
    

  

    return fields

};



export const getFormTrattamentoEconomicoFields = (
    formData: TrattamentoEconomicoData | null,
    company: companyOption[],
    type: any,
    isFirstTreatment: boolean,
    newForm: boolean,
    combinedValueOnChangeContractType: (name: string, value: any) => void,
    isScadenzaEffettivaDisabled: boolean,
    isFirstTreatmentUpdate: boolean,
    isViewOnly: boolean,
    valueOnChange: (name: string, value: any) => void

) => {
    const companyOptions = company.map((company) => company.label);

    const optionalDateValidator = (field: string) => (
        value: any,
        formData: TrattamentoEconomicoData | null
    ) => {
        if (!value) return true;
        const selectedDate = new Date(value);
        const hireDate = new Date(formData?.dataAssunzione);
        const startDate = new Date(formData?.dataInizioTrattamento);

        if (selectedDate <= hireDate || selectedDate <= startDate) {
            return false;
        }
        return true;
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set the time to midnight to avoid time-related issues

    const fields = {
        tipologiaContratto_autocomplete: {
            name: "tipologiaContratto_autocomplete",
            label: "Tipologia di Contratto di Lavoro",
            type: "contract-type",
            disabled: (type === "view" || isViewOnly),
            value: formData?.tipologiaContratto_autocomplete || "",
            required: true,
            valueOnChange: (name: string, value: any) => {
                combinedValueOnChangeContractType(name, value); // Usa la funzione combinata
            },
            validator: createValidator(type === "view" || isViewOnly, (value: any) =>
                value ? "" : "Il campo Tipologia di Contratto di Lavoro è obbligatorio"
            ),
        },
        societa: {
            name: "societa",
            label: "Società",
            type: "select",
            showLabel: false,
            disabled: (type === "view" || isViewOnly),
            value: formData?.societa || "",
            required: true,
            valueOnChange: valueOnChange,
            validator: createValidator(type === "view" || isViewOnly, (value: any) =>
                value ? "" : "Il campo Società è obbligatorio"
            ),
            options: companyOptions,
        },
        tipoAmbitoLavorativo_autocomplete: {
            name: "tipoAmbitoLavorativo_autocomplete",
            label: "Ambito Lavorativo",
            type: "work-scope",
            disabled: (type === "view" || isViewOnly),
            valueOnChange: valueOnChange,
            value:
                formData?.tipologiaContratto_autocomplete?.id === 0 &&
                    formData?.tipologiaContratto_autocomplete?.name === ""
                    ? undefined
                    : formData?.tipologiaContratto_autocomplete,
            required: true,
            validator: createValidator(type === "view" || isViewOnly, (value: any) =>
                value ? "" : "Il campo Tipo Ambito Lavorativo è obbligatorio"
            ),
        },
        dataInizioTrattamento: {
            name: "dataInizioTrattamento",
            label: "Data di Inizio del Trattamento",
            type: "date",
            valueOnChange: valueOnChange,
            disabled: (type === "view" || isViewOnly),
            required: true,
            validator: createValidator(type === "view" || isViewOnly, (value: any) => {
                if (!value) {
                    return "Il campo Data Inizio Trattamento è obbligatorio";
                }

                const selectedDate = new Date(value);
                const hireDate = formData?.dataAssunzione ? new Date(formData.dataAssunzione) : null;

                if (isFirstTreatment || isFirstTreatmentUpdate) {
                    if (hireDate && selectedDate.getTime() !== hireDate.getTime()) {
                        return "Per il primo trattamento, la Data di Inizio del Trattamento deve essere uguale alla Data di Assunzione";
                    }
                } else {
                    if (hireDate && selectedDate < hireDate) {
                        return "La Data di Inizio del Trattamento non può essere precedente alla Data di Assunzione";
                    }
                }

                return "";
            }),


            value: formData?.dataInizioTrattamento || "",
        },


        dataAssunzione: {
            name: "dataAssunzione",
            label: "Data Assunzione",
            type: "date",
            valueOnChange: valueOnChange,
            disabled: (type === "view") || !(isFirstTreatment || isFirstTreatmentUpdate) || isViewOnly,
            value: formData?.dataAssunzione || "",
            validator: createValidator(type === "view" || isViewOnly, (value: any) => {
                if (!value) return "";
                if ((isFirstTreatment || isFirstTreatmentUpdate) && value && formData?.dataInizioTrattamento) {
                    const assunzioneDate = new Date(value);
                    const inizioTrattamentoDate = new Date(formData.dataInizioTrattamento);

                    if (assunzioneDate.getTime() !== inizioTrattamentoDate.getTime()) {
                        return "Per il primo trattamento, la Data di Assunzione deve essere uguale alla Data di Inizio del Trattamento";
                    }
                }
                return "";
            })
        },

        scadenzaEffettiva: {
            name: "scadenzaEffettiva",
            label: "Scadenza Effettiva",
            type: "date",
            valueOnChange: valueOnChange,
            disabled: (type === "view" || isScadenzaEffettivaDisabled || isViewOnly),
            value: formData?.scadenzaEffettiva || "",
            validator: createValidator(type === "view" || isScadenzaEffettivaDisabled || isViewOnly, (value: any) => {
                if (!value) return "";
                const selectedDate = new Date(value);
                const hireDate = formData?.dataAssunzione ? new Date(formData.dataAssunzione) : null;
                const startDate = formData?.dataInizioTrattamento ? new Date(formData.dataInizioTrattamento) : null;

                if (hireDate && selectedDate <= hireDate) {
                    return "La Scadenza Effettiva non può essere lo stesso giorno o prima della Data di Assunzione";
                }
                if (startDate && selectedDate <= startDate) {
                    return "La Scadenza Effettiva non può essere lo stesso giorno o prima della Data di Inizio del Trattamento";
                }

                return "";
            })
        },

        dataRecesso: {
            name: "dataRecesso",
            label: "Data del Recesso",
            type: "date",
            valueOnChange: valueOnChange,
            disabled: (type === "view") || newForm || isFirstTreatment,
            value: formData?.dataRecesso || "",
            validator: createValidator(type === "view" || isViewOnly, (value: any) =>
                optionalDateValidator("Data del Recesso")(value, formData) ? "" : "Il campo Data del Recesso non può essere lo stesso giorno o prima della Data di Assunzione o della Data di Inizio del Trattamento"
            ),
        },
        costoGiornaliero: {
            name: "costoGiornaliero",
            label: "Costo Giornaliero",
            type: "number",
            valueOnChange: valueOnChange,
            spinners: false,
            disabled: (type === "view" || isViewOnly),
            required: true,
            validator: createValidator(type === "view" || isViewOnly, (value: any) =>
                value ? "" : "Il campo Costo Giornaliero è obbligatorio"
            ),
            value: formData?.costoGiornaliero || 0,
        },
        motivazioneCessazione: {
            name: "motivazioneCessazione",
            label: "Motivazione della Cessazione",
            type: "textarea",
            valueOnChange: valueOnChange,
            disabled: (type === "view" || isViewOnly),
            value: formData?.motivazioneCessazione || "",
        },
        trasformazioni: {
            name: "trasformazioni",
            label: "Trasformazioni",
            type: "textarea",
            valueOnChange: valueOnChange,
            disabled: (type === "view" || isViewOnly),
            value: formData?.trasformazioni || "",
        },
        ccnl: {
            name: "ccnl",
            label: "CCNL",
            type: "text",
            valueOnChange: valueOnChange,
            disabled: (type === "view" || isViewOnly),
            value: formData?.ccnl || "",
        },
        ral: {
            name: "ral",
            label: "RAL",
            type: "number",
            valueOnChange: valueOnChange,
            spinners: false,
            disabled: (type === "view" || isViewOnly),
            value: formData?.ral || 0,
        },
        trasferta: {
            name: "trasferta",
            label: "Trasferta",
            type: "number",
            valueOnChange: valueOnChange,
            disabled: (type === "view" || isViewOnly),
            spinners: false,
            value: formData?.trasferta || 0,
        },
        buoniPasto: {
            name: "buoniPasto",
            label: "Buoni Pasto",
            type: "select",
            showLabel: false,
            valueOnChange: valueOnChange,
            disabled: (type === "view" || isViewOnly),
            options: ["SI", "NO"],
            value: formData?.buoniPasto,
        },
        nettoMese: {
            name: "nettoMese",
            label: "Netto del mese",
            type: "number",
            valueOnChange: valueOnChange,
            disabled: (type === "view" || isViewOnly),
            spinners: false,
            value: formData?.nettoMese || 0,
        },
        costoAnnuale: {
            name: "costoAnnuale",
            label: "Costo Annuo",
            valueOnChange: valueOnChange,
            disabled: (type === "view" || isViewOnly),
            type: "number",
            spinners: false,
            value: formData?.costoAnnuale || 0,
        },
        tariffaVendita: {
            name: "tariffaVendita",
            label: "Tariffa di Vendita",
            type: "number",
            disabled: (type === "view" || isViewOnly),
            spinners: false,
            valueOnChange: valueOnChange,
            value: formData?.tariffaVendita || 0,
        },
        note: {
            name: "note",
            disabled: (type === "view" || isViewOnly),
            label: "Note",
            valueOnChange: valueOnChange,
            type: "textarea",
            value: formData?.note || "",
        },
    }
    return fields

};


export const getFormRuoliFields = (formData: RuoliData, roles: RoleOption[], type: any, isViewOnly: boolean, valueOnChange: (name: string, value: any) => void) => {
    const fields = {
        ADM: {
            name: "ADM",
            label: roles.find(role => role.name === 'ADM')?.label || 'Admin',
            type: "checkbox",
            valueOnChange: valueOnChange,
            showLabel: false,
            disabled: (type === "view" || isViewOnly),
            value: formData.ADM || false,
        },
        AMMI: {
            name: "AMMI",
            label: roles.find(role => role.name === 'AMMI')?.label || 'Amministrazione',
            type: "checkbox",
            valueOnChange: valueOnChange,
            showLabel: false,
            disabled: (type === "view" || isViewOnly),
            value: formData.AMMI || false,
        },
        COM: {
            name: "COM",
            label: roles.find(role => role.name === 'COM')?.label || 'Commerciale',
            type: "checkbox",
            valueOnChange: valueOnChange,
            showLabel: false,
            disabled: (type === "view" || isViewOnly),
            value: formData.COM || false,
        },
        DIP: {
            name: "DIP",
            label: roles.find(role => role.name === 'DIP')?.label || 'Dipendente',
            type: "checkbox",
            valueOnChange: valueOnChange,
            showLabel: false,
            disabled: (type === "view" || isViewOnly),
            value: formData.DIP || false,
        },
        LEA: {
            name: "LEA",
            label: roles.find(role => role.name === 'LEA')?.label || 'Capo Progetto',
            type: "checkbox",
            showLabel: false,
            valueOnChange: valueOnChange,
            disabled: (type === "view" || isViewOnly),
            value: formData.LEA || false,
        },
        REC: {
            name: "REC",
            label: roles.find(role => role.name === 'REC')?.label || 'Recruiter',
            type: "checkbox",
            showLabel: false,
            valueOnChange: valueOnChange,
            disabled: (type === "view" || isViewOnly),
            value: formData.REC || false,
        },
        RP: {
            name: "RP",
            label: roles.find(role => role.name === 'RP')?.label || 'Resp. Personale',
            type: "checkbox",
            valueOnChange: valueOnChange,
            showLabel: false,
            disabled: (type === "view" || isViewOnly),
            value: formData.RP || false,
        },
        SEG: {
            name: "SEG",
            label: roles.find(role => role.name === 'SEG')?.label || 'Segreteria',
            type: "checkbox",
            showLabel: false,
            valueOnChange: valueOnChange,
            disabled: (type === "view" || isViewOnly),
            value: formData.SEG || false,
        },
        RISEXT: {
            name: "RISEXT",
            label: roles.find(role => role.name === 'RISEXT')?.label || 'Risorsa esterna',
            type: "checkbox",
            showLabel: false,
            valueOnChange: valueOnChange,
            disabled: (type === "view" || isViewOnly),
            value: formData.RISEXT || false,
        },
        ADD_CENS: {
            name: "ADD_CENS",
            label: roles.find(role => role.name === 'ADD_CENS')?.label || 'Addetto censimento',
            type: "checkbox",
            valueOnChange: valueOnChange,
            showLabel: false,
            disabled: (type === "view" || isViewOnly),
            value: formData.ADD_CENS || false,
        },
        TESTROLE2: {
            name: "TESTROLE2",
            label: roles.find(role => role.name === 'TESTROLE2')?.label || 'TestEditUpdateThird',
            type: "checkbox",
            showLabel: false,
            valueOnChange: valueOnChange,
            disabled: (type === "view" || isViewOnly),
            value: formData.TESTROLE2 || false,
        }
    };

    return fields;
};
export const getFormPermessiFields = (formData: PermessiData, permessiOptions: ActivityTypeOption[], type: any, isViewOnly: boolean, valueOnChange: (name: string, value: any) => void) => {
    const fields = {
        HMA: {
            name: "HMA",
            label: permessiOptions.find(permesso => permesso.code === 'HMA')?.label || "Malattia",
            type: "checkbox",
            valueOnChange: valueOnChange,
            showLabel: false,
            value: formData.HMA || false,
            required: false,
            disabled: (type === "view" || isViewOnly),
        },
        HPE: {
            name: "HPE",
            label: permessiOptions.find(permesso => permesso.code === 'HPE')?.label || "Permesso",
            type: "checkbox",
            valueOnChange: valueOnChange,
            showLabel: false,
            value: formData.HPE || false,
            disabled: (type === "view" || isViewOnly),
            required: false
        },
        HFE: {
            name: "HFE",
            label: permessiOptions.find(permesso => permesso.code === 'HFE')?.label || "Ferie",
            type: "checkbox",
            valueOnChange: valueOnChange,
            showLabel: false,
            value: formData.HFE || false,
            disabled: (type === "view" || isViewOnly),
            required: false
        },
        HPE_104: {
            name: "HPE_104",
            label: permessiOptions.find(permesso => permesso.code === 'HPE_104')?.label || "Permesso 104",
            type: "checkbox",
            valueOnChange: valueOnChange,
            showLabel: false,
            value: formData.HPE_104 || false,
            disabled: (type === "view" || isViewOnly),
            required: false
        },
        MAT: {
            name: "MAT",
            label: permessiOptions.find(permesso => permesso.code === 'MAT')?.label || "Maternità",
            type: "checkbox",
            showLabel: false,
            valueOnChange: valueOnChange,
            value: formData.MAT || false,
            disabled: (type === "view" || isViewOnly),
            required: false
        },
        HCPT: {
            name: "HCPT",
            label: permessiOptions.find(permesso => permesso.code === 'HCPT')?.label || "Congedo Paternità",
            type: "checkbox",
            showLabel: false,
            valueOnChange: valueOnChange,
            value: formData.HCPT || false,
            disabled: (type === "view" || isViewOnly),
            required: false
        },
        LUT: {
            name: "LUT",
            label: permessiOptions.find(permesso => permesso.code === 'LUT')?.label || "Permessi per lutto",
            type: "checkbox",
            valueOnChange: valueOnChange,
            showLabel: false,
            value: formData.LUT || false,
            disabled: (type === "view" || isViewOnly),
            required: false
        },
        CMATR: {
            name: "CMATR",
            label: permessiOptions.find(permesso => permesso.code === 'CMATR')?.label || "Congedo Matrimoniale",
            type: "checkbox",
            valueOnChange: valueOnChange,
            showLabel: false,
            value: formData.CMATR || false,
            disabled: (type === "view" || isViewOnly),
            required: false
        }
    };
    return fields;
};


