import { AnagraficaData, TrattamentoEconomicoData, RuoliData, PermessiData } from "../component/TabPersonaleHR/modelForms";

const sedeOptions = [
  { label: "Barletta", value: 1 },
  { label: "Milano", value: 2 },
  { label: "Roma", value: 3 },
];

const mapSedeToValue = (sedeLabel:string) => {
  const option = sedeOptions.find(option => option.label === sedeLabel);
  return option ? option.value : null;
};

const mapValueToSede = (sedeValue:any) => {
  const option = sedeOptions.find(option => option.value === sedeValue);
  return option ? option.label : "";
};
const genderOptions = [
  { label: "Maschio", value: 1 },
  { label: "Femmina", value: 0 },
];

const mapGenderToValue = (genderLabel: string) => {
  const option = genderOptions.find(option => option.label === genderLabel);
  return option ? option.value : null;
};

const mapValueToGender = (genderValue: any) => {
  const option = genderOptions.find(option => option.value === genderValue);
  return option ? option.label : "";
};
const mapToAnagraficaData = (Person: any): AnagraficaData => ({
  person_id: Person?.id,
  accountStatus_id:Person?.accountStatus_id,
  nome: Person?.firstName || "",
  cognome: Person?.lastName || "",
  email: Person?.privateEmail || "",
  matricola: Person?.employee_id || "",
  sesso: mapValueToGender(Person?.gender_id) || 1,
  Provincianascita: Person?.provinceBirth || "",
  comuneNascita: Person?.cityBirth || "",
  residenza: Person?.provinceRes || "",
  comuneResidenza: Person?.cityRes || "",
  indirizzoResidenza: Person?.address || "",
  dataNascita: Person?.dateBirth ? new Date(Person.dateBirth) : null,
  cap: Person?.zipCode ? parseInt(Person.zipCode, 10) : 0,
  cellulare: Person?.phoneNumber ? parseInt(Person.phoneNumber, 10) : 0,
  telefonoCasa: Person?.phoneNumber2 ? parseInt(Person.phoneNumber2, 10) : 0,
  emailPrivata: Person?.privateEmail || "",
  iban: Person?.bankAddress || "",
 /*  sede: mapValueToSede(Person?.sede) || ""  , */
  codiceFiscale: Person?.taxCode || ""
});

const mapToTrattamentoEconomicoData = (employmentContract: any): TrattamentoEconomicoData => ({
  tipologiaContratto: employmentContract?.ContractType?.description || "",
  societa: employmentContract?.Company?.name || "",
  tipoAmbitoLavorativo: employmentContract?.WorkScope?.description || "",
  dataInizioTrattamento: employmentContract?.startDate || "",
  costoGiornaliero: employmentContract?.dailyCost || 0,
  dataAssunzione: employmentContract?.hireDate ? new Date(employmentContract.hireDate) : null,
  scadenzaEffettiva: employmentContract?.effectiveEndDate ? new Date(employmentContract.effectiveEndDate) : null,
  dataRecesso: employmentContract?.endDate ? new Date(employmentContract.endDate) : null,
  motivazioneCessazione: employmentContract?.cessationMotivation || "",
  trasformazioni: employmentContract?.transformations || "",
  ccnl: employmentContract?.collectiveAgreement || "",
  ral: employmentContract?.annualGrossSalary || 0,
  trasferta: employmentContract?.travelAllowance || 0,
  buoniPasto: employmentContract?.mealVouchers === "Yes" ? 1 : 0,
  nettoMese: employmentContract?.netMonthly || 0,
  costoAnnuale: employmentContract?.annualCost || 0,
  tariffaVendita: employmentContract?.salesRate || 0,
  note: employmentContract?.notes || ""
});

const mapToRuoliData = (roles: any[]): RuoliData => {
  const ruoli: RuoliData = {};
  roles.forEach(role => {
    const roleName = role.role;
    if (roleName) {
      ruoli[roleName] = true;
    }
  });
  return ruoli;
};

