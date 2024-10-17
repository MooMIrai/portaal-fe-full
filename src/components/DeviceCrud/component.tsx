import React, { useRef, useState } from 'react'
import Form from 'common/Form';
import { getFormDeviceFields } from './form';
import Button from 'common/Button'
import Tab from 'common/Tab'
import { deviceCustomFields } from './customFields';
import { DeviceHistory } from '../DeviceHistory/component';

import styles from './style.module.scss'

type DeviceCrudProps = {
    row: any;
    type: string;
    closeModalCallback: () => void;
    refreshTable: () => void;
    onSubmit: (type: string, formData: any, refreshTable: () => void, id: any,closeModal:()=>void) => void;
  };

export default function DeviceCrud(props:DeviceCrudProps){

    const formDevice = useRef<any>();

    const [formDeviceData,setformDeviceData] = useState<any>(props.row);

    const [selectedTab,setSelectedTab] = useState<number>(0)
    
    const handleSubmit = () => {
      let hasError = false;
 
      if (props.type === "create" || props.type === "edit" ) {
        if (formDevice.current) {
          formDevice.current.onSubmit();
          hasError = !formDevice.current.isValid()
        }

  
      if (!hasError) {

        const formattedData = {
          ...formDevice.current.values,
          deviceType_id:formDevice.current.values.DeviceType.id,
          Attachment:formDevice.current.values.files
        }
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
  

      const tabs = [
        {
            title: "Dati Cliente",
            children: (
              <div className={styles.parentForm} >
                 <Form
                      ref={formDevice}
                      fields={Object.values(getFormDeviceFields(formDeviceData,props.type))}
                      formData={formDeviceData}
                      onSubmit={(data) => setformDeviceData(data)}
                      addedFields={deviceCustomFields}
                  />
              </div>
            ),
          } 
    ]

    if((props.type==='edit' || props.type==='view') && props.row){
      tabs.push({
        title: "Storico Assegnazioni",
        children: (
          <DeviceHistory id={props.row.id} />
        ),
      },)
    }

      return <Tab 

              tabs={tabs}
              onSelect={(e)=>{
                setSelectedTab(e.selected)
              }}
              selected={selectedTab}
              button={{ label: props.type === 'view' ? "Esci" : "Salva", onClick: handleSubmit }}
      />
  }
   