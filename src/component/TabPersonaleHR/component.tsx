import React, { useState, useEffect, useRef } from "react";
import Tab from "common/Tab";
import { TabStripSelectEventArguments } from "@progress/kendo-react-layout";
import Form from "common/Form";
import Window from "common/Window";
import styles from "./style.module.scss";
import AutoComplete from "common/AutoComplete"
import {
  getFormAnagraficaFields,
  getFormTrattamentoEconomicoFields,
  getFormRuoliFields,
  getFormPermessiFields,
} from "./FormFields";
import { AnagraficaData, TrattamentoEconomicoData, RuoliData, PermessiData } from "./modelForms";
import { ActivityTypeOption, cityAdapter, cityTypeOption, companyAdapter, companyOption, contractTypeAdapter, contractTypeOption, countryAdapter, countryOption, dataAdapter, genderAdapter, genderOption, locationOption, permessiAdapter, reverseAdapter, roleAdapter, RoleOption, sedeAdapter, wokeScopeAdapter, WokeScopeOption } from "../../adapters/personaleAdapters";
import { CrudGenericService } from "../../services/personaleServices";
import Button from "common/Button";

type PersonaleSectionProps = {
  row: Record<string, any>;
  type: any;
  closeModalCallback: () => void;
  refreshTable: () => void;
  onSubmit: (type: any, formData: any, refreshTable: () => void, id: any) => void;
};
// migliorare l'aspetto dello storico e poi capire come rendere più fluido la transiciton quando clicco su si 
const PersonaleSection: React.FC<PersonaleSectionProps> = ({ row, type, closeModalCallback, refreshTable, onSubmit }) => {
  const isCreate = type === "create";
  const [newForm, setNewForm] = useState<boolean>(false);
  const [country, setCountry] = useState<countryOption[]>([]);
  const { anagrafica, trattamentoEconomico, ruoli, permessi } = isCreate ? {
    anagrafica: {},
    trattamentoEconomico: {},
    ruoli: {},
    permessi: {},
  } : dataAdapter(row);
  const [selected, setSelected] = useState(0);
  const [formAnagraficaData, setFormAnagraficaData] = useState<AnagraficaData>(anagrafica);
  const [formTrattamentoEconomicoData, setFormTrattamentoEconomicoData] = useState<TrattamentoEconomicoData>(!newForm ? trattamentoEconomico : {});
  const [storicoTrattamentoData, setStoricoTrattamentoData] = useState<any>(row.trattamentoEconomicoArray);
  const [formRuoliData, setFormRuoliData] = useState<RuoliData>(ruoli);
  const [formPermessiData, setFormPermessiData] = useState<PermessiData>(permessi);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [wokeScope, setWokeScope] = useState<WokeScopeOption[]>([]);
  const [company, setCompany] = useState<companyOption[]>([]);
  const [gender, setGender] = useState<genderOption[]>([]);
  const [contractType, setContractType] = useState<contractTypeOption[]>([]);
  const [activity, setActivity] = useState<ActivityTypeOption[]>([]);
  const formAnagrafica = useRef<HTMLFormElement>(null);
  const formTrattamentoEconomico = useRef<HTMLFormElement>(null);
  const formRuoli = useRef<HTMLFormElement>(null);
  const formPermessi = useRef<HTMLFormElement>(null);
  const [city, setCity] = useState<cityTypeOption[]>([]);
  const [sede,setSede]=useState<locationOption[]>([])
  
  const [showNewContractModal, setShowNewContractModal] = useState(false);
  const [confirmNewContractStep, setConfirmNewContractStep] = useState(false);

  const handleSelect = (e: TabStripSelectEventArguments) => {
    setSelected(e.selected);
  };

  console.log(anagrafica)
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

      if (formTrattamentoEconomico.current) {
        formTrattamentoEconomico.current.onSubmit();
        if (formTrattamentoEconomico.current.isValid()) {
          setFormTrattamentoEconomicoData(formTrattamentoEconomico.current.values);
        } else {
          hasError = true;
        }
      }

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
      country: country,
      sede:sede,
    };

    

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
    if (formTrattamentoEconomico.current) {
      if (!newForm) {
        setFormTrattamentoEconomicoData(formTrattamentoEconomico.current.values);
      } else {
        formTrattamentoEconomico.current.values = {}
        setFormTrattamentoEconomicoData(formTrattamentoEconomico.current.values)
      }
    }
    if (formRuoli.current) {
      setFormRuoliData(formRuoli.current.values);
    }
    if (formPermessi.current) {
      setFormPermessiData(formPermessi.current.values);
    }
  }, [selected, newForm]);

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
       
        const sedeResponse = await CrudGenericService.fetchResources("location");
        const adaptedLocation = sedeAdapter(sedeResponse)
        setSede(adaptedLocation)

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (newForm) {
      setStoricoTrattamentoData([...storicoTrattamentoData, formTrattamentoEconomicoData]);
      setNewForm(false);
    }
  }, [newForm]);

  const renderStoricoTrattamento = () => {
    return (
      <div>
        <h3>Storico Trattamenti Economici</h3>
        <div className={styles.container}>
          {storicoTrattamentoData.length > 0 ? (
            storicoTrattamentoData.map((storico: TrattamentoEconomicoData, index: number) => (
              <div key={index} className={styles.storicoItem}>
                <h4>Trattamento Economico {index + 1}</h4>
                <div className={styles.col}><strong>Tipologia Contratto:</strong> {storico.tipologiaContratto}</div>
                <div className={styles.col}><strong>Società:</strong> {storico.societa}</div>
                <div className={styles.col}><strong>Tipo Ambito Lavorativo:</strong> {storico.tipoAmbitoLavorativo}</div>
                <div className={styles.col}><strong>Data Inizio Trattamento:</strong> {storico.dataInizioTrattamento ? new Date(storico.dataInizioTrattamento).toLocaleDateString() : 'N/A'}</div>
                <div className={styles.col}><strong>Costo Giornaliero:</strong> {storico.costoGiornaliero}</div>
                <div className={styles.col}><strong>Data Assunzione:</strong> {storico.dataAssunzione ? new Date(storico.dataAssunzione).toLocaleDateString() : 'N/A'}</div>
                <div className={styles.col}><strong>Scadenza Effettiva:</strong> {storico.scadenzaEffettiva ? new Date(storico.scadenzaEffettiva).toLocaleDateString() : 'N/A'}</div>
                <div className={styles.col}><strong>Data Recesso:</strong> {storico.dataRecesso ? new Date(storico.dataRecesso).toLocaleDateString() : 'N/A'}</div>
                <div className={styles.col}><strong>Motivazione Cessazione:</strong> {storico.motivazioneCessazione}</div>
                <div className={styles.col}><strong>Trasformazioni:</strong> {storico.trasformazioni}</div>
                <div className={styles.col}><strong>CCNL:</strong> {storico.ccnl}</div>
                <div className={styles.col}><strong>RAL:</strong> {storico.ral}</div>
                <div className={styles.col}><strong>Trasferta:</strong> {storico.trasferta}</div>
                <div className={styles.col}><strong>Buoni Pasto:</strong> {storico.buoniPasto}</div>
                <div className={styles.col}><strong>Netto Mese:</strong> {storico.nettoMese}</div>
                <div className={styles.col}><strong>Costo Annuale:</strong> {storico.costoAnnuale}</div>
                <div className={styles.col}><strong>Tariffa Vendita:</strong> {storico.tariffaVendita}</div>
                <div className={styles.col}><strong>Note:</strong> {storico.note}</div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <h5>Nessun Trattamento Economico Precedente</h5>
            </div>
          )}
        </div>
      </div>
    );
  };


  const handleNewContract = () => {
    setShowNewContractModal(true);
    setConfirmNewContractStep(true);
  };

  const confirmNewContract = () => {
    setNewForm(true);
    setShowNewContractModal(false);
  };

  const closeNewContractModal = () => {
    setShowNewContractModal(false);
    setConfirmNewContractStep(false);
  };

  const tabs = [
    {
      title: "Anagrafica",
      children: (
        <div className={styles.parentForm}>
          <Form
            ref={formAnagrafica}
            fields={Object.values(getFormAnagraficaFields(formAnagraficaData, gender, type, city, country,sede))}
            formData={formAnagraficaData}
            onSubmit={(data: AnagraficaData) => setFormAnagraficaData(data)}
            description="Ana"
          />
           <AutoComplete
               ref={formAnagrafica}
                data={country.map((c) => c.label)}
                value={formAnagraficaData.stato || ""}
                placeholder={"Stato"}
                style={{ width: "200px" }}
                onChange={(e) => setFormAnagraficaData({ ...formAnagraficaData, stato: e.value })}
               />
          
        </div>
      ),
    },
    {
      title: "Trattamento Economico",
      children: (
        <div className={styles.parentForm}>
          <Form
            ref={formTrattamentoEconomico}
            fields={Object.values(getFormTrattamentoEconomicoFields(formTrattamentoEconomicoData, wokeScope, contractType, company, type))}
            formData={formTrattamentoEconomicoData}
            onSubmit={(data: TrattamentoEconomicoData) => setFormTrattamentoEconomicoData(data)}
            description="TE"
          />
            
          {type === "edit" && (
            <>
              <Button onClick={handleNewContract}>Nuovo Trattamento</Button>
              <div className={styles.listBoxContainer}>
                {renderStoricoTrattamento()}
              </div>
            </>
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
          initialHeight={250}
          initialWidth={600}
        >
          {confirmNewContractStep ? (
            <>
              <p>
                Se procedi con la modifica il trattamento corrente verrà interrotto al giorno precedente alla nuova data di inizio trattamento. Per rendere effettiva la modifica premi il tasto salva. Vuoi procedere?
              </p>
              <div className={styles.buttonContainer}>
                <Button className={styles.cancelButton} onClick={closeNewContractModal}>
                  No
                </Button>
                <Button className={styles.confirmButton} onClick={confirmNewContract}>
                  Sì
                </Button>
              </div>
            </>
          ) : null}
        </Window>
      )}

    </div>
  );
};

export default PersonaleSection;