const getRoleIds = (roles: any[]): number[] => {
  return roles.map(role => role.id);
};

const mapToPermessiData = (acitvities: any[]): PermessiData => {
  const permessi: PermessiData = {};
  acitvities.forEach(activity => {
    const activiesName = activity.code;
    if (activiesName) {
      permessi[activiesName] = true;
    }
  });
  return permessi;
};

const getPermessiIds = (permessi: any[]): number[] => {
  return permessi.map(permessi => permessi.id);
};


export const transformUserData = (data: any[]) => {
  return data.map(user => ({
    
    id: user.id,
    person_id:user.person_id,
    societa: user?.Person?.EmploymentContract?.[0]?.Company.name ?? "",
    cognome: user?.Person?.lastName ?? "",
    email: user.email ?? "",
    tipoContratto: user?.Person?.EmploymentContract?.[0]?.ContractType?.description ?? "",
    costoAnnuale: user?.Person?.EmploymentContract?.[0]?.annualCost ?? "",
    costoGiornaliero: user?.Person?.EmploymentContract?.[0]?.dailyCost ?? "",
    anagrafica: mapToAnagraficaData(user.Person),
    trattamentoEconomico: mapToTrattamentoEconomicoData(user.Person?.EmploymentContract?.[0] || {}),
    ruoli: mapToRuoliData(user.Roles || []),
    roleIds: getRoleIds(user.Roles || []),
    permessi: mapToPermessiData(user.Person?.ActivityType || []),
    permessiId:  getPermessiIds(user.Person?.ActivityType || [])
  }));
};


export const dataAdapter = (row: Record<string, any>) => {
  const person = row.Person || {};
  const employmentContract = person.EmploymentContract?.[0] || {};
  const anagraficaData: AnagraficaData = {
    person_id: row.anagrafica.person_id || "",
    sede: mapSedeToValue(row.anagrafica.sede) || "",
    nome: row.anagrafica.nome|| "",
    cognome: row.anagrafica.cognome || "",
    email: row.email || "",
    matricola: row.anagrafica.matricola || "",
    sesso: mapValueToGender(person.gender_id) || 1,
    Provincianascita: row.anagrafica.Provincianascita || "",
    comuneNascita: row.anagrafica.comuneNascita || "",
    residenza: row.anagrafica.residenza || "",
    comuneResidenza: row.anagrafica.comuneResidenza || "",
    indirizzoResidenza: row.anagrafica.indirizzoResidenza || "",
    dataNascita: row.anagrafica.dataNascita ? new Date(row.anagrafica.dataNascita) : null,
    cap: row.anagrafica.cap ? parseInt(row.anagrafica.cap, 10) : 0,
    cellulare: row.anagrafica.cellulare ? parseInt(row.anagrafica.cellulare, 10) : 0,
    telefonoCasa: row.anagrafica.telefonoCasa ? parseInt(row.anagrafica.telefonoCasa, 10) : 0,
    emailPrivata: row.anagrafica.emailPrivata || "",
    iban:  row.anagrafica.iban || "",
    codiceFiscale:  row.anagrafica.codiceFiscale || ""
  };

  const trattamentoEconomicoData: TrattamentoEconomicoData = {
    tipologiaContratto: row.trattamentoEconomico?.tipologiaContratto.toString() || "",
    societa:  row.trattamentoEconomico.societa?.toString() || "",
    tipoAmbitoLavorativo:  row.trattamentoEconomico?.tipoAmbitoLavorativo.toString() || "",
    dataInizioTrattamento:  row.trattamentoEconomico?.dataInizioTrattamento ? new Date( row.trattamentoEconomico.dataInizioTrattamento) : null,
    costoGiornaliero:  row.trattamentoEconomico.costoGiornaliero|| 0,
    dataAssunzione:  row.trattamentoEconomico.dataAssunzione ? new Date( row.trattamentoEconomico.dataAssunzione) : null,
    scadenzaEffettiva:  row.trattamentoEconomico.scadenzaEffettiva ? new Date( row.trattamentoEconomico.scadenzaEffettiva) : null,
    dataRecesso:  row.trattamentoEconomico.dataRecesso ? new Date( row.trattamentoEconomico.dataRecesso) : null,
    motivazioneCessazione:  row.trattamentoEconomico.motivazioneCessazione || "",
    trasformazioni:  row.trattamentoEconomico.trasformazioni || "",
    ccnl:  row.trattamentoEconomico.ccnl|| "",
    ral:  row.trattamentoEconomico.ral || 0,
    trasferta:  row.trattamentoEconomico.trasferta || 0,
    buoniPasto:  row.trattamentoEconomico.buoniPasto === "Yes" ? 1 : 0,
    nettoMese:  row.trattamentoEconomico.nettoMese || 0,
    costoAnnuale:  row.trattamentoEconomico.costoAnnuale || 0,
    tariffaVendita:  row.trattamentoEconomico.tariffaVendita || 0,
    note:  row.trattamentoEconomico.note || ""
  };

  const ruoliData: RuoliData = {
    ADM: row.ruoli.ADM || false,
    AMMI: row.ruoli.AMMI || false,
    COM: row.ruoli.COM || false,
    DIP: row.ruoli.DIP || false,
    LEA: row.ruoli.LEA || false,
    REC: row.ruoli.REC || false,
    RP: row.ruoli.RP || false,
    SEG: row.ruoli.SEG || false,
    RISEXT: row.ruoli.RISEXT || false,
    ADD_CENS: row.ruoli.ADD_CENS || false,
    TESTROLE2:row.ruoli.TESTROLE2 || false

  };


  const permessiData: PermessiData = {
    HMA: row.permessi.HMA || false,
    HPE: row.permessi.HPE || false,
    HFE: row.permessi.HFE || false,
    HPE_104: row.permessi.HPE_104 || false,
    MAT: row.permessi.MAT || false,
    LUT: row.permessi.LUT || false,
    CMATR: row.permessi.CMATR || false,
  };
  return {

    id: row.id || "",
    anagrafica: anagraficaData,
    trattamentoEconomico: trattamentoEconomicoData,
    ruoli: ruoliData,
    permessi: permessiData,
  };
};

