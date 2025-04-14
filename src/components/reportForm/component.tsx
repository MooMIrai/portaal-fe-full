import { useEffect, useState } from "react";
import { reportService } from "../../services/ReportService";
import Form from "common/Form";
import React from "react";
import { FormField } from "../../models/FormModel";
import { formAdapter } from "../../adapters/FormAdapter";
import withField from "common/hoc/Field";
import withAutoComplete from "common/hoc/AutoComplete";
import Typography from "common/Typography";
import Button from "common/Button";

export function ReportForm(props: {
  report: string | undefined;
  reportName: string | undefined;
  onSubmit: (data: any) => void;
}) {
  const [formFields, setFormFields] = useState<FormField[]>();

  useEffect(() => {
    if (props.report) {
      reportService.getDetail(props.report).then((reportParams) => {
        const f = formAdapter.adaptList(reportParams.parameters);
        setFormFields(f);
      });
    }
  }, [props.report]);

  if (formFields) {
    const addedField = {};
    const customFields = formFields.filter(
      (f) => f.type.indexOf("custom-autocomplete") >= 0
    );
    customFields.forEach((cf) => {
      const type = cf.type.split("__")[1];
      addedField[cf.type] = withField(
        withAutoComplete((term: string) => {
          if (type === "STATIC_LIST") {
            return Promise.resolve(
              cf.options
                .filter((p) => {
                  return (
                    !term ||
                    !term.length ||
                    p.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) >= 0
                  );
                })
                .map((p) => ({ id: p, name: p }))
            );
          } else if (type === "DYNAMIC_LIST") {
            return Promise.resolve(
              cf.options
                .filter(
                  (p) =>
                    !term ||
                    !term.length ||
                    p.description
                      .toLocaleLowerCase()
                      .indexOf(term.toLocaleLowerCase()) >= 0
                )
                .map((p) => ({ id: p.id, name: p.description }))
            );
          } else {
            return Promise.resolve([]);
          }
        })
      );
    });

    if(!formFields.length){
      return <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <Typography.p>Nessun parametro richiesto</Typography.p>
        <Button
              themeColor={"primary"}
              onClick={()=>props.onSubmit({})}
              type="Button"
            >
              Genera Report
          </Button>
      </div>
    }

    return (
      <Form
        fields={formFields}
        formData={{}}
        onSubmit={(data: any) => {
          const mappedObj = {};
          Object.keys(data).forEach((key) => {
            const v = data[key];
            if (v?.id) {
              mappedObj[key] = v.id;
            } else {
              mappedObj[key] = v;
            }
          });
          props.onSubmit(mappedObj);
        }}
        description={"Parametri per il report " + props.reportName}
        submitText={"Genera Report"}
        showSubmit
        addedFields={addedField}
      />
    );
  }

  return <div> Seleziona un report </div>;
}
