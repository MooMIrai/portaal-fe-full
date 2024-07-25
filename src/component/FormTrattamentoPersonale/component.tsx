import React from 'react';
import Form from "common/Form";

function FormTrattamentoEconomico() {

    const fields = {
        tipologiaContratto: {
            name: "tipologiaContratto",
            label: "Tipologia di Contratto di Lavoro",
            type: "text",
            value: "",
            required: true,
            validator: (value: any) => value ? "" : "Il campo Tipologia Contratto è obbligatorio",
        },
        societa: {
            name: "societa",
            label: "Società",
            type: "text",
            value: "",
            required: true,
            validator: (value: any) => value ? "" : "Il campo società è obbligatorio",
        },
        tipoAmbitoLavorativo: {
            name: "tipoAmbitoLavorativo",
            label: "Tipo Ambito Lavorativo",
            type: "text",
            value: "",
            required: true,
            validator: (value: any) => value ? "" : "Il campo Tipo Ambito Lavorativo è obbligatorio",
        },
        dataInizioTrattamento: {
            name: "dataInizioTrattamento",
            label: "Data di Inizio del Trattamento",
            type: "date",
            value: "",
            required: true,
            validator: (value: any) => value ? "" : "Il campo Data Inizio del TRattamento è obbligatorio",
        },
        costoGiornaliero: {
            name: "costoGiornaliero",
            label: "Costo Giornaliero",
            type: "number",
            value: "",
            required: true,
            validator: (value: any) => value ? "" : "Il campo Costo Giornaliero è obbligatorio",
        },
        dataAssunzione: {
            name: "dataAssunzione",
            label: "Data Assunzione",
            type: "date",
            value: "",
        },
        scadenzaEffettiva: {
            name: "scadenzaEffettiva",
            label: "Scadenza Effettiva",
            type: "date",
            value: "",
        },
        dataRecesso: {
            name: "dataRecesso",
            label: "Data del Recesso",
            type: "date",
            value: "",
        },
        motivazioneCessazione: {
            name: "motivazioneCessazione",
            label: "Motivazione della Cessazione",
            type: "textarea",
            value: "",
        },
        trasformazioni: {
            name: "trasformazioni",
            label: "Trasformazioni",
            type: "textarea",
            value: "",
        },
        ccnl: {
            name: "ccnl",
            label: "CCNL",
            type: "text",
            value: "",
        },
        ral: {
            name: "ral",
            label: "RAL",
            type: "number",
            value: "",
        },
        trasferta: {
            name: "trasferta",
            label: "Trasferta",
            type: "number",
            value: "",
        },
        buoniPasto: {
            name: "buoniPasto",
            label: "Buoni Pasto",
            type: "number",
            value: "",
        },
        nettoMese: {
            name: "nettoMese",
            label: "Netto del mese",
            type: "number",
            value: "",
        },
        costoAnnuale: {
            name: "costoAnnuale",
            label: "Costo Annuo",
            type: "number",
            value: "",
        },
        tariffaVendita: {
            name: "tariffaVendita",
            label: "Tariffa di Vendita",
            type: "number",
            value: "",
        },
        note: {
            name: "note",
            label: "Note",
            type: "textarea",
            value: "",
        },
    };

    const initialFormData = {
        tipologiaContratto: "",
        societa: "",
        tipoAmbitoLavorativo: "",
        dataInizioTrattamento: "",
        costoGiornaliero: "",
        dataAssunzione: "",
        scadenzaEffettiva: "",
        dataRecesso: "",
        motivazioneCessazione: "",
        trasformazioni: "",
        ccnl: "",
        ral: "",
        trasferta: "",
        buoniPasto: "",
        nettoMese: "",
        costoAnnuale: "",
        tariffaVendita: "",
        note: "",
    };

  return (
    <Form
      fields={Object.values(fields)}
      formData={initialFormData}
    />
  );
}

export default FormTrattamentoEconomico;
