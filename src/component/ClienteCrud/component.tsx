import React, { PropsWithRef, useRef, useState } from "react";
import Form from "common/Form";
import { CustomerModel } from "./model";
import Tab from "common/Tab";
import { getFormCustomerFields } from "./form";

import styles from "./style.module.scss";
import { convertToCustomerBE } from "../../adapters/clienteAdapters";

type ClienteCrudProps = {
    row: CustomerModel;
    type: string;
    closeModalCallback: () => void;
    refreshTable: () => void;
    onSubmit: (type: string, formData: any, refreshTable: () => void, id: any,closeModal:()=>void) => void;
  };

export function ClienteCrud(props:PropsWithRef<ClienteCrudProps>){

    const formCustomer = useRef<any>();
    const [selected, setSelected] = useState(0);

    const [formCustomerData,setformCustomerData] = useState<CustomerModel>(props.row);

    const handleSelect = (e: any) => {
        setSelected(e.selected);
    };

    const handleSubmit = () => {
        let hasError = false;
   
        if (props.type === "create" || props.type === "edit" ) {
          if (formCustomer.current) {
            formCustomer.current.onSubmit();
            if (formCustomer.current.isValid()) {
              setformCustomerData(formCustomer.current.values);
            } else {
              hasError = true;
            }
          }
  
    
        if (!hasError) {
          const formattedData = convertToCustomerBE(formCustomer.current.values);
          //console.log("formattedData", formattedData);
          props.onSubmit(props.type, formattedData, props.refreshTable,  props.row.id,props.closeModalCallback);
          //props.refreshTable();
          //props.closeModalCallback();
        }
      }
      if(props.type==='delete'){
          props.onSubmit(props.type, {}, props.refreshTable,  props.row.id,props.closeModalCallback);
          //props.refreshTable();
          //props.closeModalCallback();
      }
    }
    if(props.type==='delete'){
      return (
        <>
          <div style={{ padding: "20px" }}>
            <span>{"Sei sicuro di voler eliminare il record?"}</span>
          </div>
          <div className="k-form-buttons">
            <button onClick={()=>props.closeModalCallback()}>Cancel</button>
            <button onClick={handleSubmit}>
              Elimina
            </button>
          </div>
        </>
      )
    }

    return <Tab 
            tabs={
                [
                    {
                        title: "Dati Cliente",
                        children: (
                          <div className={styles.parentForm} >
                            <Form
                                ref={formCustomer}
                                fields={Object.values(getFormCustomerFields(formCustomerData,props.type))}
                                formData={formCustomerData}
                                onSubmit={(data: CustomerModel) => setformCustomerData(data)}
                               
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