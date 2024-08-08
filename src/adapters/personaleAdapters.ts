import {
  AnagraficaData,
  TrattamentoEconomicoData,
  RuoliData,
  PermessiData,
} from "../component/TabPersonaleHR/modelForms";

const sedeOptions = [
  { label: "Barletta", value: 1 },
  { label: "Milano", value: 2 },
  { label: "Roma", value: 3 },
];

const mapSedeToValue = (sedeLabel: string) => {
  const option = sedeOptions.find((option) => option.label === sedeLabel);
  return option ? option.value : null;
};

const mapValueToSede = (sedeValue: any) => {
  const option = sedeOptions.find((option) => option.value === sedeValue);
  return option ? option.label : "";
};

// map dal be al fe
const mapToAnagraficaData = (Person: any): AnagraficaData => ({
  person_id: Person?.id,
  accountStatus_id: Person?.accountStatus_id,
  nome: Person?.firstName || "",
  cognome: Person?.lastName || "",
  matricola: Person?.employee_id || "",
  sesso: Person?.Gender?.code,
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
  stato: Person.state || "",
  partitaIva: Person.vatNumber || 0,
  /*  sede: mapValueToSede(Person?.sede) || ""  , */
  codiceFiscale: Person?.taxCode || "",
});

const mapToTrattamentoEconomicoData = (
  employmentContract: any
): TrattamentoEconomicoData => {
  return {
    id: employmentContract?.id,
    tipologiaContratto: employmentContract?.ContractType?.description || "",
    societa: employmentContract?.Company?.name || "",
    tipoAmbitoLavorativo: employmentContract?.WorkScope?.description || "",
    dataInizioTrattamento: employmentContract?.startDate ? new Date(employmentContract.startDate) : null,
    costoGiornaliero: employmentContract?.dailyCost || 0,
    dataAssunzione: employmentContract?.hireDate
      ? new Date(employmentContract.hireDate)
      : null,
    scadenzaEffettiva: employmentContract?.effectiveEndDate
      ? new Date(employmentContract.effectiveEndDate)
      : null,
    dataRecesso: employmentContract?.endDate
      ? new Date(employmentContract.endDate)
      : null,
    motivazioneCessazione: employmentContract?.cessationMotivation || "",
    trasformazioni: employmentContract?.transformations || "",
    ccnl: employmentContract?.collectiveAgreement || "",
    ral: employmentContract?.annualGrossSalary || 0,
    trasferta: employmentContract?.travelAllowance || 0,
    buoniPasto: employmentContract?.mealVouchers,
    nettoMese: employmentContract?.netMonthly || 0,
    costoAnnuale: employmentContract?.annualCost || 0,
    tariffaVendita: employmentContract?.salesRate || 0,
    note: employmentContract?.notes || "",
  };
};

const mapToRuoliData = (roles: any[]): RuoliData => {
  const ruoli: RuoliData = {};
  roles.forEach((role) => {
    const roleName = role.role;
    if (roleName) {
      ruoli[roleName] = true;
    }
  });
  return ruoli;
};

const getRoleIds = (roles: any[]): number[] => {
  return roles.map((role) => role.id);
};

const mapToPermessiData = (acitvities: any[]): PermessiData => {
  const permessi: PermessiData = {};
  acitvities.forEach((activity) => {
    const activiesName = activity.code;
    if (activiesName) {
      permessi[activiesName] = true;
    }
  });
  return permessi;
};

const getPermessiIds = (permessi: any[]): number[] => {
  return permessi.map((permessi) => permessi.id);
};

