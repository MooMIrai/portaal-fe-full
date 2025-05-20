import { isEmpty } from "lodash";

const emailValidator = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) 
? "" 
: "Il campo deve contenere un indirizzo email";

export function getCreateAccountForm(formData: {email: string}) {

    const createAccountForm = [
        {
            name: "email",
            label: "Email aziendale",
            type: "text",
            required: true,
            disabled: !isEmpty(formData),
            validator: emailValidator
        },
    ];

    return createAccountForm;
}