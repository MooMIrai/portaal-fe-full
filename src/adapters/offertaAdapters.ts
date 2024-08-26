import { OfferBEModel, OfferModel } from "../component/OffertaCrud/model";

export function fromOfferBEModelToOfferModel(offerBE: OfferBEModel): OfferModel {
    return {
        id: offerBE.id,
        protocol: offerBE.project_code, // mapping project_code to protocol
        title: offerBE.name, // mapping name to title
        start_date: new Date(offerBE.start_date),
        end_date: offerBE.end_date?new Date(offerBE.end_date):undefined, // fallback if end_date is undefined
        description: offerBE.other_details, // mapping other_details to description
        rate: offerBE.rate, 
        amount: offerBE.amount,

        customer_id: offerBE.customer_id ||0,
        customer_name: offerBE.Customer?.name + ' '+offerBE.Customer?.name,
        customer: {id:offerBE.customer_id||0,name:offerBE.Customer?offerBE.Customer.name:''},
        
        creation_date:offerBE.date_created?new Date(offerBE.date_created):undefined,
        
        accountManager_id: offerBE.accountManager_id ||0,
        accountManager: {id:offerBE.accountManager_id||0,name:offerBE.AccountManager?.Person.firstName + ' ' +offerBE.AccountManager?.Person.lastName},

        project_type_id: offerBE.project_type_id||0,
        project_type:offerBE.ProjectType?{id:offerBE.ProjectType.id,name:offerBE.ProjectType.description}:undefined,

        billing_type:{id:offerBE.billing_type,name:mapBillingTypeName(offerBE.billing_type)}, // hypothetical method for billing type conversion
        outcome_type:offerBE.OutcomeType?{id:offerBE.OutcomeType,name:mapOutcomeTypeName(offerBE.OutcomeType)}:undefined,

        year:new Date(offerBE.year,1,1),
        days:offerBE.days
        
    };
}

export function fromOfferModelToOfferBEModel(offerModel: OfferModel): OfferBEModel {
    return {
        id: offerModel.id,
        project_code: offerModel.protocol, // mapping protocol to project_code
        name: offerModel.title, // mapping title to name
        start_date: offerModel.start_date.toISOString(),
        end_date: offerModel.end_date?.toISOString() || undefined, // fallback to undefined if empty
        other_details: offerModel.description || "", // mapping description to other_details
        rate: offerModel.rate?parseFloat(offerModel.rate.toString()):0,
        amount: offerModel.amount?parseFloat(offerModel.amount.toString()):0,
        customer_id: offerModel.customer?.id,
        accountManager_id: offerModel.accountManager?.id,
        project_type_id: offerModel.project_type?.id,
        billing_type: offerModel.billing_type?offerModel.billing_type.id:"", // hypothetical method for billing type conversion
        OutcomeType: offerModel.outcome_type?.id,
        year:offerModel.year.getFullYear(),
        days:offerModel.days || 0
    };
}

export const mapBillingTypeName = (name:string)=>{
    switch (name){
        case "Daily":
            return 'Fatturazione a giornata';
        case "LumpSum":
            return 'Fatturazione a corpo';
    }
    return "Nessuna Fatturazione";
}

export const mapOutcomeTypeName = (name:string)=>{
    switch (name){
        case "P":
            return 'Positivo';
        case "N":
            return 'Negativo';
        case "A":
            return 'Annullato';
        case "R":
            return 'Rimandato';
    }
    return "Nessun esito";
}
