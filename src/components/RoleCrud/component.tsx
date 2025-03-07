import React, { PropsWithRef, useRef, useState } from "react";
import Form from "common/Form";
import Tab from "common/Tab";
import Button from "common/Button";
import { RoleForm } from "./form";
import styles from "./style.module.scss";


type RoleCrudProps = {
  row: any;
  type: string;
  closeModalCallback: () => void;
  refreshTable: () => void;
  onSubmit: (type: string, formData: any, refreshTable: () => void, id: any, closeModal: () => void) => void;
};

export function RoleCrud(props: PropsWithRef<RoleCrudProps>) {

  const formRole = useRef<any>();
 

  const handleSubmit = () => {
    

    if (props.type === "create" || props.type === "edit") {
        props.onSubmit(props.type, formRole.current.values, props.refreshTable, props.row.id, props.closeModalCallback);
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
    selected={0}
    tabs={
      [
        {
          title: "Dati Ruolo",
          children: (
            <div className={styles.parentForm} >
              <Form
                ref={formRole}
                fields={RoleForm}
                formData={props.row}
                onSubmit={handleSubmit}
                showSubmit
                submitText={props.type!=='create'?'Modifica':'Aggiungi'}
              />
            </div>
          ),
        },
      ]
    }
    button={{ label: "Esci", onClick: props.closeModalCallback }}
  />
}