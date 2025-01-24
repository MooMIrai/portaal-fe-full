import React, { useState, useEffect, useRef, useMemo } from "react";
import Tab from "common/Tab";
import { TabStripSelectEventArguments } from "@progress/kendo-react-layout";
import Form from "common/Form";
import Window from "common/Window";
import styles from "./style.module.scss";
import {
  getFormAnagraficaFields,
  getFormTrattamentoEconomicoFields,
  getFormRuoliFields,
  getFormPermessiFields,
} from "./FormFields";
import { AnagraficaData, TrattamentoEconomicoData, RuoliData, PermessiData } from "./modelForms";
import { ActivityTypeOption, anagraficaAiButtonAdapter, cityTypeOption, companyOption, dataAdapter, genderOption, MappedSkill, reverseAdapter, reverseAdapterUpdate, RoleOption } from "../../adapters/personaleAdapters";
import { CrudGenericService } from "../../services/personaleServices";
import Button from "common/Button";
import { formFields } from "./customfields";
import NotificationProviderActions from "common/providers/NotificationProvider";
import LoaderComponent from "common/Loader"


type PersonaleSectionProps = {
  row: Record<string, any>;
  type: any;
  closeModalCallback: () => void;
  refreshTable: () => void;
  onSubmit: (type: any, formData: any, refreshTable: () => void, id: any,closeModalCallback: () => void) => void;
};

interface AutocompleteField {
  id: number | undefined;
  name: string | undefined;
}

// Funzioni di Utilità
const isObjectEffectivelyEmpty = (obj: Record<string, any>): boolean => {
  return Object.entries(obj).every(([key, value]) => {
    if (key.endsWith("_autocomplete") && isAutocompleteField(value)) {
      return value.id === undefined || value.name === undefined || value.name === "";
    }
    return value === "" || value === 0 || value === null || value === undefined;
  });
};

const isAutocompleteField = (value: any): value is AutocompleteField => {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value
  );
};




