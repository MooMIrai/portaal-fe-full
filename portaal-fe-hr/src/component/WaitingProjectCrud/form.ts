import withField from "common/hoc/Field";
import withAutoComplete from "common/hoc/AutoComplete";
import { CompanyServices } from "../../services/companyServices";

const getDataCustomer= (filterP:string)=>{
    return CompanyServices.getCompany(1,20,
        {"logic":"or","filters":[{"field":"name","operator":"contains","value":filterP}]
    },[],undefined).then((res)=>{
        if(res ){
            return res.data
        }
    });
}

export const WaitingProjectCustomFields={
    "company-selector":withField(withAutoComplete(getDataCustomer))
}

 export const WaitingProjectFormFields=[
    {
        name: "firstName",
        label: "Nome",
        type: "text",
        required: false,
        disabled: true
    },
    {
        name: "lastName",
        label: "Cognome",
        type: "text",
        disabled: true
    },
    {
        name: "dailyCost",
        label: "Costo giornaliero",
        type: "number"
    },
    {
        name: "startDate",
        label: "Data inizio",
        type: "date"
    },
    {
        name: "notes",
        label: "Note",
        type: "textarea"
    },
    {
        name: "projectStartDate",
        label: "Data inizio progetto",
        type: "date"
    },
    {
        name: "Company",
        label: "Società",
        type: "company-selector"
    }
]