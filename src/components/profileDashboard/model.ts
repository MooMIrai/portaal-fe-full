export interface ProfileBEModel {
  AccountStatus: any;
  Offers: any;
  Person: {
    Activity: any;
    ActivityType: any;
    CityBirth: {
      Country: { id: number; code: string; name: string };
      Province: any;
      city_abbreviation: string;
      code: string;
      country_id: number;
      id: number;
      name: string;
      province_id: any;
    };
    CityRes: {
      Country: { id: number; code: string; name: string };
      Province: any;
      city_abbreviation: string;
      code: string;
      country_id: number;
      id: number;
      name: string;
      province_id: any;
    };
    EmploymentContract: any;
    Gender: { id: number; code: string };
    TimeSheet: any;
    address: string;
    attachment_id: any;
    bankAddress: any;
    cityBirth_id: number;
    cityRes_id: number;
    data: any;
    dateBirth: string;
    date_created: string;
    date_modified: string;
    employee_id: any;
    firstName: string;
    gender_id: number;
    id: number;
    lastName: string;
    location_id: number;
    note: any;
    phoneNumber: string;
    phoneNumber2: string;
    privateEmail: any;
    taxCode: any;
    user_created: string;
    user_modified: string;
    vatNumber: any;
    zipCode: string;
  };
  Roles: Array<{
    date_created: string;
    date_modified: string;
    description: string;
    id: number;
    role: string;
    user_created: string;
    user_modified: string;
  }>;
  accountStatus_id: any;
  email: string;
  id: number;
  person_id: number;
}

export interface ProfileModel {
  firstName: string;
  lastName: string;
  companyEmail: string;
  employeeId: string;
  sex: string;
  provinceBirth: string;
  cityBirth: string;
  provinceResidence: string;
  cityResidence: string;
  residenceAddress: string;
  birthDate: string;
  cap: string;
  telephone: string;
  workPhone: string;
  email: string;
  iban: string;
  fiscalCode: string;
}