const PersonaleSection: React.FC<PersonaleSectionProps & {
  roles: RoleOption[];
  companies: companyOption[];
  genders: genderOption[];
  activities: ActivityTypeOption[];
  skills: MappedSkill[] | undefined
}> = ({ row, type, closeModalCallback, refreshTable, onSubmit, roles, skills, companies, genders, activities }) => {
  const isCreate = type === "create";
  const isUpdate = type === "edit"

  //state
  const [newForm, setNewForm] = useState<boolean>(false);
  const { anagrafica, trattamentoEconomico, ruoli, permessi } = isCreate ? {
    anagrafica: {
      nascita: {
        city: {
          id: 0,
          name: "",
          code: ""
        },
        country: {
          id: 108,
          name: "Italy",
          code: "IT"
        },
        province: {
          id: 0,
          name: "",
          code: ""
        }
      },
      residenza: {
        city: {
          id: 0,
          name: "",
          code: ""
        },
        country: {
          id: 108,
          name: "Italy",
          code: "IT"
        },
        province: {
          id: 0,
          name: "",
          code: ""
        }

      },
    },
    trattamentoEconomico: {},
    ruoli: {},
    permessi: {},
  } : dataAdapter(row);
  const [selected, setSelected] = useState(0);
  const [formAnagraficaData, setFormAnagraficaData] = useState<AnagraficaData>(anagrafica);
  const [formTrattamentoEconomicoData, setFormTrattamentoEconomicoData] = useState<TrattamentoEconomicoData>(!newForm ? trattamentoEconomico : {});
  const [storicoTrattamentoData, setStoricoTrattamentoData] = useState<any>(row.trattamentoEconomicoArray || []);
  const [formRuoliData, setFormRuoliData] = useState<RuoliData>(ruoli);
  const [formPermessiData, setFormPermessiData] = useState<PermessiData>(permessi);
  const [localRoles, setLocalRoles] = useState<RoleOption[]>(roles);
  const [localCompanies, setLocalCompanies] = useState<companyOption[]>(companies);
  const [localGenders, setLocalGenders] = useState<genderOption[]>(genders);
  const [localActivity, setLocalActivity] = useState<ActivityTypeOption[]>([]);
  const [city, setCity] = useState<cityTypeOption[]>([]);
  const [dataAssunzione, setDataAssunzione] = useState(formTrattamentoEconomicoData.dataAssunzione)
  const [dataRecesso, setDataRecesso] = useState(formTrattamentoEconomicoData.dataRecesso)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNewContractModal, setShowNewContractModal] = useState(false);
  const [confirmNewContractStep, setConfirmNewContractStep] = useState(false);
  const [today, setToday] = useState<Date>(new Date());
  const [alert, setAlert] = useState<boolean>(false)
  const [isScadenzaEffettivaDisabled, setIsScadenzaEffettivaDisabled] = useState<boolean>(false);
  const [download, setDownload] = useState<boolean>(false)
  const [modifiedFields, setModifiedFields] = useState<Record<string, any>>({})
  const [newFormTrattamentoUpdate, setNewFormTrattamentoUpdate] = useState<boolean>(false)
  const [triggerUpdate, setTriggerUpdate] = useState(false);
  const [isrowDataReady, setIsrowDataReady] = useState(true);
  const [exstingFile, setExstingFile] = useState<any>()
  const [localSkills, setLocalSkills] = useState<MappedSkill[] | undefined>()
  //Ref
  const formAnagrafica = useRef<HTMLFormElement>(null);
  const formTrattamentoEconomico = useRef<HTMLFormElement>(null);
  const formRuoli = useRef<HTMLFormElement>(null);
  const formPermessi = useRef<HTMLFormElement>(null);



  const isFirstTreatment = isCreate || (storicoTrattamentoData.length === 0 && isObjectEffectivelyEmpty(formTrattamentoEconomicoData));
  const isFirstTreatmentUpdate = (storicoTrattamentoData.length === 0 && isUpdate)

  // const [fileJustUploaded, setFileJustUploaded] = useState<any>(null)
  //const [attachmentNameState, setAttachmentNameState] = useState(null) 

  const isViewOnly = !!dataRecesso;
  //UseEffect
  const handleFieldChange = (name: string, value: any) => {
    const currentValue = modifiedFields[name];
    /*if (name === "attachment") {
     if (value.create && Array.isArray(value.create) && value.create.length > 0) {
       const file = convertToFileObjectBlob(value.create[0]);
       if (file) {
         setFileJustUploaded(file);
       }
     } else {
       setFileJustUploaded(undefined);
     }
   } */
    if (currentValue !== value) {
      setModifiedFields((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  /*   useEffect(() => {
      const fetchCountryData = async () => {
        try {
          if (type === "edit" || type === "view") {
  
            const attachmentId = row?.anagrafica?.attachment_id?.[0]?.id;
  
            if (attachmentId) {
              const response = await CrudGenericService.getFilesByIds(attachmentId);
  
              const fetchedAttachment = response?.[0];
  
              if (fetchedAttachment) {
                const updatedAttachment = {
                  ...row.anagrafica.existingFile?.[0],
                  name: fetchedAttachment.file_name || "Name not found",
                };
  
                setExstingFile([updatedAttachment]);
                setAttachmentNameState(updatedAttachment.name);
                setDownload(true);
              } else {
                setAttachmentNameState(null);
                setDownload(false);
              }
            } else {
              setAttachmentNameState(null);
              setDownload(false);
            }
          }
          setIsrowDataReady(true);
        } catch (error) {
          console.error("Error fetching attachment data:", error);
        }
      };
  
      fetchCountryData();
    }, [row, type]); */




  useEffect(() => {

    if (formAnagrafica.current) {
      setFormAnagraficaData(formAnagrafica.current.values);
    }
    if (formTrattamentoEconomico.current) {
      if (!newForm) {
        setFormTrattamentoEconomicoData(formTrattamentoEconomico.current.values);
        if (formTrattamentoEconomico?.current?.values.tipologiaContratto_autocomplete?.name === "Tempo Indeterminato") {
          setIsScadenzaEffettivaDisabled(true);
        } else {
          setIsScadenzaEffettivaDisabled(false);
        }
      } else {
        formTrattamentoEconomico.current.values = {}
        formTrattamentoEconomico.current.values.dataInizioTrattamento = today
        formTrattamentoEconomico.current.values.dataAssunzione = dataAssunzione
        setFormTrattamentoEconomicoData(formTrattamentoEconomico.current.values)
      }
    }
    if (formRuoli.current) {
      setFormRuoliData(formRuoli.current.values);
    }
    if (formPermessi.current) {
      setFormPermessiData(formPermessi.current.values);

    }

  }, [selected, newForm, formTrattamentoEconomico?.current?.onchange]);
  useEffect(() => {
    setLocalRoles(roles);
    setLocalCompanies(companies);
    setLocalGenders(genders);
    setLocalActivity(activities)
    setLocalSkills(skills)
  }, [roles, companies, genders]);



  useEffect(() => {
    if (newForm) {
      setStoricoTrattamentoData([...storicoTrattamentoData, formTrattamentoEconomicoData]);
    }
  }, [newForm]);
  const handleSelect = (e: TabStripSelectEventArguments) => {
    setSelected(e.selected);
  };

  const handleSubmit = () => {
    let hasError = false;
    if (type === "create" || type === "edit") {
      if (newForm) {
        setAlert(true);
        setNewForm(false)
        setNewFormTrattamentoUpdate(true)
        return;
      }

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

    if (hasError) {
      NotificationProviderActions.openModal(
        { icon: true, style: "warning" },
        "Alcuni campi non sono validi. Controlla i campi obbligatori e riprova."
      );
    }
    setNewForm(false);
    const modifiedData = Object.keys(modifiedFields).reduce((result, key) => {
      if (modifiedFields[key] !== undefined) {
        result[key] = modifiedFields[key];
      }
      return result;
    }, {});

    const combinedData = {
      id: row.id,
      idRuoli: localRoles,
      idPermessi: localActivity,
      company: localCompanies,
      gender: localGenders,
      anagrafica: formAnagraficaData,
      trattamentoEconomico: formTrattamentoEconomicoData,
      ruoli: formRuoliData,
      permessi: formPermessiData,
      modifiedData: modifiedData,
      newFormTrattamentoEconomico: newFormTrattamentoUpdate,
      skills: localSkills || []
    };



    if (!hasError) {
      if (isCreate) {
        console.log("combineddatabeforeadapt", combinedData)
        const formattedData = reverseAdapter(combinedData);
        console.log("formattedData", formattedData);
        const idrow = row.id;
        onSubmit(type, formattedData, refreshTable, idrow,closeModalCallback);
        setNewFormTrattamentoUpdate(false)

      } else {
        const formattedData = reverseAdapterUpdate(combinedData);
        const idrow = row.id;
        onSubmit(type, formattedData, refreshTable, idrow,closeModalCallback);
        setNewFormTrattamentoUpdate(false)

      }
      if (type === 'delete') {
        onSubmit(type, {}, refreshTable, row.id, closeModalCallback);
      }
      
      if(type === 'view'){
        closeModalCallback();
      }

    }

  };


  const handleFileUpload = async () => {
    if (formAnagrafica.current && formAnagrafica.current.values.attachment && formAnagrafica.current.values.attachment.create && formAnagrafica.current.values.attachment.create.length) {

      const response = await CrudGenericService.getCVaI(formAnagrafica.current.values.attachment.create[0]);
      const skillsData = await CrudGenericService.getSkillAI(formAnagrafica.current.values.attachment.create[0]);

      const data = response.jsonData;
      const dataSKill = skillsData.jsonData.data.skills
      const seniority = skillsData.jsonData.data.seniority

      const updatedFormAnagraficaData = anagraficaAiButtonAdapter(data, formAnagraficaData, modifiedFields, localGenders, dataSKill, seniority);
      console.log("updatedFormAnagraficaData", updatedFormAnagraficaData)
      setFormAnagraficaData(updatedFormAnagraficaData);

      const newModifiedFields = {};
      Object.keys(updatedFormAnagraficaData).forEach(key => {
        if (updatedFormAnagraficaData[key] !== formAnagraficaData[key]) {
          newModifiedFields[key] = updatedFormAnagraficaData[key];
        }
      });

      setModifiedFields((prevState) => ({
        ...prevState,
        ...newModifiedFields
      }));
      setTriggerUpdate(true);
    }
  };

  useEffect(() => {
    if (triggerUpdate && formAnagrafica.current) {
      formAnagrafica.current.values = formAnagraficaData;
      setTriggerUpdate(false);
    }
  }, [formAnagraficaData, triggerUpdate]);




  const handleNewContract = () => {
    setShowNewContractModal(true);
    setConfirmNewContractStep(true);
  };

  const confirmNewContract = () => {
    setNewForm(true);
    setShowNewContractModal(false);
  };

  const closeNewContractModal = () => {
    setNewForm(false);
    setShowNewContractModal(false);
    setConfirmNewContractStep(false);
  };
  const confirmProceed = () => {

    setAlert(false);
    handleSubmit();
  };

  const cancelProceed = () => {
    setAlert(false);
    setNewForm(false);
  };

  //Gestione storico e display del componente storico trattamenti

  // Sorting the storicoTrattamentoData by scadenzaEffettiva date
  const sortedStoricoTrattamentoData = [...storicoTrattamentoData].sort((a: TrattamentoEconomicoData, b: TrattamentoEconomicoData) => {
    const dateA = a.scadenzaEffettiva ? new Date(a.scadenzaEffettiva) : new Date(0);
    const dateB = b.scadenzaEffettiva ? new Date(b.scadenzaEffettiva) : new Date(0);
    return dateA.getTime() - dateB.getTime();
  });

  const renderStoricoTrattamento = () => {
    const totalStorici = sortedStoricoTrattamentoData.length;

    return (
      <div>
        <div className={styles.header}>
          <h3>Storico Trattamenti Economici</h3>
          {totalStorici > 0 && (
            <span className={styles.totalStorici}>
              Totale storici: {currentIndex + 1}/{totalStorici}
            </span>
          )}
        </div>

        <div className={styles.container}>
          {totalStorici > 0 ? (
            <div className={styles.storicoItem}>
              <h4>Trattamento Economico {currentIndex + 1}</h4>
              <div className={styles.col}><strong>Tipologia Contratto:</strong> {sortedStoricoTrattamentoData[currentIndex].tipologiaContratto}</div>
              <div className={styles.col}><strong>Società:</strong> {sortedStoricoTrattamentoData[currentIndex].societa}</div>
              <div className={styles.col}><strong>Tipo Ambito Lavorativo:</strong> {sortedStoricoTrattamentoData[currentIndex].tipoAmbitoLavorativo}</div>
              <div className={styles.col}><strong>Data Inizio Trattamento:</strong> {sortedStoricoTrattamentoData[currentIndex].dataInizioTrattamento ? new Date(sortedStoricoTrattamentoData[currentIndex].dataInizioTrattamento).toLocaleDateString() : 'N/A'}</div>
              <div className={styles.col}><strong>Costo Giornaliero:</strong> {sortedStoricoTrattamentoData[currentIndex].costoGiornaliero}</div>
              <div className={styles.col}><strong>Data Assunzione:</strong> {sortedStoricoTrattamentoData[currentIndex].dataAssunzione ? new Date(sortedStoricoTrattamentoData[currentIndex].dataAssunzione).toLocaleDateString() : 'N/A'}</div>
              <div className={styles.col}><strong>Scadenza Effettiva:</strong> {sortedStoricoTrattamentoData[currentIndex].scadenzaEffettiva ? new Date(sortedStoricoTrattamentoData[currentIndex].scadenzaEffettiva).toLocaleDateString() : 'N/A'}</div>
              <div className={styles.col}><strong>Data Recesso:</strong> {sortedStoricoTrattamentoData[currentIndex].dataRecesso ? new Date(sortedStoricoTrattamentoData[currentIndex].dataRecesso).toLocaleDateString() : 'N/A'}</div>
              <div className={styles.col}><strong>Motivazione Cessazione:</strong> {sortedStoricoTrattamentoData[currentIndex].motivazioneCessazione}</div>
              <div className={styles.col}><strong>Trasformazioni:</strong> {sortedStoricoTrattamentoData[currentIndex].trasformazioni}</div>
              <div className={styles.col}><strong>CCNL:</strong> {sortedStoricoTrattamentoData[currentIndex].ccnl}</div>
              <div className={styles.col}><strong>RAL:</strong> {sortedStoricoTrattamentoData[currentIndex].ral}</div>
              <div className={styles.col}><strong>Trasferta:</strong> {sortedStoricoTrattamentoData[currentIndex].trasferta}</div>
              <div className={styles.col}><strong>Buoni Pasto:</strong> {sortedStoricoTrattamentoData[currentIndex].buoniPasto}</div>
              <div className={styles.col}><strong>Netto Mese:</strong> {sortedStoricoTrattamentoData[currentIndex].nettoMese}</div>
              <div className={styles.col}><strong>Costo Annuale:</strong> {sortedStoricoTrattamentoData[currentIndex].costoAnnuale}</div>
              <div className={styles.col}><strong>Tariffa Vendita:</strong> {sortedStoricoTrattamentoData[currentIndex].tariffaVendita}</div>
              <div className={styles.col}><strong>Note:</strong> {sortedStoricoTrattamentoData[currentIndex].note}</div>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <h5>Nessun Trattamento Economico Precedente</h5>
            </div>
          )}
        </div>
        {totalStorici > 1 && (
          <div className={styles.navigationButtons}>
            <Button onClick={handlePrevious} disabled={currentIndex === 0}>Indietro</Button>
            <Button className={styles.buttonAvanti} onClick={handleNext} disabled={currentIndex === totalStorici - 1}>Avanti</Button>
          </div>
        )}
      </div>
    );
  };

  const handleContractTypeChange = (name, value) => {
    if (value && value.name === "Tempo Indeterminato") {
      setIsScadenzaEffettivaDisabled(true);
    } else {
      setIsScadenzaEffettivaDisabled(false);
    }
  };

  const handleDownloadChange = (name, files) => {
    if (files === undefined || files.length === 0) {
      setDownload(false);
      /* if (formAnagrafica.current) {
        setAttachmentNameState(formAnagrafica.current.values.attachment.name)
      } */
    } else {
      //const attachmentName = files[0].name;
      //setAttachmentNameState(attachmentName);
      setDownload(false)
    }
  };

  const scadenzaEffettivaValidator = useMemo(() => {
    return (value: any, valueGetter: (name: string) => any) => {
        if (!value) return "";
        const selectedDate = new Date(value);
        const noparseHireDate = valueGetter("dataAssunzione");
        const hireDate= noparseHireDate ? new Date(noparseHireDate): null;
        const noparsestartDate= valueGetter("dataInizioTrattamento")
        const startDate = noparsestartDate ? new Date(noparsestartDate): null;

        if (hireDate && selectedDate <= hireDate) {
            return "La Scadenza Effettiva non può essere lo stesso giorno o prima della Data di Assunzione";
        }
        if (startDate && selectedDate <= startDate) {
            return "La Scadenza Effettiva non può essere lo stesso giorno o prima della Data di Inizio del Trattamento";
        }

        return "";
    };
}, []);

const dataAssunzioneValidator = useMemo(() => {
  return (value: any, valueGetter: (name: string) => any) => {
        if (!value) return "";
        const inizioTrattamento= valueGetter("dataInizioTrattamento")
        if (formTrattamentoEconomicoData?.dataInizioTrattamento ||inizioTrattamento ) {
            const assunzioneDate = new Date(value);
            const inizioTrattamentoDate = new Date(inizioTrattamento);

            if (assunzioneDate.getTime() !== inizioTrattamentoDate.getTime()) {
                return "Per il primo trattamento, la Data di Assunzione deve essere uguale alla Data di Inizio del Trattamento";
            }
        }
        return "";
    };
}, [formTrattamentoEconomicoData?.dataInizioTrattamento]);
const dataInizioTrattamentoValidator = useMemo(() => {
  return (value: any, valueGetter: (name: string) => any) =>  {
      if (!value) {
          return "Il campo Data Inizio Trattamento è obbligatorio";
      }

      const selectedDate = new Date(value);
      const noparseHireDate = valueGetter("dataAssunzione");
      const hireDate= noparseHireDate ? new Date(noparseHireDate): null;
      if (isFirstTreatment || isFirstTreatmentUpdate) {
          if (hireDate && selectedDate.getTime() !== hireDate.getTime()) {
              return "Per il primo trattamento, la Data di Inizio del Trattamento deve essere uguale alla Data di Assunzione";
          }
      } else {
          if (hireDate && selectedDate < hireDate) {
              return "La Data di Inizio del Trattamento non può essere precedente alla Data di Assunzione";
          }
      }

      return "";
  };
}, [ isFirstTreatment, isFirstTreatmentUpdate]);

  const isNewTreatmentButtonDisabled = () => {
    // Controlla se il formTrattamentoEconomicoData è vuoto o se contiene solo la data
    const onlyHasDate =
      Object.keys(formTrattamentoEconomicoData).length === 1 && formTrattamentoEconomicoData.dataInizioTrattamento;

    return (
      !formTrattamentoEconomicoData ||
      Object.keys(formTrattamentoEconomicoData).length === 0 ||
      onlyHasDate || newForm || isViewOnly ||
      !formTrattamentoEconomicoData.dataInizioTrattamento
    );
  };


  const handleNext = () => {
    if (currentIndex < sortedStoricoTrattamentoData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Definisce la classe CSS dinamica in base alla presenza di storici
  const trattamentoEconomicoClass = sortedStoricoTrattamentoData.length > 0 ? styles.trattamentoEconomicoConStorici : styles.trattamentoEconomicoSenzaStorici;
  const combinedValueOnChange = (name: string, value: any) => {

    handleDownloadChange(name, value);


    handleFieldChange(name, value);
  };

  const combinedValueOnChangeContractType = (name: string, value: any) => {
    handleContractTypeChange(name, value);

    handleFieldChange(name, value);
  };

  if (!isrowDataReady || ((type !== 'create' && type !== "delete") && !isrowDataReady)) {
    return <div className={styles.loader}><LoaderComponent type="pulsing"></LoaderComponent></div>;
  }

  if (type === 'delete') {
    return (

      <div className={styles.formDelete}>
        <span>{"Sei sicuro di voler eliminare il record?"}</span>

        <div >
          <Button onClick={() => closeModalCallback()}>Cancel</Button>
          <Button themeColor={"error"} onClick={handleSubmit}>
            Elimina
          </Button>
        </div>
      </div>

    )
  }

  const tabs = [
    {
      title: isViewOnly ? "Dati personali Archiviati" : "Anagrafica",
      children: (
        <div className={styles.parentForm}>
          <Form
            ref={formAnagrafica}
            fields={Object.values(getFormAnagraficaFields(formAnagraficaData, localGenders, type, isViewOnly, handleFieldChange, handleFileUpload))}
            formData={formAnagraficaData}
            onSubmit={(data: AnagraficaData) => setFormAnagraficaData(data)}
            description="Ana"
            addedFields={formFields}
            disabled={isViewOnly}
          />


        </div>
      ),
    },
    {
      title: isViewOnly ? "Trattamento economico Archiviato" : "Trattamento Economico",
      children: (
        <>
          <div className={` ${trattamentoEconomicoClass}`}>
            <Form
              ref={formTrattamentoEconomico}
              fields={Object.values(getFormTrattamentoEconomicoFields(formTrattamentoEconomicoData, localCompanies, type, isFirstTreatment, newForm, combinedValueOnChangeContractType, isScadenzaEffettivaDisabled, isFirstTreatmentUpdate, isViewOnly, handleFieldChange,scadenzaEffettivaValidator,dataAssunzioneValidator,dataInizioTrattamentoValidator))}
              formData={formTrattamentoEconomicoData}
              onSubmit={(data: TrattamentoEconomicoData) => setFormTrattamentoEconomicoData(data)}
              description={isViewOnly ? "Trattamento dipendente" : "TE"}
              addedFields={formFields}
            />
          </div>
          {(type === "edit" || type === "view") && ((
            <>
              <div className={styles.buttonTrattamento}>
                <Button disabled={isNewTreatmentButtonDisabled() || type === "view"} onClick={handleNewContract}>Nuovo Trattamento</Button>
              </div>
              <div className={styles.listBoxContainer}>
                {renderStoricoTrattamento()}
              </div>

            </>
          ))}
        </>
      ),
    },
    {
      title: isViewOnly ? "Ruoli Archiviati" : "Assegna Profilo",
      children: (
        <div className={styles.checkboxContainer}>
          <Form
            ref={formRuoli}
            fields={Object.values(getFormRuoliFields(formRuoliData, roles, type, isViewOnly, handleFieldChange))}
            formData={formRuoliData}
            onSubmit={(data: RuoliData) => setFormRuoliData(data)}
            description="PR"
          />
        </div>
      ),
    },
    {
      title: isViewOnly ? "Ferie e Permessi Archiviati" : "Assegna Tipologia Ferie e Permessi",
      children: (
        <div className={styles.checkboxContainer}>
          <Form
            ref={formPermessi}
            fields={Object.values(getFormPermessiFields(formPermessiData, localActivity, type, isViewOnly, handleFieldChange))}
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
                Se procedi con l'aggiunta di un nuovo trattamento, il trattamento corrente verrà interrotto al giorno precedente alla nuova data di inizio trattamento. Per rendere effettiva la sostituzione premi il tasto salva. Vuoi procedere?
              </p>
              <div className={styles.buttonContainer}>
                <Button className={styles.cancelButton} onClick={closeNewContractModal}>
                  No
                </Button>
                <Button className={styles.confirmButton} onClick={confirmNewContract}>
                  Salva
                </Button>
              </div>
            </>
          ) : null}
        </Window>
      )}
      {alert && (
        <Window
          show={alert}
          title="Conferma Nuovo Trattamento"
          onClose={cancelProceed}
          callToAction="Procedi"
          draggable
          resizable
          initialHeight={200}
          initialWidth={400}
        >
          <p>
            Se procedi, il trattamento corrente sarà sostituito con il nuovo
            trattamento. Vuoi procedere?
          </p>
          <div className={styles.buttonContainer}>
            <Button className={styles.cancelButton} onClick={cancelProceed}>
              Annulla
            </Button>
            <Button className={styles.confirmButton} onClick={confirmProceed}>
              Procedi
            </Button>
          </div>
        </Window>
      )}
    </div>
  );
};

export default PersonaleSection;
