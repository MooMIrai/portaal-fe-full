import { contractService } from "../../services/contractService";
import withField from "common/hoc/Field";
import withAutoComplete from "common/hoc/AutoComplete";

const getDataContractType = (term:string) => {
    return contractService.getAll().then((res) => {
        if (res && res.data && Array.isArray(res.data)) {
            // Mappa sui dati correttamente
            return res.data.map(r => ({ id: r.id, name: r.description }))
            .filter(p=>!term || !term.length || p.name.toLocaleLowerCase().indexOf(term)>=0);
        } 
    });
};

export const sendContractAddedFields={
    "contracttype-selector":withField(withAutoComplete(getDataContractType))
}

