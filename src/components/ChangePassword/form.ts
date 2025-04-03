
export const ChangePasswordForm=(valueOnChange: (field:string,value:any)=>void,values:any)=>[
    {
        name: "current_password",
        label: "Password Corrente",
        type: "password",
        valueOnChange:valueOnChange,
        required:true,
        validator:(val:any)=>{
            return !val || !val.length ? "Il Campo Password Corrente è obbligatorio":""
        }
    },
    {
        name: "new_password",
        label: "Password Nuova",
        type: "password",
        valueOnChange:valueOnChange,
        required:true,
        validator:(val:any)=>{
            if (!val || val.trim().length === 0) {
                return "Il Campo Password Nuova è obbligatorio";
              }
            
              const isValid =
                val.length >= 8 &&
                /[A-Z]/.test(val) &&
                /[a-z]/.test(val) &&
                /[0-9]/.test(val) &&
                /[!@#$%^&*(),.?":{}|<>]/.test(val);
            
              if (!isValid) {
                return "La password deve contenere almeno 8 caratteri, una lettera maiuscola, una minuscola, un numero e un carattere speciale (!@#$%^&* etc.).";
              }
            
              return undefined; // Nessun errore
        }
    },
    {
        name: "confirm_password",
        label: "Conferma Password Nuova",
        valueOnChange:valueOnChange,
        type: "password",
        required:true,
        validator:(val:any)=>{
            if (!val || val.trim().length === 0) {
                return "Il Campo Conferma Password è obbligatorio";
            }
            if(values.new_password && values.new_password!=val){
                return "Il Campo 'Password Nuova' e 'Conferma Password Nuova' devono coincidere";
            }
            return undefined;
        }
    }
]