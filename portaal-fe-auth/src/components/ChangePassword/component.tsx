import Form from "common/Form";
import React, { useCallback, useRef, useState } from "react";
import Card from "common/CustomCard";
import { ChangePasswordForm } from "./form";
import styles from "./style.module.scss";
import { ProfileService } from "../../services/profileService";
import NotificationActions from 'common/providers/NotificationProvider';

export function ChangePassword(){

    const formRef = useRef<any>();
    const [values,setValues] = useState({});

    const handleValueChange=useCallback(()=>{
        if(formRef.current){
            setValues(()=>{
                return formRef.current.values;
            })
        }
    },[formRef]);

    const formdata = useCallback(()=>ChangePasswordForm(handleValueChange, values),[values])

    return <Card 
    container={{ class: "" }}
    header={{
      class: styles.headerContainer,
      element: <span>Cambia Password</span>,
    }}
    body={{
      class: styles.formContainer,
      element:<Form
      ref={formRef}
      fields={formdata()}
      formData={{}}
      onSubmit={(v:any)=>{
        ProfileService.changePassword(v).then(()=>{
            NotificationActions.openModal(
                { icon: true, style: "success" },
                "Operazione avvenuta con successo "
              );
            if(formRef.current){
                formRef.current.resetForm();
                setValues({})
            }
        });
      }}
      showSubmit
      submitText={'Cambia Password'}
  />
    }}>
        
    </Card>

}