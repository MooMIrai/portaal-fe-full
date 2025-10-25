export function getSendContractForm (fixedTermContract: boolean, setFixedTermContract: (value: boolean) => void) {

    const sendContractForm = [
        {
            name: "date_log",
            label: "Data proposta economica",
            type: "date",
            required:true,
            validator:(value:any)=> {
                
                return value && value instanceof Date ?'':'Il campo Data è obbligatorio'}
        },
        {
            name: "ContractType",
            label: "Tipo contratto",
            type: "contracttype-selector",
            onChange: ({name}) => {
                const fixedTermContracts = ["Determinato", "Stage"];
                if (fixedTermContracts.includes(name)) setFixedTermContract(true);
                else setFixedTermContract(false);
            },
            required:true,
            validator:(value:any)=> {
                
                return value && value.id ?'':'Il campo Tipo contratto è obbligatorio'}
        },
        {
            name: "date_start_contract",
            label: "Data inizio contratto",
            type: "date",
            required:true,
            validator:(value:any)=> {
                
                return value && value instanceof Date ?'':'Il campo Data inizio contratto è obbligatorio'}
        },
        {
            name: "RAL",
            label: "Ral",
            type: "number"
        },
        {
            name: "Transfert",
            label: "Trasferta",
            type: "number"
        },
        {
            name:'notes',
            label:'Note',
            type:'textarea'
        }
    ];

    const date_end_contract = {
        name: "date_end_contract",
        label: "Data fine contratto",
        type: "date",
        required:true,
        validator: (value: any) =>  value && value instanceof Date ? '' : 'Il campo Data fine contratto è obbligatorio'
    };

    if (fixedTermContract) sendContractForm.splice(3, 0, date_end_contract as any);

    return sendContractForm;
}