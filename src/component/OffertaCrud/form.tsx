import { locationOption } from "../../adapters/offertaAdapters";
import { ProjectModel } from "../ProgettoCrud/model";
import { OfferModel, Projects } from "./model";

export const getFormOfferFields = (
    formData: OfferModel,
    type: string,
    handleDownload: (fileId: string, name: string) => void,
    combinedValueOnChangeAttchment: (name: string, value: any) => void,
    download: boolean,
    name_attachment: string | null,
    rowLocation: { id: number, name: string } | undefined,
    valueOnChange: (name: string, value: any) => void,
    isDaily: boolean,
    combinedValueOnChangeBillyngType: (name: string, value: any) => void,
) => {

    // Validators
    const onlyLettersValidator = (value: any) => /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(value) ? "" : "Il campo deve contenere solo lettere";
    const partitaIVAValidator = (value: any) => /^\d{11}$/.test(value) ? "" : "Il campo deve contenere una partita IVA valida (11 cifre)";
    const optionalTelefonoCasaValidator = (value: any) => !value || /^(0\d{1,4}\d{5,9}|\+39\s?0\d{1,4}\d{5,9})$/.test(value);
    const percentageValidator = (value: any) => /^(\d{1,2}(\.\d+)?|100(\.0+)?)(%)?$/.test(value) ? "" : "Il campo deve contenere una percentuale valida (0-100)";
    const optional = (value: any, otherValidator: (value: any) => string) => (!value || !value.length) ? "" : otherValidator(value);

    const requiredIfDailyValidator = (value: any, fieldName: string) => isDaily && !value ? `Il campo ${fieldName} è obbligatorio quando la fatturazione è giornaliera` : "";

    if (type === "edit" || type === "view") {
        formData.location = rowLocation || formData.location;
    }



    console.log("isdailu", isDaily)

    // Fields definition
    const fields: Record<string, any> = {
        creation_date: {
            name: "creation_date",
            label: "Data creazione",
            type: "date",
            value: formData.creation_date,
            disabled: true,
            conditions: (formData: OfferModel) => type === "edit" || type === "view"
        },
        accountManager: {
            name: "accountManager",
            label: "Commerciale di riferimento",
            type: "commerciale-selector",
            valueOnChange: valueOnChange,
            value: formData.accountManager,
            required: true,
            disabled: type === "view",
            validator: (value: any) => (value ? "" : "Selezionare un Commerciale valido")
        },
        year: {
            name: "year",
            label: "Anno di riferimento",
            type: "year",
            value: formData.year,
            valueOnChange: valueOnChange,
            disabled: type === "view",
        },
        project_type: {
            name: "project_type",
            label: "Tipo di offerta",
            type: "projecttype-selector",
            value: formData.project_type,
            valueOnChange: valueOnChange,
            required: true,
            disabled: type === "view",
            validator: (value: any) => (value ? "" : "Selezionare un tipo offerta")
        },
        customer: {
            name: "customer",
            label: "Cliente",
            type: "customer-selector",
            value: formData.customer,
            required: true,
            valueOnChange: valueOnChange,
            disabled: type === "view",
            validator: (value: any) => (value ? "" : "Selezionare un Cliente valido")
        },
       
        billing_type: {
            name: "billing_type",
            label: "Tipo Fatturazione",
            type: "billingtype-selector",
            value: formData.billing_type,
            valueOnChange: combinedValueOnChangeBillyngType,
            required: true,
            disabled: type === "view" || isDaily,
            validator: (value: any) => (value ? "" : "Selezionare un Tipo di fatturazione valida")
        },

    };


    fields.rate = {
        name: "rate",
        label: "Tariffa",
        type: "number",
        value: formData.rate,
        valueOnChange: valueOnChange,
        required: isDaily,
        disabled: type === "view",
        validator: (value: any) => requiredIfDailyValidator(value, "Tariffa"),
        conditions: (formData: OfferModel) => formData.billing_type?.id === "Daily"
    };
    fields.days = {
        name: "days",
        label: "Giorni offerti",
        type: "number",
        value: formData.days,
        valueOnChange: valueOnChange,
        required: isDaily,
        disabled: type === "view",
        validator: (value: any) => requiredIfDailyValidator(value, "Giorni offerti"),
        conditions: (formData: OfferModel) => formData.billing_type?.id === "Daily"
    };


    fields.amount = {
        name: "amount",
        label: "Importo",
        type: "number",
        value: formData.amount,
        valueOnChange: valueOnChange,
        required: false,
        disabled: type === "view",
        conditions: (formData: OfferModel) => formData.billing_type?.id !== "Daily"
    };
    fields.title = {
        name: "title",
        label: "Titolo",
        type: "text",
        value: formData.title,
        valueOnChange: valueOnChange,
        required: true,
        disabled: type === "view",
        validator: (value: any) => (value ? "" : "Il campo Titolo è obbligatorio")
    };
    fields.protocol = {
        name: "protocol",
        label: "Protocollo",
        type: "text",
        value: formData.protocol,
        valueOnChange: valueOnChange,
        required: true,
        disabled: type === "view",
        validator: (value: any) => value ? "" : "Il campo Protocollo è obbligatorio"
    },
        fields.location = {
            name: "location",
            label: "Sede",
            type: "sede-selector",
            value: formData.location,
            valueOnChange: valueOnChange,
            required: true,
            disabled: type === "view"
        };
    fields.approval_date = {
        name: "approval_date",
        valueOnChange: valueOnChange,
        label: "Data approvazione",
        type: "date",
        value: formData.approval_date,
        disabled: type === "view"
    };

    fields.end_date = {
        name: "end_date",
        label: "Data scadenza",
        type: "date",
        valueOnChange: valueOnChange,
        value: formData.end_date,
        disabled: type === "view"
    };
    fields.outcome_type = {
        name: "outcome_type",
        label: "Tipo Esito",
        type: "outcometype-selector",
        valueOnChange: valueOnChange,
        value: formData.outcome_type,
        required: true,
        disabled: type === "view",
        validator: (value: any) => (value ? "" : "Selezionare un esito valido")
    };

    fields.NoCollective = {
        name: 'NoCollective',
        label: 'Fuori accordo quadro',
        valueOnChange: valueOnChange,
        type: 'checkbox',
        showLabel: false,
        value: formData.NoCollective || false,
        disabled: type === "view"
    };
    fields.description = {
        name: 'description',
        label: 'Descrizione',
        valueOnChange: valueOnChange,
        type: 'textarea',
        value: formData.description,
        disabled: type === "view"
    }
  /*   fields.googleDriveLink= {
        name: "googleDriveLink",
        label: "Google Drive Link",
        type: "urlInput",
        value: formData.googleDriveLink,
        valueOnChange: valueOnChange,
        disabled: type === "view",
        existingLink:"https://mail.google.com/chat/u/0/#chat/dm/uR59YcAAAAE"
    }, */
    fields.attachment = {
        name: "attachment",
        label: "Carica Offerta",
        type: "uploadMultipleFiles",
        withCredentials: false,
        disabled: type === "view",
        files: formData.attachment || "",
        valueOnChange: combinedValueOnChangeAttchment,
        onDownload: download && name_attachment ?
            (fileId: string, name: string) => handleDownload(fileId, name) : undefined,
        multiple: true,
        existingFile: formData.existingFile,
        isDroppable:true
    };

    console.log("fields", fields)
    return fields;
};


export const getFormCommesseFields = (formData: Projects | undefined, valueOnChange: (name: string, value: any) => void,) => {
    const fields: Record<string, any> = {
        start_date: {
            name: "start_date",
            label: "Data di inizio",
            type: "date",
            valueOnChange: valueOnChange,
            required: true,
            value: formData?.start_date,
            validator: (value: any) => (value ? "" : "Seleziona una data")
        },
        end_date: {
            name: "end_date",
            label: "Data di fine",
            type: "date",
            valueOnChange: valueOnChange,
            value: formData?.end_date,

        },
        orderNum: {
            name: "orderNum",
            label: "Numero ordine cliente",
            valueOnChange: valueOnChange,
            type: "text",
            value: formData?.orderNum,

        },

    };
    return fields;
}