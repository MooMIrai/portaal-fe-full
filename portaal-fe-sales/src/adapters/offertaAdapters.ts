import { OfferBEModel, OfferModel } from "../component/OffertaCrud/model";
import { getUTCDate } from "./utils";

export type locationOption = {
  label: string;
  value: number;
};
type LocationApiResponse = {
  data: Array<{
    id: number;
    code: string;
    description: string;
  }>;
  meta: {
    total: number;
  };
};
export const sedeAdapter = (
  apiResponse: LocationApiResponse
): locationOption[] => {
  return apiResponse.data.map((country) => ({
    label: country.description,
    value: country.id,
  }));
};

export function fromOfferBEModelToOfferModel(
  offerBE: OfferBEModel
): OfferModel {
  return {
    id: offerBE.id,
    protocol: offerBE.project_code, // mapping offer_name to protocol
    title: offerBE.name, // mapping name to title
    /* start_date: new Date(offerBE.start_date), */
    end_date: offerBE.deadline_date
      ? new Date(offerBE.deadline_date)
      : undefined,
    description: offerBE.other_details,
    rate: offerBE.rate,
    amount: offerBE.amount,
    NoCollective: offerBE.noCollective || false,
    customer_id: offerBE.customer_id || 0,
    customer_name: offerBE.Customer?.name,
    customer: {
      id: offerBE.customer_id || 0,
      name: offerBE.Customer ? offerBE.Customer.name : "",
    },
    creation_date: offerBE.date_created
      ? new Date(offerBE.date_created)
      : undefined,
    approval_date: offerBE.approval_date
      ? new Date(offerBE.approval_date)
      : undefined,
    accountManager_id: offerBE.accountManager_id || 0,
    accountManager: {
      id: offerBE.accountManager_id || 0,
      name:
        offerBE.AccountManager?.Person.firstName +
        " " +
        offerBE.AccountManager?.Person.lastName,
    },
    project_type_id: offerBE.project_type_id || 0,
    project_type: offerBE.ProjectType
      ? { id: offerBE.ProjectType.id, name: offerBE.ProjectType.description }
      : undefined,
    location_id: offerBE.location_id,
    billing_type: offerBE.billing_type ? {
      id: offerBE.billing_type,
      name: mapBillingTypeName(offerBE.billing_type),
    } : undefined, // hypothetical method for billing type conversion
    outcome_type: offerBE.OutcomeType
      ? {
          id: offerBE.OutcomeType,
          name: mapOutcomeTypeName(offerBE.OutcomeType),
        }
      : undefined,
    existingFile: offerBE.files,
    year: offerBE.year ? new Date(offerBE.year, 1, 1) : undefined,
    thereIsFile: Array.isArray(offerBE.files) && offerBE.files.length > 0,
    days: offerBE.days,
    thereisProject: offerBE.Project ? true : false,
    files:offerBE.files
  };
  
}

export function fromOfferModelToOfferBEModel(
  offerModel: OfferModel
): OfferBEModel {

  let files = offerModel.attachment;
  if(offerModel.attachment){
    if(offerModel.attachment.create)
      files.create = files.create.map(f=>({...f,property:'files'}))
    if(offerModel.attachment.delete && offerModel.attachment.delete.deletedFiles)
      offerModel.attachment.delete.deletedFiles = offerModel.attachment.delete.deletedFiles.map(f=>({...f,property:'files'}))
  }

  return {
    id: offerModel.id,
    project_code: offerModel.protocol, // mapping protocol to offer_name
    name: offerModel.title, // mapping title to name
    Attachment: files,
    deadline_date: getUTCDate(offerModel.end_date)?.toISOString() || undefined, // fallback to undefined if empty
    other_details: offerModel.description || "", // mapping description to other_details
    rate: offerModel.rate && parseFloat(offerModel.rate.toString()),
    amount: offerModel.amount && parseFloat(offerModel.amount.toString()),
    customer_id: offerModel.customer?.id,
    location_id: offerModel.location?.id || 1,
    accountManager_id: offerModel.accountManager?.id,
    project_type_id: offerModel.project_type?.id,
    billing_type: offerModel.billing_type ? offerModel.billing_type.id : undefined,
    OutcomeType: offerModel.outcome_type?.id,
    year: offerModel.year ? offerModel.year.getFullYear() : undefined,
    days: offerModel.days && Number(offerModel.days),
    noCollective: offerModel.NoCollective,
    approval_date: getUTCDate(offerModel.approval_date)?.toISOString() || undefined,
    ProjectData: offerModel.start_date
      ? {
          start_date: getUTCDate(offerModel.start_date)?.toISOString() || "",
          end_date: getUTCDate(offerModel.end_dateP)?.toISOString() || undefined,
          orderNum: offerModel.orderNum || undefined,
          waitingForOrder: offerModel.waitingForOrder || false,
        }
      : undefined,
  };
}

