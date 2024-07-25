import React from 'react';
import Form from "common/Form";

function FormRuoli() {

    const fields = {
        ruoli: {
            name: "ruoli",
            label: "Ruoli",
            type: "checkbox-group",
            options: [
                { label: "Admin", value: "admin" },
                { label: "Amministrazione", value: "amministrazione" },
                { label: "Commerciale", value: "commerciale" },
                { label: "Dipendente", value: "dipendente" },
                { label: "Capo Progetto", value: "capoProgetto" },
                { label: "Recruiter", value: "recruiter" },
                { label: "Resp. Personale", value: "respPersonale" }
            ],
            value: []
        }
    };

    const initialFormData = {
        ruoli: []
    };

  return (
    <Form
      fields={Object.values(fields)}
      formData={initialFormData}
    />
  );
}

export default FormRuoli;
