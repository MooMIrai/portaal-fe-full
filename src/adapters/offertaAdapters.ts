import { OfferBEModel, OfferModel } from "../component/OffertaCrud/model";

export function fromOfferBEModelToOfferModel(offerBE: OfferBEModel): OfferModel {
    return {
        id: offerBE.id,
        protocol: offerBE.project_code, // mapping project_code to protocol
        title: offerBE.name, // mapping name to title
        start_date: offerBE.start_date,
        end_date: offerBE.end_date ?? '', // fallback if end_date is undefined
        description: offerBE.other_details, // mapping other_details to description
        rate: offerBE.rate, 
        amount: offerBE.amount,

        customer_id: offerBE.customer_id,
        customer_name: offerBE.Customer?.name + ' '+offerBE.Customer?.name,
        customer: {id:offerBE.customer_id,name:offerBE.Customer?offerBE.Customer.name:''},
        
        creation_date:offerBE.date_created?new Date(offerBE.date_created):undefined,
        
        accountManager_id: offerBE.accountManager_id,
        accountManager: {id:offerBE.accountManager_id,name:offerBE.AccountManager?.Person.firstName + ' ' +offerBE.AccountManager?.Person.lastName},

        project_type_id: offerBE.project_type_id,
        billing_type_id: parseBillingType(offerBE.billing_type) // hypothetical method for billing type conversion
    };
}

export function fromOfferModelToOfferBEModel(offerModel: OfferModel): OfferBEModel {
    return {
        id: offerModel.id,
        project_code: offerModel.protocol, // mapping protocol to project_code
        name: offerModel.title, // mapping title to name
        start_date: offerModel.start_date,
        end_date: offerModel.end_date || undefined, // fallback to undefined if empty
        other_details: offerModel.description, // mapping description to other_details
        rate: offerModel.rate,
        amount: offerModel.amount,
        customer_id: offerModel.customer_id,
        accountManager_id: offerModel.accountManager_id,
        project_type_id: offerModel.project_type_id,
        billing_type: parseBillingTypeId(offerModel.billing_type_id) // hypothetical method for billing type conversion
    };
}

// Metodo ipotetico per convertire billing_type_id numerico in billing_type stringa
function parseBillingTypeId(billingTypeId: number): string {
    switch(billingTypeId) {
        case 1:
            return 'hourly';
        case 2:
            return 'fixed';
        // aggiungere altre logiche di conversione se necessario
        default:
            return 'unknown'; // Default fallback
    }
}


// Metodo ipotetico per convertire billing_type stringa in billing_type_id numerico
function parseBillingType(billingType: string): number {
    switch(billingType) {
        case 'hourly':
            return 1;
        case 'fixed':
            return 2;
        // aggiungere altre logiche di conversione se necessario
        default:
            return 0; // Default fallback se non corrisponde
    }
}