type RoleApiResponse = {
  data: Array<{
    id: number;
    role: string;
    description: string;
  }>;
  meta: {
    total: number;
  };
};

type WokeScopeApiResponse = {
  data: Array<{
    id: number;
    code: string;
    description: string;
  }>;
  meta: {
    total: number;
  };
};

type ContractTypeApiResponse = {
  data: Array<{
    id: number;
    code: string;
    description: string;
  }>;
  meta: {
    total: number;
  };
};

type CompanyApiResponse = {
  data: Array<{
    id: number;
    address: string;
    name: string;
  }>;
  meta: {
    total: number;
  };
};
type ActivityTypeApiResponse = {
  data: Array<{
    id: number;
    code: string;
    description: string;
    time_unit: string;
    productive: boolean;
  }>;
  meta: {
    total: number;
  };
};

export type  ActivityTypeOption = {
  label: string;
  value: number;
  code?: string;
};
export type RoleOption = {
  label: string;
  value: number;
  name?:string;
};
export type WokeScopeOption = {
  label: string;
  value: number;
  name?:string;
};

export type contractTypeOption = {
  label: string;
  value: number;
  name?:string;
};

export type companyOption = {
  label: string;
  value: number;
   address?:string;
};

export const roleAdapter = (apiResponse: RoleApiResponse): RoleOption[] => {
  return apiResponse.data.map((role) => ({
    label: role.description,
    value: role.id,
    name:role.role,
  }));
};
export const wokeScopeAdapter = (apiResponse: WokeScopeApiResponse): WokeScopeOption[] => {
  return apiResponse.data.map((role) => ({
    label: role.description,
    value: role.id,
    name:role.code,
  }));
};
export const contractTypeAdapter = (apiResponse: ContractTypeApiResponse): contractTypeOption[] => {
  return apiResponse.data.map((role) => ({
    label: role.description,
    value: role.id,
    name:role.code,
  }));
};

