import {
  AnagraficaData,
  TrattamentoEconomicoData,
  RuoliData,
  PermessiData,
} from "../component/TabPersonaleHR/modelForms";

export const convertToFileObjectBlob = (fileObject: any) => {
  if (fileObject && fileObject.data && fileObject.file_name) {
    const fileBlob = new Blob([new Uint8Array(fileObject.data)], {
      type: fileObject.content_type,
    });

    const file = new File([fileBlob], fileObject.file_name, {
      type: fileObject.content_type,
      lastModified: new Date().getTime(),
    });

    return file;
  }

  return null;
};

const isValidValue = (value) =>
  value !== null &&
  value !== undefined &&
  typeof value === "string" &&
  value.trim() !== "";

// map dal be al fe
const mapToAnagraficaData = (
  Person: any,
  sedeLabel: string
): AnagraficaData => ({
  person_id: Person?.id,
  accountStatus_id: Person?.accountStatus_id,
  nome: Person?.firstName || "",
  cognome: Person?.lastName || "",
  matricola: Person?.employee_id || "",
  sesso: Person?.Gender?.code,

  residenza: {
    city: {
      id: Person?.CityRes?.id,
      name: Person?.CityRes?.name,
      code: Person?.CityRes?.code,
    },
    country: {
      id:
        isValidValue(Person?.CityRes?.Country?.id) ||
        isValidValue(Person?.CityRes?.Province?.Country?.id)
          ? Person?.CityRes?.Country?.id ||
            Person?.CityRes?.Province?.Country?.id
          : 108,
      name:
        isValidValue(Person?.CityRes?.Country?.name) ||
        isValidValue(Person?.CityRes?.Province?.Country?.name)
          ? Person?.CityRes?.Country?.name ||
            Person?.CityRes?.Province?.Country?.name
          : "Italy",
      code:
        isValidValue(Person?.CityRes?.Country?.code) ||
        isValidValue(Person?.CityRes?.Province?.Country?.code)
          ? Person?.CityRes?.Country?.code ||
            Person?.CityRes?.Province?.Country?.code
          : "IT",
    },
    province:
      Person?.CityRes && Person?.CityRes?.Province
        ? {
            id: Person?.CityRes?.Province.id,
            name: Person?.CityRes?.Province.name,
            code: Person?.CityRes?.Province.code,
          }
        : undefined,
  },

  attachment_id : Person && Array.isArray(Person.files)
  ? Person.files.map((file) => ({
      id: file.uniqueRecordIdentifier,
    }))
  : [],
  nascita: {
    city: {
      id: Person?.CityBirth?.id,
      name: Person?.CityBirth?.name,
      code: Person?.CityBirth?.code,
    },
    country: {
      id:
        isValidValue(Person?.CityBirth?.Country?.id) ||
        isValidValue(Person?.CityRes?.Province?.Country?.id)
          ? Person.CityBirth?.Country?.id ||
            Person.CityRes?.Province?.Country?.id
          : 108,
      name:
        isValidValue(Person?.CityBirth?.Country?.name) ||
        isValidValue(Person?.CityRes?.Province?.Country?.name)
          ? Person.CityBirth?.Country?.name ||
            Person.CityRes?.Province?.Country?.name
          : "Italy",
      code:
        isValidValue(Person?.CityBirth?.Country?.code) ||
        isValidValue(Person?.CityRes?.Province?.Country?.code)
          ? Person.CityBirth?.Country?.code ||
            Person.CityRes?.Province?.Country?.code
          : "IT",
    },
    province:
      Person?.CityBirth && Person?.CityBirth?.Province
        ? {
            id: Person?.CityBirth.Province.id,
            name: Person?.CityBirth.Province.name,
            code: Person?.CityBirth.Province.code,
          }
        : undefined,
  },
  skills: Person?.PersonSkillAreas
    ? Person.PersonSkillAreas.map((skillArea: any) => ({
        id: skillArea.SkillArea?.id,
        name: skillArea.SkillArea?.name,
        skillCategory_id: skillArea.SkillArea?.skillCategory_id,
        description: skillArea.SkillArea?.description,
        seniority: skillArea?.Seniority,
      }))
    : [],
  seniority: getSeniorAbbrevation(Person?.Seniority) || "",
  indirizzoResidenza: Person?.address || "",
  dataNascita: Person?.dateBirth ? new Date(Person.dateBirth) : null,
  cap: Person?.zipCode ? parseInt(Person.zipCode, 10) : 0,
  cellulare: Person?.phoneNumber ? parseInt(Person.phoneNumber, 10) : 0,
  telefonoCasa: Person?.phoneNumber2 ? parseInt(Person.phoneNumber2, 10) : 0,
  emailPrivata: Person?.privateEmail || "",
  iban: Person?.bankAddress || "",
  partitaIva: Person?.vatNumber || 0,
  sede: sedeLabel,
  sede_autocomplete_id: Person?.location_id,
  sede_autocomplete: { id: Person?.location_id, name: sedeLabel },
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

const findMostRecentContract = (
  contracts: any[],
  currentContract: any
): any => {
  if (!currentContract || contracts.length === 0) return null;

  return (
    contracts.find((contract) => contract.id === currentContract.id) ||
    currentContract
  );
};

//per la tabella sia per le cllonne che per gestire tutto
export const transformUserData = (data: any[], sede: locationOption[]) => {
  return data.map((user) => {
    const currentContract = user?.Person?.CurrentContract?.Contract || null;
    const employmentContracts = user?.Person?.EmploymentContract || [];
    const mostRecentContract = findMostRecentContract(
      employmentContracts,
      currentContract
    );

    const otherContracts = employmentContracts.filter(
      (contract) => contract.id !== mostRecentContract?.id
    );

    const sedeLabel =
      sede?.find((sede) => sede.value === user?.Person?.location_id)?.label ||
      " ";

    return {
      id: user.id,
      person_id: user.person_id,
      company: currentContract?.Company?.name ?? "",
      lastName: user?.Person?.lastName ?? "",
      firstName: user?.Person?.firstName ?? "",
      email: user?.email,
      ContractType: currentContract?.ContractType?.description ?? "",
      annualCost: currentContract?.annualCost ?? "",
      dailyCost: currentContract?.dailyCost ?? "",
      anagrafica: mapToAnagraficaData(user.Person, sedeLabel),
      trattamentoEconomico: mapToTrattamentoEconomicoData(
        currentContract || {}
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
    seniority: row.anagrafica.seniority || "",
    sesso: row.anagrafica.sesso,
    città: row.anagrafica.città || "",
    attachment_id: row.anagrafica.attachment_id || null,
    attachment: row.anagrafica.attachment || null,
    residenza: row.anagrafica.residenza || undefined,
    nascita: row.anagrafica.nascita || undefined,
    existingFile: row.anagrafica.existingFile || undefined,
    skills: row.anagrafica.skills,
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
    tipologiaContratto_autocomplete:
      row.trattamentoEconomico?.tipologiaContratto_autocomplete,
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


  const ruoliData: RuoliData = row.ruoli || {};

  const permessiData: any ={};

  if(row.permessiId){
    row.permessiId.forEach(r=>{
      permessiData[r]=true;
    })
  }

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
    isHoliday: boolean;
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
  isHoliday?: boolean;
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
  return apiResponse.data
    .filter((permesso) => permesso.isHoliday)
    .map((permesso) => ({
      label: permesso.description,
      value: permesso.id,
      code: permesso.code,
      isHoliday: permesso.isHoliday,
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
  modifiedData: Record<string, any>;
  newFormTrattamentoEconomico: boolean;
  skills: MappedSkill[];
}) => {
  const attachments = combinedData.anagrafica.attachment;
  const personSkillAreas =
    combinedData.anagrafica.skills?.map((skill) => {
      const skillId =
        skill.id || combinedData.skills.find((s) => s.name === skill.name)?.id;

      return {
        skillArea_id: skillId,
      };
    }) || [];
  const permessiIDs =combinedData.permessi? Object.keys(combinedData.permessi).filter(k=>combinedData.permessi[k]).map(k=>parseInt(k)):[];

    //mapPermessiNamesToIDs(combinedData.permessi, combinedData.idPermessi) || [];

  let attachmentFiles = attachments;
  if (attachments && attachmentFiles?.create) {
    attachmentFiles.create = attachmentFiles.create.map((p) => ({
      ...p,
      property: "Person.files",
    }));
  }

  return {
    email: combinedData.anagrafica.email,
    accountStatus_id: combinedData.anagrafica.accountStatus_id,
    roles_id: mapRoleNamesToIDs(combinedData.ruoli, combinedData.idRuoli) || [],
    role_ids: mapRoleNamesToIDs(combinedData.ruoli, combinedData.idRuoli) || [],
    Person: {
      firstName: combinedData.anagrafica.nome,
      lastName: combinedData.anagrafica.cognome,
      id: combinedData.anagrafica.person_id,
      phoneNumber: combinedData.anagrafica.cellulare?.toString(),
      phoneNumber2: combinedData.anagrafica.telefonoCasa?.toString(),
      address: combinedData.anagrafica.indirizzoResidenza,
      privateEmail:
        !combinedData.anagrafica.emailPrivata ||
        combinedData.anagrafica.emailPrivata === ""
          ? null
          : combinedData.anagrafica.emailPrivata,
      cityRes_id:
        !combinedData.anagrafica.residenza?.city?.id ||
        combinedData.anagrafica.residenza?.city?.id.toString() === ""
          ? null
          : combinedData.anagrafica.residenza?.city?.id,
      Attachment: attachments,
      location_id: combinedData.anagrafica.sede_autocomplete?.id || 1,
      cityBirth_id:
        !combinedData.anagrafica.nascita?.city?.id ||
        combinedData.anagrafica.nascita?.city?.id.toString() === ""
          ? null
          : combinedData.anagrafica.nascita?.city?.id,
      dateBirth: combinedData.anagrafica.dataNascita,
      bankAddress:
        !combinedData.anagrafica.iban || combinedData.anagrafica.iban === ""
          ? null
          : combinedData.anagrafica.iban,
      zipCode:
        combinedData.anagrafica.cap &&
        combinedData.anagrafica.cap.toString().trim() !== ""
          ? combinedData.anagrafica.cap
          : null,
      Seniority: getSeniorAbbrevationToBe(combinedData.anagrafica.seniority),
      PersonSkillAreas: personSkillAreas,
      taxCode:
        !combinedData.anagrafica.codiceFiscale ||
        combinedData.anagrafica.codiceFiscale === ""
          ? null
          : combinedData.anagrafica.codiceFiscale,
      vatNumber: combinedData.anagrafica.partitaIva || null,
      employee_id: combinedData.anagrafica.matricola || " ",
      note: combinedData.anagrafica.note ?? " ",
      data: "{}",
      gender_id:
        mapGenderToID(combinedData.anagrafica.sesso, combinedData.gender) || 1,
      activityType_ids: permessiIDs.length > 0 ? permessiIDs : undefined,
      EmploymentContract: [
        {
          id: combinedData.trattamentoEconomico.id,
          workScope_id:
            combinedData.trattamentoEconomico.tipoAmbitoLavorativo_autocomplete
              ?.id || 1,
          contractType_id:
            combinedData.trattamentoEconomico.tipologiaContratto_autocomplete
              ?.id || 1,
          company_id:
            mapCompanyToID(
              combinedData.trattamentoEconomico.societa,
              combinedData.company
            ) || 1,
          startDate: combinedData.trattamentoEconomico.dataInizioTrattamento,
          endDate: combinedData.trattamentoEconomico.dataRecesso
            ? combinedData.trattamentoEconomico.dataRecesso
            : null,
          effectiveEndDate: combinedData.trattamentoEconomico.scadenzaEffettiva
            ? combinedData.trattamentoEconomico.scadenzaEffettiva
            : null,

          hireDate:
            combinedData.trattamentoEconomico.dataAssunzione ||
            combinedData.trattamentoEconomico.dataInizioTrattamento,
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

interface SkillArea {
  id: number;
  code: string;
  name: string;
  description: string | null;
  skillCategory_id: number;
  date_created: string;
  date_modified: string;
}

export interface MappedSkill {
  id: number;
  name: string;
}

export const mapSkillAreas = (skillAreas: SkillArea[]): MappedSkill[] => {
  return skillAreas.map((skill) => ({
    id: skill.id,
    name: skill.name,
  }));
};

export const reverseAdapterUpdate = (combinedData: {
  id: any;
  idRuoli: any[];
  idPermessi: any[];
  company: companyOption[];
  gender: genderOption[];
  anagrafica: AnagraficaData;
  trattamentoEconomico: TrattamentoEconomicoData;
  ruoli: RuoliData;
  permessi: PermessiData;
  modifiedData: Record<string, any>;
  newFormTrattamentoEconomico: boolean;
  skills: MappedSkill[];
}) => {
  const permessiIDs =
    mapPermessiNamesToIDs(combinedData.permessi, combinedData.idPermessi) || [];
  
  const result: any = {};
  console.log(combinedData.anagrafica)
  console.log(combinedData.modifiedData.seniority)
  const attachments = combinedData.modifiedData.attachment
    ? combinedData.modifiedData.attachment.create.map((o) => ({
        ...o,
        property: "Person.files",
      }))
    : null;
  if (combinedData.anagrafica.accountStatus_id) {
    result.accountStatus_id = combinedData.anagrafica.accountStatus_id;
  }

  if ("email" in combinedData.modifiedData) {
    result.email = combinedData.modifiedData.email || null;
  }

  // Anagrafica modificata
  result.Person = {};
  result.Person.id = combinedData.anagrafica.person_id;
  if ("nome" in combinedData.modifiedData) {
    result.Person.firstName = combinedData.modifiedData.nome;
  }

  if ("cognome" in combinedData.modifiedData) {
    result.Person.lastName = combinedData.modifiedData.cognome;
  }

  if ("cellulare" in combinedData.modifiedData) {
    result.Person.phoneNumber = combinedData.modifiedData.cellulare?.toString();
  }

  if ("telefonoCasa" in combinedData.modifiedData) {
    result.Person.phoneNumber2 =
      combinedData.modifiedData.telefonoCasa?.toString();
  }

  if ("indirizzoResidenza" in combinedData.modifiedData) {
    result.Person.address = combinedData.modifiedData.indirizzoResidenza;
  }

  if ("emailPrivata" in combinedData.modifiedData) {
    result.Person.privateEmail = combinedData.modifiedData.emailPrivata || null;
  }

  if ("residenza" in combinedData.modifiedData) {
    result.Person.cityRes_id =
      combinedData.modifiedData.residenza.city?.id || null;
  }

  if ("attachment" in combinedData.modifiedData) {
    result.Person.Attachment = attachments;
  }

  if ("sede_autocomplete" in combinedData.modifiedData) {
    result.Person.location_id =
      combinedData.modifiedData.sede_autocomplete?.id || 1;
  }

  if ("dataNascita" in combinedData.modifiedData) {
    result.Person.dateBirth = combinedData.modifiedData.dataNascita;
  }

  if ("iban" in combinedData.modifiedData) {
    result.Person.bankAddress =
      !combinedData.modifiedData.iban || combinedData.modifiedData.iban === ""
        ? null
        : combinedData.modifiedData.iban;
  }

  if ("cap" in combinedData.modifiedData) {
    result.Person.zipCode =
      !combinedData.modifiedData.cap?.toString() ||
      combinedData.modifiedData.cap?.toString() === ""
        ? null
        : combinedData.modifiedData.cap?.toString();
  }

  if ("codiceFiscale" in combinedData.modifiedData) {
    result.Person.taxCode =
      !combinedData.modifiedData.codiceFiscale ||
      combinedData.modifiedData.codiceFiscale === ""
        ? null
        : combinedData.modifiedData.codiceFiscale;
  }

  if ("partitaIva" in combinedData.modifiedData) {
    result.Person.vatNumber =
      !combinedData.modifiedData.partitaIva ||
      combinedData.modifiedData.partitaIva === ""
        ? null
        : combinedData.modifiedData.partitaIva;
  }

  if ("matricola" in combinedData.modifiedData) {
    result.Person.employee_id = combinedData.modifiedData.matricola;
  }

  if ("note" in combinedData.modifiedData) {
    result.Person.note = combinedData.modifiedData.note;
  }

  if ("sesso" in combinedData.modifiedData) {
    result.Person.gender_id =
      mapGenderToID(combinedData.modifiedData.sesso, combinedData.gender) || 1;
  }

  if ("seniority" in combinedData.modifiedData) {
    result.Person.Seniority = getSeniorAbbrevationToBe(combinedData.modifiedData.seniority);
    console.log(getSeniorAbbrevationToBe(combinedData.modifiedData.seniority))
  }
  if ("skills" in combinedData.modifiedData) {
    result.Person.PersonSkillAreas =
      combinedData.modifiedData.skills.map((skill) => {
        const skillId =
          skill.id ||
          combinedData.skills.find((s) => s.name === skill.name)?.id;
        return {
          skillArea_id: skillId,
        };
      }) || [];
  }

  // Trattamento Economico - solo i campi modificati
  if (combinedData.newFormTrattamentoEconomico) {
    // Se è un nuovo trattamento, usa tutti i campi
    result.Person.EmploymentContract = [
      {
        workScope_id:
          combinedData.trattamentoEconomico.tipoAmbitoLavorativo_autocomplete
            ?.id || 1,
        contractType_id:
          combinedData.trattamentoEconomico.tipologiaContratto_autocomplete
            ?.id || 1,
        company_id:
          mapCompanyToID(
            combinedData.trattamentoEconomico.societa,
            combinedData.company
          ) || 1,
        startDate: combinedData.trattamentoEconomico.dataInizioTrattamento,
        endDate: combinedData.trattamentoEconomico.dataRecesso || null,
        effectiveEndDate:
          combinedData.trattamentoEconomico.scadenzaEffettiva || null,
        hireDate:
          combinedData.trattamentoEconomico.dataAssunzione ||
          combinedData.trattamentoEconomico.dataInizioTrattamento,
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
        annualCost: Number(combinedData.trattamentoEconomico.costoAnnuale) || 0,
        notes: combinedData.trattamentoEconomico.note || "",
      },
    ];
  } else {
    // Se non è un nuovo trattamento, usa solo i campi modificati
    const employmentContract: any = {
      id: combinedData.trattamentoEconomico.id,
    };

    if ("tipoAmbitoLavorativo_autocomplete" in combinedData.modifiedData) {
      employmentContract.workScope_id =
        combinedData.modifiedData.tipoAmbitoLavorativo_autocomplete?.id || 1;
    }

    if ("tipologiaContratto_autocomplete" in combinedData.modifiedData) {
      employmentContract.contractType_id =
        combinedData.modifiedData.tipologiaContratto_autocomplete?.id || 1;
    }

    if ("societa" in combinedData.modifiedData) {
      employmentContract.company_id =
        mapCompanyToID(
          combinedData.modifiedData.societa,
          combinedData.company
        ) || 1;
    }

    if ("dataInizioTrattamento" in combinedData.modifiedData) {
      employmentContract.startDate =
        combinedData.modifiedData.dataInizioTrattamento;
    }

    if ("dataRecesso" in combinedData.modifiedData) {
      employmentContract.endDate =
        combinedData.modifiedData.dataRecesso || null;
    }

    if ("scadenzaEffettiva" in combinedData.modifiedData) {
      employmentContract.effectiveEndDate =
        combinedData.modifiedData.scadenzaEffettiva || null;
    }

    if ("dataAssunzione" in combinedData.modifiedData) {
      employmentContract.hireDate =
        combinedData.modifiedData.dataAssunzione ||
        combinedData.trattamentoEconomico.dataAssunzione;
    }

    if ("motivazioneCessazione" in combinedData.modifiedData) {
      employmentContract.cessationMotivation =
        combinedData.modifiedData.motivazioneCessazione || " ";
    }

    if ("trasformazioni" in combinedData.modifiedData) {
      employmentContract.transformations =
        combinedData.modifiedData.trasformazioni || " ";
    }

    if ("ccnl" in combinedData.modifiedData) {
      employmentContract.collectiveAgreement =
        combinedData.modifiedData.ccnl || " ";
    }

    if ("buoniPasto" in combinedData.modifiedData) {
      employmentContract.mealVouchers =
        combinedData.modifiedData.buoniPasto || "NO";
    }

    if ("tariffaVendita" in combinedData.modifiedData) {
      employmentContract.salesRate =
        Number(combinedData.modifiedData.tariffaVendita) || 0;
    }

    if ("costoGiornaliero" in combinedData.modifiedData) {
      employmentContract.dailyCost =
        Number(combinedData.modifiedData.costoGiornaliero) || 0;
    }

    if ("ral" in combinedData.modifiedData) {
      employmentContract.annualGrossSalary =
        Number(combinedData.modifiedData.ral) || 0;
    }

    if ("trasferta" in combinedData.modifiedData) {
      employmentContract.travelAllowance =
        Number(combinedData.modifiedData.trasferta) || 0;
    }

    if ("nettoMese" in combinedData.modifiedData) {
      employmentContract.netMonthly =
        Number(combinedData.modifiedData.nettoMese) || 0;
    }

    if ("costoAnnuale" in combinedData.modifiedData) {
      employmentContract.annualCost =
        Number(combinedData.modifiedData.costoAnnuale) || 0;
    }

    if ("note" in combinedData.modifiedData) {
      employmentContract.notes = combinedData.modifiedData.note || "";
    }

    // Aggiungi l'oggetto `employmentContract` solo se ci sono campi modificati
    if (Object.keys(employmentContract).length > 1) {
      result.Person.EmploymentContract = [employmentContract];
    }
  }

  result.Person.activityType_ids = combinedData.permessi? Object.keys(combinedData.permessi).filter(k=>combinedData.permessi[k]).map(k=>parseInt(k)):[];

  result.role_ids =
    mapRoleNamesToIDs(combinedData.ruoli, combinedData.idRuoli) || [];

  return result;
};

// adapter per l'api ai che riempie gli input
export const anagraficaAiButtonAdapter = (
  data: any,
  formAnagraficaData: AnagraficaData,
  modifiedFields: any,
  gender: genderOption[],
  skillData: any[],
  seniority: string
) => {
  const genderValue = data.gender_id;
  const genderLabel = gender.find(
    (genderOption) => genderOption.value === genderValue
  )?.label;
  const fallbackIfEmpty = (value: any, fallback: any) => {
    return value !== null && value !== undefined && value !== ""
      ? value
      : fallback;
  };
  const combinedSkills = [
    ...skillData,
    ...(modifiedFields.skills || []),
    ...(formAnagraficaData.skills || []),
  ];

  const uniqueSkills = [
    ...new Map(combinedSkills.map((skill) => [skill.name, skill])).values(),
  ];

  return {
    ...formAnagraficaData,
    skills: uniqueSkills,
    seniority: getSeniorAbbrevation(seniority) || seniority,
    nome: fallbackIfEmpty(
      data.firstName,
      modifiedFields.nome || formAnagraficaData.nome || ""
    ),
    cognome: fallbackIfEmpty(
      data.lastName,
      modifiedFields.cognome || formAnagraficaData.cognome || ""
    ),
    cellulare: fallbackIfEmpty(
      data.phoneNumber,
      modifiedFields.cellulare || formAnagraficaData.cellulare || ""
    ),
    telefonoCasa: fallbackIfEmpty(
      data.phoneNumber2,
      modifiedFields.telefonoCasa || formAnagraficaData.telefonoCasa || ""
    ),
    indirizzoResidenza: fallbackIfEmpty(
      data.address,
      modifiedFields.indirizzoResidenza ||
        formAnagraficaData.indirizzoResidenza ||
        ""
    ),
    emailPrivata: fallbackIfEmpty(
      data.privateEmail,
      modifiedFields.emailPrivata || formAnagraficaData.emailPrivata || ""
    ),
    sesso: fallbackIfEmpty(
      genderLabel,
      modifiedFields.sesso || formAnagraficaData.sesso || ""
    ),
    iban: fallbackIfEmpty(
      data.bankAddress,
      modifiedFields.iban || formAnagraficaData.iban || ""
    ),
    dataNascita: fallbackIfEmpty(
      new Date(data.dateBirth),
      modifiedFields.dataNascita || formAnagraficaData.dataNascita || null
    ),
    cap: fallbackIfEmpty(
      data.zipCode,
      modifiedFields.cap || formAnagraficaData.cap || ""
    ),
    codiceFiscale: fallbackIfEmpty(
      data.taxCode,
      modifiedFields.codiceFiscale || formAnagraficaData.codiceFiscale || ""
    ),
    attachment:
      modifiedFields.attachment || formAnagraficaData.attachment || "",
    /* person_id:(formAnagraficaData.person_id), */
    partitaIva: fallbackIfEmpty(
      data.vatNumber,
      modifiedFields.partitaIva || formAnagraficaData.partitaIva || ""
    ),
    residenza: {
      city: {
        id: fallbackIfEmpty(
          data.cityRes_id,
          modifiedFields.residenza?.city?.id ||
            formAnagraficaData.residenza?.city?.id ||
            ""
        ),
        name: fallbackIfEmpty(
          data.cityRes?.name,
          modifiedFields.residenza?.city?.name ||
            formAnagraficaData.residenza?.city?.name ||
            ""
        ),
        code: fallbackIfEmpty(
          data.cityRes?.code,
          modifiedFields.residenza?.city?.code ||
            formAnagraficaData.residenza?.city?.code ||
            ""
        ),
      },
      country: {
        id: fallbackIfEmpty(
          data.cityRes?.Country?.id,
          modifiedFields.residenza?.country?.id ||
            formAnagraficaData.residenza?.country?.id ||
            ""
        ),
        name: fallbackIfEmpty(
          data.cityRes?.Country?.name,
          modifiedFields.residenza?.country?.name ||
            formAnagraficaData.residenza?.country?.name ||
            ""
        ),
        code: fallbackIfEmpty(
          data.cityRes?.Country?.code,
          modifiedFields.residenza?.country?.code ||
            formAnagraficaData.residenza?.country?.code ||
            ""
        ),
      },
      province: {
        id: fallbackIfEmpty(
          data.cityRes?.Province?.province_id,
          modifiedFields.residenza?.province?.id ||
            formAnagraficaData.residenza?.province?.id ||
            ""
        ),
        name: fallbackIfEmpty(
          data.cityRes?.Province?.name,
          modifiedFields.residenza?.province?.name ||
            formAnagraficaData.residenza?.province?.name ||
            ""
        ),
        code: fallbackIfEmpty(
          data.cityRes?.Province?.code,
          modifiedFields.residenza?.province?.code ||
            formAnagraficaData.residenza?.province?.code ||
            ""
        ),
      },
    },
    nascita: {
      city: {
        id: fallbackIfEmpty(
          data.cityBirth_id,
          modifiedFields.nascita?.city?.id ||
            formAnagraficaData.nascita?.city?.id ||
            ""
        ),
        name: fallbackIfEmpty(
          data.cityBirth?.name,
          modifiedFields.nascita?.city?.name ||
            formAnagraficaData.nascita?.city?.name ||
            ""
        ),
        code: fallbackIfEmpty(
          data.cityBirth?.code,
          modifiedFields.nascita?.city?.code ||
            formAnagraficaData.nascita?.city?.code ||
            ""
        ),
      },
      country: {
        id: fallbackIfEmpty(
          data.cityBirth?.Country?.id,
          modifiedFields.nascita?.country?.id ||
            formAnagraficaData.nascita?.country?.id ||
            ""
        ),
        name: fallbackIfEmpty(
          data.cityBirth?.Country?.name,
          modifiedFields.nascita?.country?.name ||
            formAnagraficaData.nascita?.country?.name ||
            ""
        ),
        code: fallbackIfEmpty(
          data.cityBirth?.Country?.code,
          modifiedFields.nascita?.country?.code ||
            formAnagraficaData.nascita?.country?.code ||
            ""
        ),
      },
      province: {
        id: fallbackIfEmpty(
          data.cityBirth?.Province?.province_id,
          modifiedFields.nascita?.province?.id ||
            formAnagraficaData.nascita?.province?.id ||
            ""
        ),
        name: fallbackIfEmpty(
          data.cityBirth?.Province?.name,
          modifiedFields.nascita?.province?.name ||
            formAnagraficaData.nascita?.province?.name ||
            ""
        ),
        code: fallbackIfEmpty(
          data.cityBirth?.Province?.code,
          modifiedFields.nascita?.province?.code ||
            formAnagraficaData.nascita?.province?.code ||
            ""
        ),
      },
    },

    sede_autocomplete:
      data.location_id ??
      (modifiedFields.sede_autocomplete ||
        formAnagraficaData.sede_autocomplete ||
        ""),
    matricola:
      data.employee_id ??
      (modifiedFields.matricola || formAnagraficaData.matricola || ""),
    email:
      data.email ?? (modifiedFields.email || formAnagraficaData.email || ""),
  };
};

const getSeniorAbbrevation = (seniority: string): string => {
  switch (seniority) {
    case "J":
      return "Junior";
    case "J_A":
      return "Junior Advance";
    case "M":
      return "Middle";
    case "M_A":
      return "Middle Advance";
    case "S":
      return "Senior";
    case "S_A":
      return "Senior Advance";
    default:
      return "";
  }
};
const getSeniorAbbrevationToBe = (seniority: string | undefined): string => {
  switch (seniority) {
    case "Junior":
      return "J";
    case "Junior Advance":
      return "J_A";
    case "Middle":
      return "M";
    case "Middle Advance":
      return "M_A";
    case "Senior":
      return "S";
    case "Senior Advance":
      return "S_A";
    default:
      return "";
  }
};
