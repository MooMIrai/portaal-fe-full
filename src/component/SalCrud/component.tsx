import React, { PropsWithRef, useEffect, useRef, useState } from "react";
import { customFieldsSal, getFormFields } from "./form";
import Form from 'common/Form';
import { salService } from "../../services/salService";
import NotificationActions from 'common/providers/NotificationProvider';
import Button from 'common/Button';
import {fileAddIcon, stampIcon} from 'common/icons';

type SalCrudProps = {
    project:any,
    otherSal?:Array<any>,
    row: any;
    type: string;
    closeModalCallback: () => void;
    refreshTable: () => void;
    onNext:()=>Promise<any>
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

    const handleSubmit = () => {
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
          if(formSalData.SalState==='BILLING_OK'){
            const billData={
              amount: formSal.current.values.amountBill?parseFloat(formSal.current.values.amountBill):undefined,
              billing_date: formSal.current.values.billing_date,
              billing_number: formSal.current.values.billing_number,
              advancePayment: formSal.current.values.advancePayment,
              sal_id:formSalData.id
            }
            if(!formSalData.Bill){
              action = salService.createBill(billData);
            }else{
              action = salService.updateBill(formSalData.Bill.id,billData);
            }
          }else{
            action=salService.updateResource(props.row.id,mappedObj);
          }
          
        }

        return action.then(res=>{
          NotificationActions.openModal(
            { icon: true, style: "success" },
            "Operazione avvenuta con successo "
          );
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
      amountBill:formSalData.Bill?formSalData.Bill.amount:formSalData.amount,
      advancePayment: formSalData.Bill?.advancePayment,
      billing_number: formSalData.Bill?.billing_number,
      billing_date: formSalData.Bill?.billing_date
    }


    if(!mappedData.monthyear){
      if( mappedData.year && mappedData.month){
        mappedData.monthyear=getDateFromData(mappedData.year,mappedData.month);
      } else if(props.project.lastSal){
        const d=  new Date(props.project.lastSal);

        mappedData.monthyear =getDateFromData(d.getFullYear(),d.getMonth()+2);
      }else if(props.project.start_date){
        const d=  new Date(props.project.start_date);

        mappedData.monthyear =getDateFromData(d.getFullYear(),d.getMonth()+2);
      }
    }

    

    return <>{
      props.type!='delete'?<><Form
              ref={formSal}
              addedFields={customFieldsSal}
              fields={getFormFields(mappedData,onChange,props.type,props.project,props.otherSal)}
              formData={mappedData}
              onSubmit={()=>handleSubmit().then(()=>{
                props.refreshTable();
                props.closeModalCallback();
              })}
              submitText="Salva"
              showSubmit={props.type!='show'}
          />
          {
            <div style={{display:'flex',justifyContent:'flex-end',marginTop:10}}>
              <Button disabled={props.row.SalState==='BILLED'} svgIcon={
                props.row.SalState==='PENDING'?fileAddIcon:stampIcon
              } onClick={()=>{
                handleSubmit().then(props.onNext).then(()=>{
                  props.refreshTable();
                  props.closeModalCallback();
                });
              }}>{props.row.SalState==='PENDING'?'Invia a fatturare':props.row.SalState==='BILLING_OK'?'Conferma Fattura':'Fatturato'}</Button>
              </div>
          }
          </>
          :<div>delete</div>}
         
          </>
}