export const companyAdapter = (apiResponse: CompanyApiResponse): companyOption[] => {
  return apiResponse.data.map((role) => ({
    label: role.name,
    value: role.id,
    name:role.address,
  }));
};

export const permessiAdapter = (apiResponse: ActivityTypeApiResponse): ActivityTypeOption[] => {
  return apiResponse.data.map((permesso) => ({
    label: permesso.description,
    value: permesso.id,
    code: permesso.code,
  }));
};

/* type RoleMap = typeof roleMap; */
/* type RoleKeys = keyof RoleMap; */
const generateRandomVATNumber = (): string => {
  const getRandomDigit = () => Math.floor(Math.random() * 10).toString();

  // Generate the first 10 digits
  let vatNumber = '';
  for (let i = 0; i < 10; i++) {
    vatNumber += getRandomDigit();
  }

  // Calculate the check digit
  const calculateCheckDigit = (number: string): string => {
    let sum = 0;
    for (let i = 0; i < number.length; i++) {
      const digit = parseInt(number[i], 10);
      if (i % 2 === 0) {
        sum += digit;
      } else {
        const doubled = digit * 2;
        sum += doubled > 9 ? doubled - 9 : doubled;
      }
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit.toString();
  };

  vatNumber += calculateCheckDigit(vatNumber);
  return vatNumber;
};

const mapRoleNamesToIDs = (ruoli: RuoliData, idRuoli: RoleOption[]): number[] => {
  const roles_id : number[]=[];
  for (const [key, value] of Object.entries(ruoli)) {
    if (value) {
      const role = idRuoli.find(role => role.name === key);
      if (role) {
        roles_id.push(role.value);
      }
    }
  }
  return roles_id;
};

const mapPermessiNamesToIDs = (permessi: PermessiData, permessiOptions: ActivityTypeOption[]): number[] => {
  const permessi_id: number[] = [];
  for (const [key, value] of Object.entries(permessi)) {
    if (value) {
      const permesso = permessiOptions.find(perm => perm.code === key);
      if (permesso) {
        permessi_id.push(permesso.value);
      }
    }
  }
  return permessi_id;
};

const mapWorkScopeToID = (label: string, wokeScope: WokeScopeOption[]): number | undefined => {
  const scope = wokeScope.find(scope => scope.label === label);
  return scope ? scope.value : undefined;
};

const mapContractTypeToID = (label: string, contractTypes:contractTypeOption[]): number | undefined => {
  const scope = contractTypes.find(scope => scope.label === label);
  return scope ? scope.value : undefined;
};

const mapCompanyToID = (label: string, company: companyOption[]): number | undefined=> {
  const scope = company.find(scope => scope.label === label);
  return scope ? scope.value : undefined;
};

export const reverseAdapter = (combinedData: {
  id:any;
  idRuoli:any[],
  idPermessi:any[],
  wokescope: WokeScopeOption[],
  contractType: contractTypeOption[],
  company: companyOption[],
  anagrafica: AnagraficaData;
  trattamentoEconomico: TrattamentoEconomicoData;
  ruoli: RuoliData;
  permessi: PermessiData;
}) => {
  return {
    id:combinedData.id,
    person_id:combinedData.anagrafica.person_id,
    email: combinedData.anagrafica.email ?? "defaultEmail",
    password: "defaultPassword",
    accountStatus_id: combinedData.anagrafica.accountStatus_id,
    roles_id: mapRoleNamesToIDs(combinedData.ruoli, combinedData.idRuoli),
    Person: {
      firstName: combinedData.anagrafica.nome ?? "defaultFirstName",
      lastName: combinedData.anagrafica.cognome ?? "defaultLastName",
      id:combinedData.anagrafica.person_id,
      phoneNumber: combinedData.anagrafica.cellulare?.toString() ?? "0000000000",
      phoneNumber2: combinedData.anagrafica.telefonoCasa?.toString() ?? "0000000000",
      address: combinedData.anagrafica.indirizzoResidenza ?? "defaultAddress",
      privateEmail: (!combinedData.anagrafica.emailPrivata || combinedData.anagrafica.emailPrivata === "") ? null :combinedData.anagrafica.emailPrivata,
      city: combinedData.anagrafica.comuneResidenza ?? "defaultCity",
      provinceRes: combinedData.anagrafica.residenza ?? "defaultProvinceRes",
      provinceBirth: combinedData.anagrafica.Provincianascita ?? "defaultProvinceBirth",
      cityRes: combinedData.anagrafica.comuneResidenza ?? "defaultCityRes",
      cityBirth: combinedData.anagrafica.comuneNascita ?? "defaultCityBirth",
      dateBirth: (!combinedData.anagrafica.dataNascita || combinedData.anagrafica.dataNascita === "") ? "2024-07-30T14:40:24.119Z": combinedData.anagrafica.dataNascita,
      bankAddress: (!combinedData.anagrafica.iban || combinedData.anagrafica.iban === "" )? null : combinedData.anagrafica.iban,
      state: "IT",
      zipCode: combinedData.anagrafica.cap?.toString() ?? "00000",
      taxCode: (!combinedData.anagrafica.codiceFiscale || combinedData.anagrafica.codiceFiscale === "" )? null :combinedData.anagrafica.codiceFiscale,
      vatNumber: generateRandomVATNumber(),
      employee_id: combinedData.anagrafica.matricola ?? "12343",
      note: combinedData.anagrafica.note ?? "",
      data: JSON.stringify(combinedData),  // Ensure data is a JSON string
      gender_id: mapGenderToValue(combinedData.anagrafica.sesso) ?? 1,
     /*  sede: mapSedeToValue(combinedData.anagrafica.sede) ?? 1, */ // Map sede to its corresponding value
      activityTypes_id:  mapPermessiNamesToIDs(combinedData.permessi, combinedData.idPermessi), 
      EmploymentContract: [
        {
          workScope_id: mapWorkScopeToID(combinedData.trattamentoEconomico.tipoAmbitoLavorativo, combinedData.wokescope), 
          contractType_id: mapContractTypeToID(combinedData.trattamentoEconomico.tipologiaContratto,combinedData.contractType),
          company_id: mapCompanyToID(combinedData.trattamentoEconomico.societa,combinedData.company),
          startDate: combinedData.trattamentoEconomico.dataInizioTrattamento || "2024-07-30T14:40:24.119Z",
          endDate: combinedData.trattamentoEconomico.dataRecesso || "2024-07-30T14:40:24.119Z",
          effectiveEndDate: combinedData.trattamentoEconomico.scadenzaEffettiva || "2024-07-30T14:40:24.119Z",
          hireDate: combinedData.trattamentoEconomico.dataAssunzione || "2024-07-30T14:40:24.119Z",
          cessationMotivation: combinedData.trattamentoEconomico.motivazioneCessazione || "",
          transformations: combinedData.trattamentoEconomico.trasformazioni || "",
          collectiveAgreement: combinedData.trattamentoEconomico.ccnl || "defaultcollectiveagreement",
          mealVouchers: combinedData.trattamentoEconomico.buoniPasto ? "Yes" : "No",
          salesRate: combinedData.trattamentoEconomico.tariffaVendita || 0,
          dailyCost: combinedData.trattamentoEconomico.costoGiornaliero || 0,
          annualGrossSalary: combinedData.trattamentoEconomico.ral || 0,
          travelAllowance: combinedData.trattamentoEconomico.trasferta || 0,
          netMonthly: combinedData.trattamentoEconomico.nettoMese || 0,
          annualCost: combinedData.trattamentoEconomico.costoAnnuale || 0,
          notes: combinedData.trattamentoEconomico.note || "",
        },
      ],
    },
  };
};
