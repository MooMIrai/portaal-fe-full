import {
  ProfileBEModel,
  ProfileModel,
} from "../components/profileDashboard/model";

export function fromProfileBEModelToProfileModel(
  profileBE: ProfileBEModel
): ProfileModel {
  return {
    firstName: profileBE.Person.firstName,
    lastName: profileBE.Person.lastName,
    email: profileBE.Person.privateEmail,
    companyEmail: profileBE.email,
    telephone: profileBE.Person?.phoneNumber,
    workPhone: profileBE.Person?.phoneNumber2,
    birthDate: profileBE.Person?.dateBirth,
    cap: profileBE.Person?.zipCode,
    fiscalCode: profileBE.Person?.taxCode,
    employeeId: profileBE.Person?.employee_id,
    iban: profileBE.Person?.bankAddress,
    sex: profileBE.Person?.Gender?.code,
    provinceBirth: profileBE.Person?.CityBirth?.Province?.name,
    provinceResidence: profileBE.Person?.CityRes?.Province?.name,
    cityBirth: profileBE.Person?.CityBirth?.name,
    cityResidence: profileBE.Person?.CityRes?.name,
    residenceAddress: profileBE.Person?.address,
  };
}
