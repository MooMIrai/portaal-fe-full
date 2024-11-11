
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
            return res.data.filter(r => r.tenant_code === "TAAL").map(r => ({ id: r.id, name: r.description }));
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
    return CrudGenericService.searchCommerciale(filterP).then((res)=>{
        if(res ){
            return res.map(r=>({id:r.id,name:r.Person.firstName+ ' '+r.Person.lastName}));
        }
        return []
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

    const generateCompanyCode = (companyName) => {
        // Rimuove spazi multipli e trasforma tutto in maiuscolo
        const cleanName = companyName.trim().toUpperCase();
      
        // Se il nome ha almeno 5 caratteri, prendi le prime 3 e le ultime 2 lettere
        if (cleanName.length >= 5) {
          return cleanName.slice(0, 3) + cleanName.slice(-2);
        }
      
        // Se il nome ha meno di 5 caratteri, aggiunge lettere per arrivare a 5
        let code = cleanName.slice(0, 3); // Prende fino alle prime 3 lettere disponibili
        const remainingChars = 5 - code.length;
      
        // Aggiunge le lettere rimanenti alla fine del nome se disponibili
        code += cleanName.slice(-remainingChars);
      
        // Se ancora troppo corto, aggiunge "X" fino a raggiungere 5 caratteri
        return code.padEnd(5, 'X');
    }

    return <div style={{
        display: 'grid',
        gridTemplateColumns: "80% 20%"
    }}>
        <InputText {...props} style={{ borderEndEndRadius:0 ,borderStartEndRadius:0, width:'100%'}} label={undefined} />
        <Button style={{
            borderStartStartRadius:0,
            borderEndStartRadius:0
        }} themeColor="primary" type="button" onClick={()=>{
            let companyName = "";
            if(props.options()){
                companyName = props.options().name.toUpperCase().split(' ').join('');
            }
            let protocol = generateCompanyCode(companyName);
            const now = new Date();
            protocol+= now.getDate()+""+(now.getMonth()+1)+""+ now.getFullYear()
            props.onChange({value:protocol});
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

