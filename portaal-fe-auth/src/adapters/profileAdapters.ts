import {
  ProfileBEModel,
  ProfileModel,
} from "../components/profileDashboard/model";

export function fromProfileBEModelToProfileModel(
  profileBE: ProfileBEModel
): ProfileModel {
  return {
    firstName: profileBE.firstName,
    lastName: profileBE.lastName,
    email: profileBE.privateEmail,
    companyEmail: profileBE.email,
    telephone: profileBE?.phoneNumber,
    workPhone: profileBE?.phoneNumber2,
    birthDate: profileBE?.dateBirth,
    cap: profileBE?.zipCode,
    fiscalCode: profileBE?.taxCode,
    employeeId: profileBE?.employee_id,
    iban: profileBE?.bankAddress,
    sex: profileBE?.Gender?.code,
    provinceBirth: profileBE?.CityBirth?.Province?.name,
    provinceResidence: profileBE?.CityRes?.Province?.name,
    cityBirth: profileBE?.CityBirth?.name,
    cityResidence: profileBE?.CityRes?.name,
    residenceAddress: profileBE?.address,
  };
}
