import { OfferBEModel } from "../OffertaCrud/model";

/* START OF BE MODEL */

export interface ProjectBEModel {
  id: number;
  start_date: string;
  end_date: string;
  ProjectState: string;
  rate: number;
  amount: number;
  orderNum: any;
  waitingForOrder: boolean;
  offer_id: number;
  date_created: string;
  date_modified: string;
  user_created: string;
  user_modified: string;
  tenant_code: string;
  Offer: OfferProject;
  Activities: ActivityProject[];
}

interface OfferProject {
  id: number;
  project_code: string;
  year: number;
  name: string;
  days: any;
  other_details: string;
  rate: number;
  amount: number;
  customer_id: number;
  accountManager_id: number;
  project_type_id: number;
  location_id: number;
  deadline_date: string;
  noCollective: boolean;
  approval_date: any;
  data: any;
  billing_type: string;
  OutcomeType: string;
  date_created: string;
  date_modified: string;
  user_created: string;
  user_modified: string;
  tenant_code: string;
  files: any[];
  ProjectType: ProjectType;
  Customer: CustomerProject;
  AccountManager: AccountManagerP;
  Skills: SkillProject[];
}

interface ProjectType {
  id: number;
  code: string;
  description: string;
  billing_type: string;
  tenant_code: string;
}

interface CustomerProject {
  id: number;
  customer_code: string;
  name: string;
  phoneNumber: string;
  web_site: string;
  fax: string;
  email: string;
  note: string;
  address: string;
  city_id: any;
  country_id: number;
  zipCode: string;
  taxCode: string;
  vatNumber: string;
  data: any;
  tenant_code: string;
}

interface AccountManagerP {
  id: number;
  email: string;
  person_id: number;
  accountStatus_id: any;
  Person: PersonProject;
}

interface PersonProject {
  id: number;
  tenant_codes: string[];
  firstName: string;
  lastName: string;
  phoneNumber: string;
  phoneNumber2: any;
  address: string;
  privateEmail: string;
  dateBirth: string;
  bankAddress: any;
  zipCode: string;
  taxCode: any;
  vatNumber: any;
  employee_id: any;
  note: any;
  cityBirth_id: number;
  cityRes_id: number;
  gender_id: number;
  data: any;
  date_created: string;
  date_modified: string;
  user_created: string;
  user_modified: string;
  location_id: number;
  files: any[];
}

interface SkillProject {
  id: number;
  code: string;
  name: string;
  description: string;
  type: string;
  altLabels: string;
  hiddenLabels: string;
  scopeNote: string;
  definition: string;
  inScheme: string;
  date_created: string;
  date_modified: string;
}

interface ActivityProject {
  id: number;
  description: string;
  start_date: string;
  end_date: string;
  project_id: number;
  activityType_id: number;
  activityManager_id: number;
  date_created: string;
  date_modified: string;
  user_created: string;
  user_modified: string;
  tenant_code: string;
  ActivityType: ActivityTypeProject;
  PersonActivities: PersonActivityProject[];
}

interface ActivityTypeProject {
  id: number;
  code: string;
  description: string;
  productive: boolean;
  isHoliday: boolean;
  time_unit: any;
  tenant_code: string;
}

interface PersonActivityProject {
  id: number;
  person_id: number;
  activity_id: number;
  start_date: string;
  end_date: string;
  expectedDays: any;
  Person: PersonProject;
  Sal: SalProject[];
}

interface SalProject {
  id: number;
  year: number;
  month: number;
  actualDays: any;
  rate: any;
  amount: number;
  SalState: string;
  notes: string;
  person_id: number;
  activity_id: number;
  Bill: BillProject;
}

interface BillProject {
  id: number;
  actualDays: number;
  amount: number;
  billing_date: string;
  billing_number: string;
  advancePayment: string;
  notes: string;
  sal_id: number;
}

/* END OF BE MODEL */

/* START OF FE MODEL */
export interface ProjectModel {
  id: number;
  account_manager: string;
  title: string;
  start_date: Date;
  end_date: Date;
  amount: number;
}
/* END OF BE MODEL */
