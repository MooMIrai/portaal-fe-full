import withField from "common/hoc/Field";
import withAutoComplete from "common/hoc/AutoComplete";
import { CrudGenericService } from "../../services/personaleServices";

const getData = () => {
    return CrudGenericService.fetchResources("location").then((res) => {
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


const getDataWorkScope = () => {
    return CrudGenericService.fetchResources("WorkScope").then((res) => {
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

const getDataContractType = () => {
    return CrudGenericService.fetchResources("ContractType").then((res) => {
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
export const formFields = {
    "sede-selector": withField(withAutoComplete(getData)),
    "work-scope": withField(withAutoComplete(getDataWorkScope)),
    "contract-type":withField(withAutoComplete(getDataContractType)),
};
