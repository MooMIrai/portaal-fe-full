import { PropsWithRef, useRef, useState } from "react";
import { OfferModel } from "./model";
import Button from 'common/Button';
import Form from "common/Form";
import Tab from "common/Tab";
import React from "react";


import styles from "./style.module.scss";
import { getFormOfferFields } from "./form";
import { offertaCustomFields } from "./customfields";




type OffertaCrudProps = {
    row: OfferModel;
    type: string;
    closeModalCallback: () => void;
    refreshTable: () => void;
    onSubmit: (type: string, formData: any, refreshTable: () => void, id: any,closeModal:()=>void) => void;
  };

export function OffertaCrud(props:PropsWithRef<OffertaCrudProps>){

    const formCustomer = useRef<any>();
    const [selected, setSelected] = useState(0);

    const [formCustomerData,setformCustomerData] = useState<OfferModel>(props.row);

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
          //const formattedData = convertToCustomerBE(formCustomer.current.values);
          //props.onSubmit(props.type, formattedData, props.refreshTable,  props.row.id,props.closeModalCallback);
        }
      }

      if(props.type==='delete'){
          props.onSubmit(props.type, {}, props.refreshTable,  props.row.id,props.closeModalCallback);

      }
    }
    
    
    if(props.type==='delete'){
      return (
        
          <div className={styles.formDelete}>
            <span>{"Sei sicuro di voler eliminare il record?"}</span>
          
          <div >
            <Button onClick={()=>props.closeModalCallback()}>Cancel</Button>
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
                        title: "Dati Offerta",
                        children: (
                          <div className={styles.parentForm} >
                             <Form
                                ref={formCustomer}
                                fields={Object.values(getFormOfferFields(formCustomerData,props.type))}
                                formData={formCustomerData}
                                onSubmit={(data: OfferModel) => setformCustomerData(data)}
                                addedFields={offertaCustomFields}
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