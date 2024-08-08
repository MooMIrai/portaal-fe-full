import React, { useState, useEffect, useRef } from "react";
import Tab from "common/Tab";
import Form from "common/Form";
import styles from "./style.module.scss";
import {
  getFormAnagraficaFields,
  getFormTrattamentoEconomicoFields,
  getFormRuoliFields,
  getFormPermessiFields,
} from "./FormFields";
import { AnagraficaData, TrattamentoEconomicoData, RuoliData, PermessiData } from "./modelForms";
import { ActivityTypeOption, cityAdapter, cityTypeOption, companyAdapter, companyOption, contractTypeAdapter, contractTypeOption, countryAdapter, countryOption, dataAdapter, genderAdapter, genderOption, permessiAdapter, reverseAdapter, roleAdapter, RoleOption, wokeScopeAdapter, WokeScopeOption } from "../../adapters/personaleAdapters";
import { CrudGenericService } from "../../services/personaleServices";
import Window from "common/Window";

type PersonaleSectionProps = {
  row: Record<string, any>;
  type: any;
  closeModalCallback: () => void;
  refreshTable: () => void;
  onSubmit: (type: any, formData: any, refreshTable: () => void, id: any) => void;
};

//Capire perché il form principale non funziona capito uesto penso che si risolve tutto
const PersonaleSection: React.FC<PersonaleSectionProps> = ({ row, type, closeModalCallback, refreshTable, onSubmit }) => {
  const isCreate = type === "create";
  const { anagrafica, trattamentoEconomico, ruoli, permessi } = isCreate ? {
    anagrafica: {},
    trattamentoEconomico: [],
    ruoli: {},
    permessi: {},
  } : dataAdapter(row);

  const [selected, setSelected] = useState(0);
  const [formAnagraficaData, setFormAnagraficaData] = useState<AnagraficaData>(anagrafica);
  const [formTrattamentoEconomicoData, setFormTrattamentoEconomicoData] = useState<TrattamentoEconomicoData[]>(trattamentoEconomico);
  const [formTrattamentoEconomicoDataSingle,setFormTrattamentoEconomicoDataSingle]=useState<TrattamentoEconomicoData>({});
  const [formRuoliData, setFormRuoliData] = useState<RuoliData>(ruoli);
  const [formPermessiData, setFormPermessiData] = useState<PermessiData>(permessi);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [wokeScope, setWokeScope] = useState<WokeScopeOption[]>([]);
  const [company, setCompany] = useState<companyOption[]>([]);
  const [gender, setGender] = useState<genderOption[]>([]);
  const [contractType, setContractType] = useState<contractTypeOption[]>([]);
  const [activity, setActivity] = useState<ActivityTypeOption[]>([]);
  const [city, setCity] = useState<cityTypeOption[]>([]);
  const [country, setCountry] = useState<countryOption[]>([]);

  const formAnagrafica = useRef<HTMLFormElement>(null);
  const formLatestTrattamento = useRef<HTMLFormElement>(null); // Riferimento del form più recente come oggetto
  const formOtherTrattamenti = useRef<(HTMLFormElement | null)[]>([]); //riferimento a quelli storici
  const formNewTrattamento = useRef<HTMLFormElement>(null); // Riferimento del nuovo form
  const formRuoli = useRef<HTMLFormElement>(null);
  const formPermessi = useRef<HTMLFormElement>(null);

  const [expanded, setExpanded] = useState<string | null>(null);
  const [showNewContractModal, setShowNewContractModal] = useState(false);
  const [confirmNewContractStep, setConfirmNewContractStep] = useState(false);
  const [newContractData, setNewContractData] = useState<TrattamentoEconomicoData | null>(null);
  const [newFormContract, setNewFormContract] = useState<boolean>(false);
  const [latestContractState, setLatestContractState] = useState<TrattamentoEconomicoData>({});
  const [idLatest,setIdLatest]=useState<any| null>(null)

  console.log("row", row);

  const handleSelect = (e: any) => {
    setSelected(e.selected);
  };

  const handleSubmit = () => {
    let hasError = false;

    if (type === "create" || type === "edit") {
      if (formAnagrafica.current) {
        formAnagrafica.current.onSubmit();
        if (formAnagrafica.current.isValid()) {
          setFormAnagraficaData(formAnagrafica.current.values);
        } else {
          hasError = true;
        }
      }
/* 
      if (formLatestTrattamento.current) {
        formLatestTrattamento.current.onSubmit();
        if (formLatestTrattamento.current.isValid()) {
          setFormTrattamentoEconomicoData((prevState) =>
            prevState.map((contract) => (contract.id === idLatest ? { ...contract, ...formLatestTrattamento?.current.values } : contract))
          );
        } else {
          hasError = true;
        }
      }
 */
      formOtherTrattamenti.current.forEach((form, index) => {
        if (form) {
          form.onSubmit();
          if (form.isValid()) {
            setFormTrattamentoEconomicoData((prevState) =>
              prevState.map((contract, i) => (i === index ? { ...contract, ...form.values } : contract))
            );
          } else {
            hasError = true;
          }
        }
      });
      if (formRuoli.current) {
        formRuoli.current.onSubmit();
        if (formRuoli.current.isValid()) {
          setFormRuoliData(formRuoli.current.values);
        } else {
          hasError = true;
        }
      }

      if (formPermessi.current) {
        formPermessi.current.onSubmit();
        if (!formPermessi.current.isValid()) {
          hasError = true;
        } else {
          setFormPermessiData(formPermessi.current.values);
        }
      }
    }

    const combinedData = {
      id: row.id,
      idRuoli: roles,
      idPermessi: activity,
      wokescope: wokeScope,
      contractType: contractType,
      company: company,
      gender: gender,
      anagrafica: formAnagraficaData,
      trattamentoEconomico: formTrattamentoEconomicoData,
      ruoli: formRuoliData,
      permessi: formPermessiData,
      city: city,
      country: country
    };

    console.log("Combined Data:", combinedData);

    if (!hasError) {
      const formattedData = reverseAdapter(combinedData);
      console.log("formattedData", formattedData);
      const idrow = row.id;
      onSubmit(type, formattedData, refreshTable, idrow);
      refreshTable();
      closeModalCallback();
    }
  };

  useEffect(() => {
    if (formAnagrafica.current) {
      setFormAnagraficaData(formAnagrafica.current.values);
    }

    if (formLatestTrattamento.current && idLatest !== null) {
      const form = formLatestTrattamento.current;
      const contract = formTrattamentoEconomicoData.find(contract => contract.id === idLatest);
      if (contract) {
        const updatedContract = { ...contract, ...form.values };
        setFormTrattamentoEconomicoData((prevState) =>
          prevState.map(c => c.id === idLatest ? updatedContract : c)
        );
        setLatestContractState(updatedContract);
        console.log("Latest Contract State:", updatedContract);
      }
    }
    if (formRuoli.current) {
      setFormRuoliData(formRuoli.current.values);
    }
    if (formPermessi.current) {
      setFormPermessiData(formPermessi.current.values);
    }
  }, [selected]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roleResponse = await CrudGenericService.fetchResources("role");
        const adaptedRoles = roleAdapter(roleResponse);
        setRoles(adaptedRoles);

        const workScopeResponse = await CrudGenericService.fetchResources("WorkScope");
        const adaptedWokeScope = wokeScopeAdapter(workScopeResponse);
        setWokeScope(adaptedWokeScope);

        const contractTypeResponse = await CrudGenericService.fetchResources("ContractType");
        const adaptedContractType = contractTypeAdapter(contractTypeResponse);
        setContractType(adaptedContractType);

        const companyResponse = await CrudGenericService.fetchResources("Company");
        const adaptedCompany = companyAdapter(companyResponse);
        setCompany(adaptedCompany);

        const genderResponse = await CrudGenericService.fetchResources("Gender");
        const adaptedGender = genderAdapter(genderResponse);
        setGender(adaptedGender);

        const activityTypeResponse = await CrudGenericService.fetchResources("ActivityType");
        const adaptedActivities = permessiAdapter(activityTypeResponse);
        setActivity(adaptedActivities);

        const cityResponse = await CrudGenericService.fetchResources("city");
        const adaptedCity = cityAdapter(cityResponse);
        setCity(adaptedCity);

        const countryResponse = await CrudGenericService.fetchResources("country");
        const adaptedCountry = countryAdapter(countryResponse);
        setCountry(adaptedCountry);
        console.log(countryResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleNewContract = () => {
    setShowNewContractModal(true);
    setConfirmNewContractStep(true);
  };

  const confirmNewContract = () => {
    setConfirmNewContractStep(false);
    setNewFormContract(true);
  };

  const closeNewContractModal = () => {
    setShowNewContractModal(false);
    setConfirmNewContractStep(false);
    setNewFormContract(false);
    setNewContractData(null);
  };

  const handleFormSubmit = (data: TrattamentoEconomicoData) => {
    setNewContractData(data);
    saveNewContract(data);
  };

  const saveNewContract = (data: TrattamentoEconomicoData) => {
    let hasError = false;
    if (!hasError && data) {
      setLatestContractState(data);
      const updatedContracts = [...formTrattamentoEconomicoData, data];
      const sortedContracts = updatedContracts.sort((a, b) => new Date(a.dataInizioTrattamento).getTime() - new Date(b.dataInizioTrattamento).getTime());
      setFormTrattamentoEconomicoData(sortedContracts);
      setNewContractData(null);
      setNewFormContract(false);
      closeNewContractModal();
    }
  };

  useEffect(() => {
    const latestContract = formTrattamentoEconomicoData.length > 0
      ? formTrattamentoEconomicoData.reduce((latest, current) => {
        return new Date(latest.dataInizioTrattamento) > new Date(current.dataInizioTrattamento) ? latest : current;
      })
      : {};
      console.log("latest", latestContract);
      setIdLatest(()=>latestContract.id)
      console.log("idlatest",idLatest)
      setLatestContractState(() => latestContract);
      console.log("latestContractState", latestContract);
  }, [formTrattamentoEconomicoData]);

  const olderContracts = formTrattamentoEconomicoData.length > 0
    ? formTrattamentoEconomicoData.filter(contract => contract !== latestContractState)
      .sort((a, b) => new Date(a.dataInizioTrattamento).getTime() - new Date(b.dataInizioTrattamento).getTime())
    : [];

  const tabs = [
    {
      title: "Anagrafica",
      children: (
        <div className={styles.parentForm}>
          <Form
            ref={formAnagrafica}
            fields={Object.values(getFormAnagraficaFields(formAnagraficaData, gender, type, city, country))}
            formData={formAnagraficaData}
            onSubmit={(data: AnagraficaData) => setFormAnagraficaData(data)}
            description="Ana"
          />
        </div>
      ),
    },
    {
      title: "Trattamento Economico",
      children: (
        <div className={styles.parentForm}>
          <Form
            ref={formLatestTrattamento}
            fields={Object.values(getFormTrattamentoEconomicoFields(latestContractState, wokeScope, contractType, company, type))}
            formData={latestContractState}
            onSubmit={(data: TrattamentoEconomicoData) => setFormTrattamentoEconomicoData([data])}
            description="TE"
          />
          {olderContracts.map((contract, index) => (
            <div key={`contract-${index}`}>
              <h3>Previous Contract {index + 1}</h3>
              <Form
                ref={el => { formOtherTrattamenti.current[index] = el; }}
                fields={Object.values(getFormTrattamentoEconomicoFields(contract, wokeScope, contractType, company, type))}
                formData={contract}
                description={`Previous Contract ${index + 1}`}
                disabled
              />
            </div>
          ))}
             {type === "edit" && (
            <button onClick={handleNewContract}>Nuovo Trattamento</button>
          )}
        </div>
      ),
    },
    {
      title: "Assegna Profilo",
      children: (
        <div className={styles.checkboxContainer}>
          <Form
            ref={formRuoli}
            fields={Object.values(getFormRuoliFields(formRuoliData, roles, type))}
            formData={formRuoliData}
            onSubmit={(data: RuoliData) => setFormRuoliData(data)}
            description="PR"
          />
        </div>
      ),
    },
    {
      title: "Assegna Tipologia Ferie e Permessi",
      children: (
        <div className={styles.checkboxContainer}>
          <Form
            ref={formPermessi}
            fields={Object.values(getFormPermessiFields(formPermessiData, activity, type))}
            formData={formPermessiData}
            onSubmit={(data: PermessiData) => setFormPermessiData(data)}
            description="per"
          />
        </div>
      ),
    }
  ];

  return (
    <div className={styles.parentTab}>
      <Tab
        tabs={tabs}
        selected={selected}
        onSelect={handleSelect}
        button={{ label: type === "view" ? "Esci" : "Salva", onClick: handleSubmit }}
      />
      {showNewContractModal && (
        <Window
          show={showNewContractModal}
          title="Nuovo Trattamento"
          onClose={closeNewContractModal}
          callToAction="Salva"
          draggable
          resizable
          initialHeight={800}
          initialWidth={900}
        >
          {confirmNewContractStep ? (
            <>
              <p>
                Se procedi con la modifica il trattamento corrente verrà interrotto al giorno precedente alla nuova data di inizio trattamento. Per rendere effettiva la modifica premi il tasto salva. Vuoi procedere?
              </p>
              <button onClick={confirmNewContract}>Si</button>
              <button onClick={closeNewContractModal}>No</button>
            </>
          ) : (
            <div className={styles.parentForm}>
                <Form
                ref={formNewTrattamento}
                fields={Object.values(getFormTrattamentoEconomicoFields(newContractData, wokeScope, contractType, company, type, newFormContract))}
                formData={newContractData}
                onSubmit={handleFormSubmit}
                description="TE"
              />
              <button onClick={() => formNewTrattamento.current?.onSubmit()}>Salva</button>
            </div>
          )}
        </Window>
      )}
    </div>
  );
};

export default PersonaleSection;
