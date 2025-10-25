import React, { forwardRef } from "react";
import styles from './style.module.scss';
import Form from 'common/Form';
import { MessageRecipientFormCustomFields } from "./fields";
import { MessageRecipientForm } from "./form";

export const RecipientsManager=forwardRef<any, any>(({  }, ref) => {


    return <div className={styles.container}>
        <Form
            ref={ref}
            fields={MessageRecipientForm}
            formData={{}}
            addedFields={MessageRecipientFormCustomFields}
            onSubmit={(data)=>data}
        />
        
        
    </div>

})