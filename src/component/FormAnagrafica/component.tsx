import React from 'react'
import Form from "common/Form"

function FormAnagrafica() {

    const fields = {
        sede: {
            name: "sede",
            label: "Sede",
            type: "select",
            value: "",
            required: true,
            options: ["Barletta", "Milano", "Roma"],
            validator: (value: any) => value ? "" : "Il campo sede è obbligatorio",
        },
        nome: {
            name: "nome",
            label: "Nome",
            type: "text",
            value: "",
            required: true,
            validator: (value: any) => value ? "" : "Il campo Nome è obbligatorio",
        },
        cognome: {
            name: "cognome",
            label: "Cognome",
            type: "text",
            value: "",
            required: true,
            validator: (value: any) => value ? "" : "Il campo Cognome è obbligatorio",
        },
        email: {
            name: "email",
            label: "Email Aziendale",
            type: "email",
            value: "",
            required: true,
            validator: (value: any) => value ? "" : "Il campo Email Aziendale è obbligatorio",
        },
        matricola: {
            name: "matricola",
            label: "Matricola",
            type: "text",
            value: "",
        },
        sesso: {
            name: "sesso",
            label: "Sesso",
            type: "select",
            value: "",
            options: ["Femmina","Maschio"],
        },
        nascita: {
            name: "Provincianascita",
            label: "Provincia di Nascita",
            type: "text",
            value: "",
        },
        comune: {
            name: "comuneNascita",
            label: "Comune di Nascita",
            type: "text",
            value: "",
        },
        provinciaResidenza: {
            name: "residenza",
            label: "Provincia di Residenza",
            type: "text",
            value: "",
        },
        comuneResidenza: {
            name: "comuneResidenza",
            label: "Comune di Residenza",
            type: "text",
            value: "",
        },
        indirizzoResidenza: {
            name: "indirizzoResidenza",
            label: "Indirizzo di Residenza",
            type: "text",
            value: "",
        },
        dataNascita: {
            name: "dataNascita",
            label: "Data di Nascita",
            type: "date",
            value: "",
        },
        cap: {
            name: "cap",
            label: "CAP di Residenza",
            type: "number",
            value: "",
        },
        cellulare: {
            name: "cellulare",
            label: "Cellulare",
            type: "number",
            value: "",
        },
        telefonoCasa: {
            name: "telefonoCasa",
            label: "Telefono di Casa",
            type: "number",
            value: "",
        },
        telefonoLavoro: {
            name: "telefonoLavoro",
            label: "Telefono di Lavoro",
            type: "number",
            value: "",
        },
        emailPrivata: {
            name: "emailPrivata",
            label: "Email Privata",
            type: "email",
            value: "",
        },
        iban: {
            name: "iban",
            label: "IBAN",
            type: "text",
            value: "",
        },
        codiceFiscale: {
            name: "codiceFiscale",
            label: "Codice Fiscale",
            type: "text",
            value: "",
        },
    };

    const initialFormData = {
        sede: "",
        nome: "",
        cognome: "",
        email: "",
        matricola: "",
        sesso: "",
        Provincianascita: "",
        comuneNascita: "",
        residenza: "",
        comuneResidenza: "",
        indirizzoResidenza: "",
        dataNascita: "",
        cap: "",
        cellulare: "",
        telefonoCasa: "",
        telefonoLavoro: "",
        emailPrivata: "",
        iban: "",
        codiceFiscale: "",
    };

  return (
    <Form
    fields={Object.values(fields)}
    formData={initialFormData}
/>
  )
}

export default FormAnagrafica