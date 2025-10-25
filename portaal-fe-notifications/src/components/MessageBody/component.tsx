import React, { forwardRef } from "react";
import { MessageFormCustomFields } from "./fields";
import Form from 'common/Form';
import { MessageBodyForm } from "./form";

interface MessageBodyProps {
     // Callback chiamata dopo un submit valido
}

export const MessageBody = forwardRef<any, MessageBodyProps>(({  }, ref) => {
    
    return (
        <Form
            ref={ref}
            fields={MessageBodyForm}
            formData={{}}
            addedFields={MessageFormCustomFields}
            onSubmit={(data)=>data}
        />
    );
});
