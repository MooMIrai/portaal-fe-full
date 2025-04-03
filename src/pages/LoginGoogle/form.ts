const emailValidator = (value: any) => {
    if (!value || !value.length) return "Il campo email è obbligatorio";
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "L'email non è valida";
};
export const LoginForm=[
    {
        name: "email",
        label: "Email",
        type: "email",
        required:true,
        validator: (value: any) => emailValidator(value),
    },
    {
        name: "password",
        label: "Password",
        type: "password",
        required:true,
        validator: (value: any) => value ? "" : "Il campo password è obbligatorio",
    }
]