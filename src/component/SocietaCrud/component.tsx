import React, { PropsWithRef, useRef, useState } from "react";
import Form from "common/Form";
import Tab from "common/Tab";
import Button from "common/Button";
import styles from "./style.module.scss";
import { CompanyModel } from "./modelForms";
import { fromModelToBe, reverseCompanyapterUpdate } from "../../adapters/companyAdapter";
import { getFormCompanyFields } from "./FormFields";

type CompanyCrudProps = {
  row: CompanyModel;
  type: string;
  closeModalCallback: () => void;
  refreshTable: () => void;
  onSubmit: (type: string, formData: any, refreshTable: () => void, id: any, closeModal: () => void) => void;
};

export function CompanyCrud(props: PropsWithRef<CompanyCrudProps>) {

  const formCompany = useRef<any>();
  const [selected, setSelected] = useState(0);

  const [formCompanyData, setformCompanyData] = useState<CompanyModel>(props.row);
  const [modifiedFields, setModifiedFields] = useState<Record<string, any>>({})

  const valueOnChange = (name: string, value: any) => {
    if (props.type === "edit") {
      const currentValue = modifiedFields[name];
      if (currentValue !== value) {
        setModifiedFields((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      }
    }
  };


  const handleSelect = (e: any) => {
    setSelected(e.selected);
  };

  const handleSubmit = () => {
    let hasError = false;

    if (props.type === "create" || props.type === "edit") {
      if (formCompany.current) {
        formCompany.current.onSubmit();
        if (formCompany.current.isValid()) {
          setformCompanyData(formCompany.current.values);
        } else {
          hasError = true;
        }
      }


      if (!hasError) {
        if (props.type === "edit") {
          const modifiedData = Object.keys(modifiedFields).reduce((result, key) => {
            if (modifiedFields[key] !== undefined) {
              result[key] = modifiedFields[key];
            }
            return result;
          }, {});
          const formattedData = reverseCompanyapterUpdate(modifiedData);
          props.onSubmit(props.type, formattedData, props.refreshTable, props.row.id, props.closeModalCallback);
        }
        const formattedData = fromModelToBe(formCompany.current.values);
        props.onSubmit(props.type, formattedData, props.refreshTable, props.row.id, props.closeModalCallback);
      }
    }
    if (props.type === 'delete') {
      props.onSubmit(props.type, {}, props.refreshTable, props.row.id, props.closeModalCallback);
    }
    if(props.type === 'view'){
      props.closeModalCallback();
    }
  }

  if (props.type === 'delete') {
    return (

      <div className={styles.formDelete}>
        <span>{"Sei sicuro di voler eliminare il record?"}</span>

        <div >
          <Button onClick={() => props.closeModalCallback()}>Cancel</Button>
          <Button themeColor={"error"} onClick={handleSubmit}>
            Elimina
          </Button>
        </div>
      </div>

    )
  }

  return <Tab
    tabs={
      [
        {
          title: "Dati Società",
          children: (
            <div className={styles.parentForm} >
              <Form
                ref={formCompany}
                fields={Object.values(getFormCompanyFields(formCompanyData, props.type, valueOnChange))}
                formData={formCompanyData}
                onSubmit={(data: CompanyModel) => setformCompanyData(data)}

              />
            </div>
          ),
        },
      ]
    }
    onSelect={handleSelect}
    selected={selected}
    button={{ label: props.type === 'view' ? "Esci" : "Salva", onClick: handleSubmit }}
  />
}