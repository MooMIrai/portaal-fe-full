import {
  AnagraficaData,
  TrattamentoEconomicoData,
  RuoliData,
  PermessiData,
} from "../component/TabPersonaleHR/modelForms";

// map dal be al fe
const mapToAnagraficaData = (
  Person: any,
  countryLabel: string,
  cityBirthLabel: string,
  cityResLabel: string,
  sedeLabel: string
): AnagraficaData => ({
  person_id: Person?.id,
  accountStatus_id: Person?.accountStatus_id,
  nome: Person?.firstName || "",
  cognome: Person?.lastName || "",
  matricola: Person?.employee_id || "",
  sesso: Person?.Gender?.code,

  residenza:{
    city:{
      id:Person.CityRes?.id,
      name:Person.CityRes?.name,
      code:Person.CityRes?.code
    },
    country:{
      id:Person.CityRes?.Country?.id,
      name:Person.CityRes?.Country?.name,
      code:Person.CityRes?.Country?.code
    },
    province:Person.CityRes && Person.CityRes.Province?
    {
      id:Person.CityRes?.Province.id,
      name:Person.CityRes?.Province.name,
      code:Person.CityRes?.Province.code
    }
    :undefined},

    nascita:{
      city:{
        id:Person.CityBirth?.id,
        name:Person.CityBirth?.name,
        code:Person.CityBirth?.code
      },
      country:{
        id:Person.CityBirth?.Country?.id,
        name:Person.CityBirth?.Country?.name,
        code:Person.CityBirth?.Country?.code
      },
      province:Person.CityBirth && Person.CityBirth.Province?
      {
        id:Person.CityBirth.Province.id,
        name:Person.CityBirth.Province.name,
        code:Person.CityBirth.Province.code
      }
      :undefined},

  /* Provincianascita: Person?.provinceBirth || "",
  comuneNascita: Person?.cityBirth || "",
  città: cityResLabel,
  cittaNascita: cityBirthLabel,
  residenza: Person?.provinceRes || "",
  comuneResidenza: Person?.cityRes || "", */
  
  indirizzoResidenza: Person?.address || "",
  dataNascita: Person?.dateBirth ? new Date(Person.dateBirth) : null,
  cap: Person?.zipCode ? parseInt(Person.zipCode, 10) : 0,
  cellulare: Person?.phoneNumber ? parseInt(Person.phoneNumber, 10) : 0,
  telefonoCasa: Person?.phoneNumber2 ? parseInt(Person.phoneNumber2, 10) : 0,
  emailPrivata: Person?.privateEmail || "",
  iban: Person?.bankAddress || "",
  stato: countryLabel || "",
  partitaIva: Person.vatNumber || 0,
  sede: sedeLabel,
  sede_autocomplete_id: Person.location_id,
  sede_autocomplete: { id: Person.location_id, name: sedeLabel },
  codiceFiscale: Person?.taxCode || "",
});

