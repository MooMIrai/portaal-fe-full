import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import Form from "common/Form";
import { FormField, NotificationParameter } from "../../models/FormModel";
import { formAdapter } from "../../adapters/FormAdapter";
import withField from "common/hoc/Field";
import withAutoComplete from "common/hoc/AutoComplete";

export const MessageResponseForm = forwardRef<any,{fields:NotificationParameter,onSubmit:(d:any)=>void}>(({ fields, onSubmit }, ref) => {
    const [formFields, setFormFields] = useState<FormField[]>();

    useEffect(() => {
        if (fields) {
            const f = formAdapter.adaptList(fields);
            setFormFields(f);
        }
    }, [fields]);

    

    if (formFields) {
        const addedField = {};
        const customFields = formFields.filter(f => f.type.includes('custom-autocomplete'));
        
        customFields.forEach(cf => {
            const type = cf.type.split('__')[1];
            addedField[cf.type] = withField(withAutoComplete((term) => {
                if (type === 'STATIC_LIST') {
                    return Promise.resolve(
                        cf.options.filter(p => !term || !term.length || p.toLowerCase().includes(term.toLowerCase()))
                            .map(p => ({ id: p, name: p }))
                    );
                } else if (type === 'DYNAMIC_LIST') {
                    return Promise.resolve(
                        cf.options.filter(p => !term || !term.length || p.description.toLowerCase().includes(term.toLowerCase()))
                            .map(p => ({ id: p.id, name: p.description }))
                    );
                } else {
                    return Promise.resolve([]);
                }
            }))
        });

        return (
            <Form
                ref={ref}
                fields={formFields}
                formData={{}}
                onSubmit={(data) => {
                   
                    return data;
                }}
                addedFields={addedField}
            />
        );
    }

    return <div>Nessun campo necessario</div>;
});


