
import withField from "common/hoc/Field"
import withAutoComplete from "common/hoc/AutoComplete"
import { offertaService } from "../../services/offertaService";
import { customerService } from "../../services/clienteService";
import { CrudGenericService } from "../../services/personaleServices";
import React from "react";
import InputText from "common/InputText";
import Button from "common/Button";

const getDataOutcome= (filterP:string)=>{
    return offertaService.getOutcomeType(filterP);
}

const getDataBilling= (filterP:string)=>{
    return offertaService.getBillingType(filterP);
}

const getProtocol = async (customer_code: string) => {
    const data = await offertaService.getProtocol(customer_code);
    const protocol = data.protocol;
    return protocol;
}

const getDataCustomer= (filterP:string)=>{
    return customerService.search(1,20,
        {"logic":"or","filters":[{"field":"name","operator":"contains","value":filterP}]
    }).then((res)=>{
        if(res ){
            return res.data
        }
    });
}
const getDataLocation = () => {
    return offertaService.fetchResources("location").then((res) => {
        if (res && res.data && Array.isArray(res.data)) {
            // Mappa sui dati correttamente
            return res.data.map(r => ({ id: r.id, name: r.description }));
        } else {
            console.warn("Formato della risposta non previsto:", res);
            return []; // Ritorna un array vuoto se il formato non è quello atteso
        }
    }).catch(error => {
        console.error("Errore nel recupero dei dati:", error);
        return [];
    });
};
const getDataCommerciale= (filterP:string)=>{
    return CrudGenericService.searchCommerciale(filterP).then((res) => {
        if(res) return res.map(r => ({id: r.id, name: `${r.Person.firstName} ${r.Person.lastName} (${r.email})`}));
        else return [];
    });
}

const getDataProjectType= (filterP:string)=>{
    return offertaService.getProjectType(filterP).then((res)=>{
        if(res){
            return res.data.data.map(p=>({id:p.id,name:p.description}));
        }
        return [];
    });
}

const ProtocolInput =  (
    props:any
  ) => {

    return <div style={{
        display: 'grid',
        gridTemplateColumns: "80% 20%"
    }}>
        <InputText {...props} style={{ borderEndEndRadius:0 ,borderStartEndRadius:0, width:'100%'}} label={undefined} />
        <Button style={{
            borderStartStartRadius:0,
            borderEndStartRadius:0
        }} themeColor="primary" type="button" onClick={async () => {
            const customer_code =  props.options()?.customer_code || "XXX";
            const protocol = await getProtocol(customer_code);
            props.onChange({ value: protocol });
        }}>
            Genera
        </Button>
        </div>
  };

export const offertaCustomFields = {
    "projecttype-selector":withField(withAutoComplete(getDataProjectType)),
    "commerciale-selector": withField(withAutoComplete(getDataCommerciale)),
    "customer-selector":withField(withAutoComplete(getDataCustomer)),
    "sede-selector": withField(withAutoComplete(getDataLocation)),
    "outcometype-selector":withField(withAutoComplete(getDataOutcome)),
    "billingtype-selector":withField(withAutoComplete(getDataBilling)),
    "protocol-input":withField(ProtocolInput)
}