const mapToTrattamentoEconomicoData = (
  employmentContract: any
): TrattamentoEconomicoData => {
  return {
    id: employmentContract?.id,
    tipologiaContratto: employmentContract?.ContractType?.description || "",
    tipologiaContratto_autocomplete: {
      id: employmentContract?.ContractTypr?.id,
      name: employmentContract?.ContractType?.description,
    },
    tipoAmbitoLavorativo_autocomplete: {
      id: employmentContract?.WorkScope?.id,
      name: employmentContract?.WorkScope?.description,
    },
    tipoAmbitoLavorativo_autocomplete_id: employmentContract?.WorkScope?.id,
    societa: employmentContract?.Company?.name || "",
    tipoAmbitoLavorativo: employmentContract?.WorkScope?.description || "",
    dataInizioTrattamento: employmentContract?.startDate
      ? new Date(employmentContract.startDate)
      : null,
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

const findMostRecentContract = (contracts: any[]): any => {
  if (contracts.length === 0) return null;
  const mostRecentDate = Math.max(
    ...contracts.map((contract) => new Date(contract.startDate).getTime())
  );
  return contracts.find(
    (contract) => new Date(contract.startDate).getTime() === mostRecentDate
  );
};

//per la tabella sia per le cllonne che per gestire tutto
export const transformUserData = (
  data: any[],
  countryOptions: countryOption[],
  cityOptions: cityTypeOption[],
  sede: locationOption[]
) => {
  return data.map((user) => {
    const employmentContracts = user?.Person?.EmploymentContract || [];
    const mostRecentContract = findMostRecentContract(employmentContracts);

    const otherContracts = employmentContracts.filter(
      (contract) => contract.id !== mostRecentContract?.id
    );

    const countryLabel =
      countryOptions?.find(
        (country) => country.value === user?.Person?.country_id
      )?.label || " ";

    const cityResLabel =
      cityOptions?.find((city) => city.value === user?.Person?.cityRes_id)
        ?.label || " ";

    const cityBirthLabel =
      cityOptions?.find((city) => city.value === user?.Person?.cityBirth_id)
        ?.label || " ";

    const sedeLabel =
      sede?.find((sede) => sede.value === user?.Person?.location_id)?.label ||
      " ";

    return {
      id: user.id,
      person_id: user.person_id,
      company: mostRecentContract?.Company.name ?? "",
      lastName: user?.Person?.lastName ?? "",
      firstName: user?.Person?.firstName ?? "",
      email: user?.email,
      ContractType: mostRecentContract?.ContractType?.description ?? "",
      annualCost: mostRecentContract?.annualCost ?? "",
      dailyCost: mostRecentContract?.dailyCost ?? "",
      anagrafica: mapToAnagraficaData(
        user.Person,
        countryLabel,
        cityBirthLabel,
        cityResLabel,
        sedeLabel
      ),
      trattamentoEconomico: mapToTrattamentoEconomicoData(
        mostRecentContract || {}
      ),
      trattamentoEconomicoArray: otherContracts.map((contract) =>
        mapToTrattamentoEconomicoData(contract)
      ),
      sede: sede,
      ruoli: mapToRuoliData(user.Roles || []),
      roleIds: getRoleIds(user.Roles || []),
      permessi: mapToPermessiData(user.Person?.ActivityType || []),
      permessiId: getPermessiIds(user.Person?.ActivityType || []),
    };
  });
};

// adapter per le row per le modali
export const dataAdapter = (row: Record<string, any>) => {
  const employmentContracts = row.trattamentoEconomicoArray || [];

  const anagraficaData: AnagraficaData = {
    person_id: row.anagrafica.person_id || "",
    sede: row.anagrafica.sede || "",
    sede_autocomplete: row.anagrafica.sede_autocomplete,
    nome: row.anagrafica.nome || "",
    cognome: row.anagrafica.cognome || "",
    email: row.email || "",
    matricola: row.anagrafica.matricola || "",
    sesso: row.anagrafica.sesso,
    città:row.anagrafica.città || "",

    //cittaNascita:row.anagrafica.cittaNascita || "",
    //Provincianascita: row.anagrafica.Provincianascita || "",
    //comuneNascita: row.anagrafica.comuneNascita || "",
    residenza: row.anagrafica.residenza || undefined,
    nascita: row.anagrafica.nascita || undefined,
    //comuneResidenza: row.anagrafica.comuneResidenza || "",
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
    stato: row.anagrafica.stato || "",
    partitaIva: row.anagrafica.partitaIva || 0,
    codiceFiscale: row.anagrafica.codiceFiscale || "",
  };

  const trattamentoEconomicoDataArray: TrattamentoEconomicoData[] =
    employmentContracts.map((contract) => {
      return {
        id: contract.id,
        societa: contract.societa,
        tipologiaContratto: contract.tipologiaContratto || "",
        tipoAmbitoLavorativo: contract.tipoAmbitoLavorativo || "",
        dataInizioTrattamento: contract.dataInizioTrattamento
          ? new Date(contract.dataInizioTrattamento)
          : null,
        costoGiornaliero: contract.costoGiornaliero || 0,
        dataAssunzione: contract.dataAssunzione
          ? new Date(contract.dataAssunzione)
          : null,
        scadenzaEffettiva: contract.scadenzaEffettiva
          ? new Date(contract.scadenzaEffettiva)
          : null,
        dataRecesso: contract.dataRecesso
          ? new Date(contract.dataRecesso)
          : null,
        motivazioneCessazione: contract.motivazioneCessazione || "",
        trasformazioni: contract.trasformazioni || "",
        ccnl: contract.ccnl || "",
        ral: contract.annualGrossSalary || 0,
        trasferta: contract.trasferta || 0,
        buoniPasto: contract.buoniPasto || "",
        nettoMese: contract.nettoMese || 0,
        costoAnnuale: contract.costoAnnuale || 0,
        tariffaVendita: contract.tariffaVendita || 0,
        note: contract.note || "",
      };
    });

  const trattamentoEconomicoData: TrattamentoEconomicoData = {
    id: row.trattamentoEconomico.id,
    tipologiaContratto:
      row.trattamentoEconomico?.tipologiaContratto.toString() || "",
    societa: row.trattamentoEconomico.societa?.toString() || "",
    tipologiaContratto_autocomplete: row.trattamentoEconomico?.tipologiaContratto_autocomplete,
    tipoAmbitoLavorativo_autocomplete:
      row.trattamentoEconomico.tipoAmbitoLavorativo_autocomplete || {},
    tipoAmbitoLavorativo:
      row.trattamentoEconomico?.tipoAmbitoLavorativo.toString() || "",
    dataInizioTrattamento: row.trattamentoEconomico?.dataInizioTrattamento
      ? new Date(row.trattamentoEconomico.dataInizioTrattamento)
      : null,
    costoGiornaliero: row.trattamentoEconomico.costoGiornaliero || 0,
    dataAssunzione: row.trattamentoEconomico.dataAssunzione
      ? new Date(row.trattamentoEconomico.dataAssunzione)
      : null,
    scadenzaEffettiva: row.trattamentoEconomico.scadenzaEffettiva
      ? new Date(row.trattamentoEconomico.scadenzaEffettiva)
      : null,
    dataRecesso: row.trattamentoEconomico.dataRecesso
      ? new Date(row.trattamentoEconomico.dataRecesso)
      : null,
    motivazioneCessazione: row.trattamentoEconomico.motivazioneCessazione || "",
    trasformazioni: row.trattamentoEconomico.trasformazioni || "",
    ccnl: row.trattamentoEconomico.ccnl || "",
    ral: row.trattamentoEconomico.ral || 0,
    trasferta: row.trattamentoEconomico.trasferta || 0,
    buoniPasto: row.trattamentoEconomico.buoniPasto,
    nettoMese: row.trattamentoEconomico.nettoMese || 0,
    costoAnnuale: row.trattamentoEconomico.costoAnnuale || 0,
    tariffaVendita: row.trattamentoEconomico.tariffaVendita || 0,
    note: row.trattamentoEconomico.note || "",
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
    trattamentoEconomicoArray: trattamentoEconomicoDataArray,
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
    name: string;
  }>;
  meta: {
    total: number;
  };
};

type countryApiResponse = {
  data: Array<{
    id: number;
    code: string;
    name: string;
  }>;
  meta: {
    total: number;
  };
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

export type genderOption = {
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

export type locationOption = {
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

export const cityAdapter = (apiResponse: cityApiResponse): cityTypeOption[] => {
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

export const sedeAdapter = (
  apiResponse: LocationApiResponse
): locationOption[] => {
  return apiResponse.data.map((country) => ({
    label: country.description,
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


const mapCountryToID = (
  label: string,
  country: countryOption[]
): number | undefined => {
  const scope = country.find((scope) => scope.label === label);
  return scope ? scope.value : undefined;
};

const addOneDay = (date) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + 1); // Incrementa di un giorno
  return newDate;
};

//reverse adpter per mandare i dati al be
export const reverseAdapter = (combinedData: {
  id: any;
  idRuoli: any[];
  idPermessi: any[];
  company: companyOption[];
  gender: genderOption[];
  anagrafica: AnagraficaData;
  trattamentoEconomico: TrattamentoEconomicoData;
  ruoli: RuoliData;
  permessi: PermessiData;
  city: cityTypeOption[];
  country: countryOption[];
}) => {
  const permessiIDs =
    mapPermessiNamesToIDs(combinedData.permessi, combinedData.idPermessi) || [];
  return {
    email: combinedData.anagrafica.email,
    accountStatus_id: combinedData.anagrafica.accountStatus_id,
    roles_id: mapRoleNamesToIDs(combinedData.ruoli, combinedData.idRuoli) || [],
    Person: {
      firstName: combinedData.anagrafica.nome,
      lastName: combinedData.anagrafica.cognome,
      id: combinedData.anagrafica.person_id,
      phoneNumber: combinedData.anagrafica.cellulare?.toString(),
      phoneNumber2: combinedData.anagrafica.telefonoCasa?.toString(),
      address: combinedData.anagrafica.indirizzoResidenza,
      privateEmail: (!combinedData.anagrafica.emailPrivata || combinedData.anagrafica.emailPrivata === "") ? null :combinedData.anagrafica.emailPrivata,
      //city: combinedData.anagrafica.comuneResidenza,
      cityRes_id: combinedData.anagrafica.residenza?.city.id/* mapCityToID(combinedData.anagrafica.città,combinedData.city) ||  */,
      cityBirth_id:combinedData.anagrafica.nascita?.city.id/* mapCityToID(combinedData.anagrafica.cittaNascita, combinedData.city) || */ ,

      location_id: combinedData.anagrafica.sede_autocomplete?.id,
      provinceRes: combinedData.anagrafica.residenza,
      //provinceBirth: combinedData.anagrafica.Provincianascita,
      country_id: mapCountryToID(combinedData.anagrafica.stato, combinedData.country) || 108,
      //cityRes: combinedData.anagrafica.comuneResidenza,
      //cityBirth: combinedData.anagrafica.comuneNascita,
      dateBirth: combinedData.anagrafica.dataNascita,
      bankAddress:
        !combinedData.anagrafica.iban || combinedData.anagrafica.iban === ""
          ? null
          : combinedData.anagrafica.iban,
      zipCode: combinedData.anagrafica.cap?.toString() ?? " ",
      taxCode:
        !combinedData.anagrafica.codiceFiscale ||
        combinedData.anagrafica.codiceFiscale === ""
          ? null
          : combinedData.anagrafica.codiceFiscale,
      vatNumber: combinedData.anagrafica.partitaIva || null,
      employee_id: combinedData.anagrafica.matricola || " ",
      note: combinedData.anagrafica.note ?? " ",
      data: JSON.stringify(combinedData.anagrafica),
      gender_id: mapGenderToID(
        combinedData.anagrafica.sesso,
        combinedData.gender
      ),
      activityTypes_id: permessiIDs.length > 0 ? permessiIDs : [2, 3],
      EmploymentContract: [
        {
          id: combinedData.trattamentoEconomico.id,
          workScope_id:
            combinedData.trattamentoEconomico.tipoAmbitoLavorativo_autocomplete
              ?.id,
          contractType_id:
            combinedData.trattamentoEconomico.tipologiaContratto_autocomplete?.id,
          company_id:
            mapCompanyToID(
              combinedData.trattamentoEconomico.societa,
              combinedData.company
            ) || 1,
          startDate: combinedData.trattamentoEconomico.dataInizioTrattamento,
          endDate:
            combinedData.trattamentoEconomico.dataRecesso 
          ? combinedData.trattamentoEconomico.dataRecesso
            : addOneDay(combinedData.trattamentoEconomico.dataInizioTrattamento),
          effectiveEndDate:
          combinedData.trattamentoEconomico.scadenzaEffettiva 
          ? combinedData.trattamentoEconomico.scadenzaEffettiva 
          : addOneDay(combinedData.trattamentoEconomico.dataInizioTrattamento),
      
          hireDate:
          combinedData.trattamentoEconomico.dataAssunzione ||combinedData.trattamentoEconomico.dataInizioTrattamento,
          cessationMotivation:
            combinedData.trattamentoEconomico.motivazioneCessazione || " ",
          transformations:
            combinedData.trattamentoEconomico.trasformazioni || " ",
          collectiveAgreement: combinedData.trattamentoEconomico.ccnl || " ",
          mealVouchers: combinedData.trattamentoEconomico.buoniPasto || "NO",
          salesRate:
            Number(combinedData.trattamentoEconomico.tariffaVendita) || 0,
          dailyCost:
            Number(combinedData.trattamentoEconomico.costoGiornaliero) || 0,
          annualGrossSalary: Number(combinedData.trattamentoEconomico.ral) || 0,
          travelAllowance:
            Number(combinedData.trattamentoEconomico.trasferta) || 0,
          netMonthly: Number(combinedData.trattamentoEconomico.nettoMese) || 0,
          annualCost:
            Number(combinedData.trattamentoEconomico.costoAnnuale) || 0,
          notes: combinedData.trattamentoEconomico.note || "",
        },
      ],
    },
  };
};
