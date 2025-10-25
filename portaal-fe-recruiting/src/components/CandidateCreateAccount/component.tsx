import React, { useEffect, useState } from "react";
import Form from 'common/Form';
import { getCreateAccountForm } from "./form";
import { candidatoService } from "../../services/candidatoService";
import NotificationProviderActions from "common/providers/NotificationProvider";
import { isEmpty } from "lodash";

interface RecruitingCreateAccount {
    email: string;
}

interface CandidateCreateAccountProps {
    onChange: (value: RecruitingCreateAccount) => void;
    currentData: RecruitingCreateAccount;
    person_id: number;
}


export default function CandidateCreateAccount (props: CandidateCreateAccountProps) {

    const [formData, setFormData] = useState<RecruitingCreateAccount>();

    useEffect(() => {
        setFormData({...props.currentData});
    }, [props.currentData]);

    function onSubmit (data: {email: string}) {

        candidatoService.createAccount({...data, person_id: props.person_id}).then(result => {

            NotificationProviderActions.openModal({ icon: true, style: "success" }, "Operazione avvenuta con successo");
            props.onChange(result);

        });
    }
    
    return (

        <div style={{ display: "flex", flexDirection: 'column', gap: 20, margin: 50, marginTop: 20 }}>
            
            <h2>Creazione Account</h2>

            {formData && <Form
                submitText={'Crea'}
                showSubmit={isEmpty(formData)}
                fields={getCreateAccountForm(formData)}
                formData={formData}
                onSubmit={onSubmit}
                description="Creazione account"
            />}

        </div>
    );
}