//per la tabella sia per le cllonne che per gestire tutto
export const transformUserData = (data: any[]) => {
  return data.map((user) => {
    const employmentContracts = user?.Person?.EmploymentContract || [];
    return {
      id: user.id,
      person_id: user.person_id,
      company: user?.Person?.EmploymentContract?.[0]?.Company.name ?? "",
      lastName: user?.Person?.lastName ?? "",
      firstName:user?.Person?.firstName ?? "",
      email:user?.email,
      ContractType:
        user?.Person?.EmploymentContract?.[0]?.ContractType?.description ?? "",
      annualCost: user?.Person?.EmploymentContract?.[0]?.annualCost ?? "",
      dailyCost: user?.Person?.EmploymentContract?.[0]?.dailyCost ?? "",
      anagrafica: mapToAnagraficaData(user.Person),
      trattamentoEconomico: employmentContracts.map((contract) =>
        mapToTrattamentoEconomicoData(contract)
      ),
      ruoli: mapToRuoliData(user.Roles || []),
      roleIds: getRoleIds(user.Roles || []),
      permessi: mapToPermessiData(user.Person?.ActivityType || []),
      permessiId: getPermessiIds(user.Person?.ActivityType || []),
    };
  });
};

// adapter per le row per le modali
export const dataAdapter = (row: Record<string, any>) => {
/*   const person = row.Person || {}; */
  const employmentContracts = row.trattamentoEconomico|| [];
  const anagraficaData: AnagraficaData = {
    person_id: row.anagrafica.person_id || "",
    sede: mapSedeToValue(row.anagrafica.sede) || "",
    nome: row.anagrafica.nome || "",
    cognome: row.anagrafica.cognome || "",
    email: row.email || "",
    matricola: row.anagrafica.matricola || "",
    sesso: row.anagrafica.sesso,
    Provincianascita: row.anagrafica.Provincianascita || "",
    comuneNascita: row.anagrafica.comuneNascita || "",
    residenza: row.anagrafica.residenza || "",
    comuneResidenza: row.anagrafica.comuneResidenza || "",
    indirizzoResidenza: row.anagrafica.indirizzoResidenza || "",
    dataNascita: row.anagrafica.dataNascita
      ? new Date(row.anagrafica.dataNascita)
      : null,
    cap: row.anagrafica.cap ? parseInt(row.anagrafica.cap, 10) : 0,
    cellulare: row.anagrafica.cellulare
      ? parseInt(row.anagrafica.cellulare, 10)
      : 0,
    telefonoCasa: row.anagrafica.telefonoCasa
      ? parseInt(row.anagrafica.telefonoCasa, 10)
      : 0,
    emailPrivata: row.anagrafica.emailPrivata || "",
    iban: row.anagrafica.iban || "",
    stato: row.anagrafica.stato || " ",
    partitaIva: row.anagrafica.partitaIva || 0,
    codiceFiscale: row.anagrafica.codiceFiscale || "",
  };

  

  const trattamentoEconomicoData: TrattamentoEconomicoData[]   = employmentContracts.map(contract => {
    return {
      id: contract.id,
      societa:contract.societa,
      tipologiaContratto: contract.tipologiaContratto || "",
      tipoAmbitoLavorativo: contract.tipoAmbitoLavorativo || "",
      dataInizioTrattamento: contract.dataInizioTrattamento ? new Date(contract.dataInizioTrattamento) : null,
      costoGiornaliero: contract.costoGiornaliero || 0,
      dataAssunzione: contract.dataAssunzione ? new Date(contract.dataAssunzione) : null,
      scadenzaEffettiva: contract.scadenzaEffettiva ? new Date(contract.scadenzaEffettiva) : null,
      dataRecesso: contract.dataRecesso ? new Date(contract.dataRecesso) : null,
      motivazioneCessazione: contract.motivazioneCessazione || "",
      trasformazioni: contract.trasformazioni || "",
      ccnl: contract.ccnl || "",
      ral: contract.annualGrossSalary || 0,
      trasferta: contract.trasferta || 0,
      buoniPasto: contract.buoniPasto || "",
      nettoMese: contract.nettoMese || 0,
      costoAnnuale: contract.costoAnnuale || 0,
      tariffaVendita: contract.tariffaVendita || 0,
      note: contract.note || ""
    };
  });

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
    TESTROLE2: row.ruoli.TESTROLE2 || false,
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

//adapter per gestire le select ruoli e permessi
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
type GenderApiResponse = {
  data: Array<{
    id: number;
    code: string;
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

type cityApiResponse = {
  data: Array<{
    id: number;
    code: string;
   name:string;
  }>;
  meta: {
    total: number;
  };
};

type countryApiResponse = {
  data: Array<{
    id: number;
    code: string;
   name:string;
  }>;
  meta: {
    total: number;
  };
};


export type cityTypeOption = {
  label: string;
  value: number;
  code?: string;
};

export type ActivityTypeOption = {
  label: string;
  value: number;
  code?: string;
};
export type RoleOption = {
  label: string;
  value: number;
  name?: string;
};
export type WokeScopeOption = {
  label: string;
  value: number;
  name?: string;
};
export type genderOption = {
  label: string;
  value: number;
  name?: string;
};

export type contractTypeOption = {
  label: string;
  value: number;
  name?: string;
};

export type companyOption = {
  label: string;
  value: number;
  address?: string;
};

export type countryOption = {
  label: string;
  value: number;
};

export const roleAdapter = (apiResponse: RoleApiResponse): RoleOption[] => {
  return apiResponse.data.map((role) => ({
    label: role.description,
    value: role.id,
    name: role.role,
  }));
};
export const wokeScopeAdapter = (
  apiResponse: WokeScopeApiResponse
): WokeScopeOption[] => {
  return apiResponse.data.map((role) => ({
    label: role.description,
    value: role.id,
    name: role.code,
  }));
};
export const contractTypeAdapter = (
  apiResponse: ContractTypeApiResponse
): contractTypeOption[] => {
  return apiResponse.data.map((role) => ({
    label: role.description,
    value: role.id,
    name: role.code,
  }));
};

export const companyAdapter = (
  apiResponse: CompanyApiResponse
): companyOption[] => {
  return apiResponse.data.map((role) => ({
    label: role.name,
    value: role.id,
    name: role.address,
  }));
};

export const permessiAdapter = (
  apiResponse: ActivityTypeApiResponse
): ActivityTypeOption[] => {
  return apiResponse.data.map((permesso) => ({
    label: permesso.description,
    value: permesso.id,
    code: permesso.code,
  }));
};
export const genderAdapter = (
  apiResponse: GenderApiResponse
): genderOption[] => {
  return apiResponse.data.map((permesso) => ({
    label: permesso.code,
    value: permesso.id,
  }));
};

export const cityAdapter = (
  apiResponse: cityApiResponse
): cityTypeOption[] => {
  return apiResponse.data.map((city) => ({
    label: city.name,
    value: city.id,
  }));
};
export const countryAdapter = (
  apiResponse: countryApiResponse
): countryOption[] => {
  return apiResponse.data.map((country) => ({
    label: country.name,
    value: country.id,
  }));
};


//funzioni per mandare gli id al be

const mapRoleNamesToIDs = (
  ruoli: RuoliData,
  idRuoli: RoleOption[]
): number[] => {
  const roles_id: number[] = [];
  for (const [key, value] of Object.entries(ruoli)) {
    if (value) {
      const role = idRuoli.find((role) => role.name === key);
      if (role) {
        roles_id.push(role.value);
      }
    }
  }
  return roles_id;
};

const mapPermessiNamesToIDs = (
  permessi: PermessiData,
  permessiOptions: ActivityTypeOption[]
): number[] => {
  const permessi_id: number[] = [];
  for (const [key, value] of Object.entries(permessi)) {
    if (value) {
      const permesso = permessiOptions.find((perm) => perm.code === key);
      if (permesso) {
        permessi_id.push(permesso.value);
      }
    }
  }
  return permessi_id;
};

const mapWorkScopeToID = (
  label: string,
  wokeScope: WokeScopeOption[]
): number | undefined => {
  const scope = wokeScope.find((scope) => scope.label === label);
  return scope ? scope.value : undefined;
};

const mapContractTypeToID = (
  label: string,
  contractTypes: contractTypeOption[]
): number | undefined => {
  const scope = contractTypes.find((scope) => scope.label === label);
  return scope ? scope.value : undefined;
};

const mapCompanyToID = (
  label: string,
  company: companyOption[]
): number | undefined => {
  const scope = company.find((scope) => scope.label === label);
  return scope ? scope.value : undefined;
};

const mapGenderToID = (
  label: string,
  gender: genderOption[]
): number | undefined => {
  const scope = gender.find((scope) => scope.label === label);
  return scope ? scope.value : undefined;
};

const mapCityToID = (
  label: string,
  city: cityTypeOption[]
): number | undefined => {
  const scope = city.find((scope) => scope.label === label);
  return scope ? scope.value : undefined;
};

const mapCountryToID = (
  label: string,
  country: countryOption[]
): number | undefined => {
  const scope = country.find((scope) => scope.label === label);
  return scope ? scope.value : undefined;
};
//reverse adpter per mandare i dati al be

export const reverseAdapter = (combinedData: {
  id: any;
  idRuoli: any[];
  idPermessi: any[];
  wokescope: WokeScopeOption[];
  contractType: contractTypeOption[];
  company: companyOption[];
  gender: genderOption[];
  anagrafica: AnagraficaData;
  trattamentoEconomico: TrattamentoEconomicoData[] | TrattamentoEconomicoData | null;
  ruoli: RuoliData;
  permessi: PermessiData;
  city: cityTypeOption[],
  country: countryOption[]
}) => {
  const permessiIDs =
    mapPermessiNamesToIDs(combinedData.permessi, combinedData.idPermessi) || [];
  
  const employmentContracts = Array.isArray(combinedData.trattamentoEconomico)
    ? combinedData.trattamentoEconomico.map((contract) => ({
        id: contract.id,
        workScope_id:
          mapWorkScopeToID(
            contract.tipoAmbitoLavorativo,
            combinedData.wokescope
          ) || 1,
        contractType_id:
          mapContractTypeToID(
            contract.tipologiaContratto,
            combinedData.contractType
          ) || 1,
        company_id: mapCompanyToID(contract.societa, combinedData.company) || 1,
        startDate: contract.dataInizioTrattamento,
        endDate: contract.dataRecesso || contract.dataInizioTrattamento,
        effectiveEndDate:
          contract.scadenzaEffettiva || contract.dataInizioTrattamento,
        hireDate: contract.dataAssunzione || contract.dataInizioTrattamento,
        cessationMotivation: contract.motivazioneCessazione || " ",
        transformations: contract.trasformazioni || " ",
        collectiveAgreement: contract.ccnl || " ",
        mealVouchers: contract.buoniPasto || "NO",
        salesRate: Number(contract.tariffaVendita) || 0,
        dailyCost: Number(contract.costoGiornaliero) || 0,
        annualGrossSalary: Number(contract.ral) || 0,
        travelAllowance: Number(contract.trasferta) || 0,
        netMonthly: Number(contract.nettoMese) || 0,
        annualCost: Number(contract.costoAnnuale) || 0,
        notes: contract.note || "",
      }))
    : [{
        id: combinedData.trattamentoEconomico?.id,
       
        workScope_id:
          mapWorkScopeToID(
            combinedData.trattamentoEconomico?.tipoAmbitoLavorativo,
            combinedData.wokescope
          ) || 1,
        contractType_id:
          mapContractTypeToID(
            combinedData.trattamentoEconomico?.tipologiaContratto,
            combinedData.contractType
          ) || 1,
        company_id: mapCompanyToID(combinedData.trattamentoEconomico?.societa, combinedData.company) || 1,
        startDate: combinedData.trattamentoEconomico?.dataInizioTrattamento,
        endDate: combinedData.trattamentoEconomico?.dataRecesso || combinedData.trattamentoEconomico?.dataInizioTrattamento,
        effectiveEndDate:
          combinedData.trattamentoEconomico?.scadenzaEffettiva || combinedData.trattamentoEconomico?.dataInizioTrattamento,
        hireDate: combinedData.trattamentoEconomico?.dataAssunzione || combinedData.trattamentoEconomico?.dataInizioTrattamento,
        cessationMotivation: combinedData.trattamentoEconomico?.motivazioneCessazione || " ",
        transformations: combinedData.trattamentoEconomico?.trasformazioni || " ",
        collectiveAgreement: combinedData.trattamentoEconomico?.ccnl || " ",
        mealVouchers: combinedData.trattamentoEconomico?.buoniPasto || "NO",
        salesRate: Number(combinedData.trattamentoEconomico?.tariffaVendita) || 0,
        dailyCost: Number(combinedData.trattamentoEconomico?.costoGiornaliero) || 0,
        annualGrossSalary: Number(combinedData.trattamentoEconomico?.ral) || 0,
        travelAllowance: Number(combinedData.trattamentoEconomico?.trasferta) || 0,
        netMonthly: Number(combinedData.trattamentoEconomico?.nettoMese) || 0,
        annualCost: Number(combinedData.trattamentoEconomico?.costoAnnuale) || 0,
        notes: combinedData.trattamentoEconomico?.note || "",
      }];

  return {
    email: combinedData.anagrafica.email,
    accountStatus_id: combinedData.anagrafica.accountStatus_id,
    roles_id: mapRoleNamesToIDs(combinedData.ruoli, combinedData.idRuoli) || [],
    Person: {
      firstName: combinedData.anagrafica.nome,
      lastName: combinedData.anagrafica.cognome,
      id: combinedData.anagrafica.person_id,
      country_id: mapCountryToID(combinedData.anagrafica.stato, combinedData.country),
      phoneNumber: combinedData.anagrafica.cellulare?.toString(),
      phoneNumber2: combinedData.anagrafica.telefonoCasa?.toString(),
      address: combinedData.anagrafica.indirizzoResidenza,
      city_id: mapCityToID(combinedData.anagrafica.città, combinedData.city) || 1,
      privateEmail:
        !combinedData.anagrafica.emailPrivata ||
        combinedData.anagrafica.emailPrivata === ""
          ? null
          : combinedData.anagrafica.emailPrivata,
      city: combinedData.anagrafica.comuneResidenza,
      provinceRes: combinedData.anagrafica.residenza,
      provinceBirth: combinedData.anagrafica.Provincianascita,
      cityRes: combinedData.anagrafica.comuneResidenza,
      cityBirth: combinedData.anagrafica.comuneNascita,
      dateBirth: combinedData.anagrafica.dataNascita,
      bankAddress:
        !combinedData.anagrafica.iban || combinedData.anagrafica.iban === ""
          ? null
          : combinedData.anagrafica.iban,
      state: combinedData.anagrafica.stato || " ",
      zipCode: combinedData.anagrafica.cap?.toString() ?? " ",
      taxCode:
        !combinedData.anagrafica.codiceFiscale ||
        combinedData.anagrafica.codiceFiscale === ""
          ? null
          : combinedData.anagrafica.codiceFiscale,
      vatNumber: combinedData.anagrafica.partitaIva || null,
      employee_id: combinedData.anagrafica.matricola || " ",
      note: combinedData.anagrafica.note ?? " ",
      data: JSON.stringify(combinedData.trattamentoEconomico),
      gender_id: mapGenderToID(
        combinedData.anagrafica.sesso,
        combinedData.gender
      ),
      /*  sede: mapSedeToValue(combinedData.anagrafica.sede) ?? 1, */ // Map sede to its corresponding value
      activityTypes_id: permessiIDs.length > 0 ? permessiIDs : [2, 3],
      EmploymentContract: employmentContracts,
    },
  };
};

