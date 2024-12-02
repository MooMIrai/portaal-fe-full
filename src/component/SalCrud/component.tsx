import React, { PropsWithRef, useEffect, useRef, useState } from "react";
import { customFieldsSal, getFormFields } from "./form";
import Form from 'common/Form';
import { salService } from "../../services/salService";
import NotificationActions from 'common/providers/NotificationProvider';

type SalCrudProps = {
    project:any,
    otherSal?:Array<any>,
    row: any;
    type: string;
    closeModalCallback: () => void;
    refreshTable: () => void;
    onSubmit: (type: string, formData: any, refreshTable: () => void, id: any,closeModal:()=>void) => void;
  };

  const getDateFromData= (year?:number,month?:number)=>{
    if(year && month){
        return new Date(year,month-1,1)
    }
    return null
}
export function SalCrud(props:PropsWithRef<SalCrudProps>){

    const formSal = useRef<any>();
    const [formSalData,setFormSalData] = useState<any>(props.row);


    const onChange = (fieldName:string,val:any)=>{
      setFormSalData((prev)=>{
        return {...prev,[fieldName]:val}
      });
    }

    const handleSubmit = (data:any) => {
        let action= Promise.resolve()
        const mappedObj = {
          year:formSal.current.values.monthyear.getFullYear(),
          month:formSal.current.values.monthyear.getMonth()+1,
          notes:formSal.current.values.notes,
          project_id:props.project.id,
          amount:formSal.current.values.money.finalAmount,
          actualDays:formSal.current.values.money.effectiveDays,
          SalState:'PENDING'
        };
        if(props.type==='create'){
          action =salService.createResource(mappedObj);
        } else if(props.type==='edit'){
          action=salService.updateResource(props.row.id,mappedObj)
        }

        action.then(res=>{
          NotificationActions.openModal(
            { icon: true, style: "success" },
            "Operazione avvenuta con successo "
          );
          props.refreshTable();
          props.closeModalCallback();

        })
    }

    useEffect(()=>{
      if(props.type==='delete'){
        NotificationActions.openConfirm('Sei sicuro di rimuovere il SAL?',
        () => {
         salService.deleteResource(props.row.id).then(()=>{
            NotificationActions.openModal(
              { icon: true, style: "success" },
              "Operazione avvenuta con successo "
            );
            props.closeModalCallback();
            props.refreshTable();
          })
  
        },
        'Cancella SAL'
      )
      }
    },[props.type])

    const mappedData = {
      ...formSalData,
      money:formSalData,
     
    }

    if(!mappedData.monthyear && mappedData.year && mappedData.month){
      mappedData.monthyear=getDateFromData(mappedData.year,mappedData.month);
    } 

    return <>{props.type!='delete'?<Form
              ref={formSal}
              addedFields={customFieldsSal}
              fields={getFormFields(mappedData,onChange,props.type,props.project,props.otherSal)}
              formData={mappedData}
              onSubmit={handleSubmit}
              submitText="Salva"
              showSubmit
          />:<div>delete</div>}
         
          </>
}