// Funzione per convertire un oggetto modificato `OfferModel` in un oggetto `OfferBEModel`
export const reverseOfferAdapterUpdate = (
  modifiedData: Record<string, any>,
  baseData: OfferModel
): Partial<OfferBEModel> => {
  const result: Partial<OfferBEModel> = {}; //rende tutte le proprietà opzionali
  console.log();
  // Mappatura dei campi base
  if ("protocol" in modifiedData) {
    result.project_code = modifiedData.protocol;
  }

  if ("title" in modifiedData) {
    result.name = modifiedData.title;
  }

  if ("description" in modifiedData) {
    result.other_details = modifiedData.description;
  }

  if ("amount" in modifiedData) {
    result.amount = parseFloat(modifiedData.amount.toString()) || 0;
  }

  if ("customer" in modifiedData) {
    result.customer_id = modifiedData.customer?.id;
  }

  if ("location" in modifiedData) {
    result.location_id = modifiedData.location?.id;
  }

  if ("accountManager" in modifiedData) {
    result.accountManager_id = modifiedData.accountManager.id;
  }

  if ("project_type" in modifiedData) {
    result.project_type_id = modifiedData.project_type.id;
  }

  if ("billing_type" in modifiedData) {
    result.billing_type = modifiedData.billing_type.id;
  }

  if ("outcome_type" in modifiedData) {
    result.OutcomeType = modifiedData.outcome_type.id;
  }

  if ("end_date" in modifiedData) {
    result.deadline_date = modifiedData.end_date?.toISOString();
  }

  if ("attachment" in modifiedData) {
    result.Attachment = modifiedData.attachment;
  }

  if ("noCollective" in modifiedData) {
    result.noCollective = modifiedData.noCollective;
  }

  if ("year" in modifiedData) {
    result.year = new Date(modifiedData.year).getFullYear();
  }

  if ("days" in modifiedData || "rate" in modifiedData) {
    if ("days" in modifiedData) {
      result.days = Number(modifiedData.days) || 0;
    } else {
      result.days = Number(baseData.days);
    }
    if ("rate" in modifiedData) {
      result.rate = parseFloat(modifiedData.rate.toString()) || 0;
    } else {
      result.rate = parseFloat(baseData.rate?.toString());
    }
  }

  if ("start_date" in modifiedData) {
    result.ProjectData = {
      start_date: modifiedData.start_date?.toISOString(),
      end_date: modifiedData.end_date?.toISOString(),
      orderNum: modifiedData.orderNum,
      waitingForOrder: modifiedData.waitingForOrder || false,
    };
  }
  return result;
};

export const mapBillingTypeName = (name: string) => {
  switch (name) {
    case "Daily":
      return "Fatturazione a giornata";
    case "LumpSum":
      return "Fatturazione a corpo";
  }
  return "Nessuna Fatturazione";
};

export const mapOutcomeTypeName = (name: string) => {
  switch (name) {
    case "P":
      return "Positivo";
    case "N":
      return "Negativo";
    case "A":
      return "Annullato";
    case "R":
      return "Rimandato";
    case "W":
      return "In Attesa";
    case "C":
      return "Chiuso";
  }
  return "Nessun esito";
};
