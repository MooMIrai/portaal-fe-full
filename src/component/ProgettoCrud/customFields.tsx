import withField from "common/hoc/Field";
import withAutoComplete from "common/hoc/AutoComplete";
import { offertaService } from "../../services/offertaService";
import React from "react";


const getOfferte = (filterP: string) => {
    return offertaService.searchOfferte(filterP).then((res) => {
        if (res && res.data) {
            return res.data.map(r => ({ id: r.id, name: r.name }));
        }
        return [];
    });
}

export const AutoCompleteOfferte = withField(withAutoComplete(getOfferte))

const OfferData = (props:any)=>{

    return <>
        <div className="k-form-field" >
            <label className="k-label">Offerta di riferimento</label>
            <input type="text" value={props.value.name} disabled className="k-input k-input-md k-rounded-md k-input-solid" />
        </div>
        <div className="k-form-field">
            <label className="k-label">Cliente</label>
            <input type="text" value={props.value.Customer.name} disabled className="k-input k-input-md k-rounded-md k-input-solid" />
        </div>
        <div className="k-form-field" >
            <label className="k-label">Tipo Offerta</label>
            <input type="text" value={props.value.ProjectType.description} disabled className="k-input k-input-md k-rounded-md k-input-solid" />
        </div>
        <div className="k-form-field" >
            <label className="k-label">Anno Competenza</label>
            <input type="text" value={props.value.year} disabled className="k-input k-input-md k-rounded-md k-input-solid" />
        </div>
        {
            props.value.approval_date && <div className="k-form-field" >
            <label className="k-label">Data approazione offerta</label>
            <input type="text" value={new Date(props.value.approval_date).toLocaleDateString()} disabled className="k-input k-input-md k-rounded-md k-input-solid" />
        </div>
        }
        
        <div className="k-form-field" >
            <label className="k-label">Giorni Offerta</label>
            <input type="text" value={props.value.days} disabled className="k-input k-input-md k-rounded-md k-input-solid" />
        </div>
    </>
}

export const formFields = {
    "offerte-selector": AutoCompleteOfferte,
    "offerta-form":OfferData
};
