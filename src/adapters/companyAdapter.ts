import {
  CompanyModel,
  CompanyModelBe,
} from "../component/SocietaCrud/modelForms";

export function fromBeToModel(beModel: CompanyModelBe): CompanyModel {
  return {
    id: beModel.id,
    name: beModel.name,
    code: beModel.code ?? null,
    phoneNumber: beModel.phoneNumber ?? "",
    address: beModel.address ?? "",
    province_id: beModel.province_id ?? null,
    country_id: beModel.country_id,
    zipCode: beModel.zipCode ?? "",
    taxCode: beModel.taxCode ?? "",
    vatNumber: beModel.vatNumber ?? "",
    city_id: beModel.city_id ?? null,
    sede: {
      country: beModel.Country
        ? {
            id: beModel.Country.id,
            name: beModel.Country.name,
            code: beModel.Country.code,
          }
        : { id: 0, name: "", code: "" },
      province: beModel.City?.Province
        ? {
            id: beModel.City?.Province.id,
            name: beModel.City?.Province.name,
            code: beModel.City?.Province.code,
          }
        : undefined,
      city: beModel.City
        ? {
            id: beModel.City.id,
            name: beModel.City.name,
            code: beModel.City.code,
          }
        : { id: 0, name: "", code: "" },
    },
  };
}

export function fromModelToBe(model: CompanyModel): CompanyModelBe {
  return {
    name: model.name,
    code: model.code ?? null,
    phoneNumber: model.phoneNumber ?? "",
    address: model.address ?? "",
    province_id: model.sede?.province?.id ?? null,
    country_id: model.sede?.country?.id,
    zipCode: model.zipCode ?? "",
    taxCode: model.taxCode ?? "",
    vatNumber: model.vatNumber ?? "",
    city_id: model.sede?.city?.id ?? null,
  };
}

export const reverseCompanyapterUpdate = (
  modifiedData: Record<string, any>
): Partial<CompanyModel> => {
  const result: Partial<CompanyModelBe> = {}; //rende tutte le proprietà opzionali

  // Mappatura dei campi base
  if ("name" in modifiedData) {
    result.name = modifiedData.name;
  }

  if ("code" in modifiedData) {
    result.code = modifiedData.code;
  }

  if ("phoneNumber" in modifiedData) {
    result.phoneNumber = modifiedData.phoneNumber;
  }

  if ("address" in modifiedData) {
    result.address = modifiedData.adress;
  }

  if ("sede" in modifiedData) {
    result.country_id = modifiedData.sede?.country?.id;
    result.city_id = modifiedData.sede?.city?.id;
    result.province_id = modifiedData.sede?.province?.id;
  }
  if ("zipCode" in modifiedData) {
    result.zipCode = modifiedData.zipCode;
  }
  if ("taxCode" in modifiedData) {
    result.taxCode = modifiedData.taxCode
  }
  if("vatNumber" in modifiedData){
    result.vatNumber = modifiedData.vatNumber
  }
  return result;
};
