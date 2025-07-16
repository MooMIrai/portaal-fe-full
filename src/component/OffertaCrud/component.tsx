import React, { PropsWithRef, useEffect, useMemo, useRef, useState } from "react";
import { OfferModel, Projects } from "./model";
import Button from 'common/Button';
import Form from "common/Form";
import Tab from "common/Tab";
import NotificationActions from 'common/providers/NotificationProvider'


import { getFormCommesseFields, getFormOfferFields } from "./form";
import { offertaCustomFields } from "./customfields";
import { fromOfferModelToOfferBEModel, locationOption, reverseOfferAdapterUpdate, sedeAdapter } from "../../adapters/offertaAdapters";
import { offertaService } from "../../services/offertaService";
import LoaderComponent from "common/Loader"
import Window from "common/Window";


import styles from "./style.module.scss";

type OffertaCrudProps = {
  row: OfferModel;
  type: string;
  closeModalCallback: () => void;
  refreshTable: () => void;
  onSubmit: (type: string, formData: any, refreshTable: () => void, id: any, closeModal: () => void) => void;
};

export function OffertaCrud(props: PropsWithRef<OffertaCrudProps>) {

  const formCustomer = useRef<any>();
  const formCommessa = useRef<any>();
  const [selected, setSelected] = useState(0);
  const [formCustomerData, setformCustomerData] = useState<OfferModel>(props.row);
  const [formProjectData, setformProjectData] = useState<Projects>();
  const [download, setDownload] = useState<boolean>(false)
  const [modifiedFields, setModifiedFields] = useState<Record<string, any>>({})
  const [attachmentNameState, setAttachmentNameState] = useState<string | null>(null)
  const [sede, setSede] = useState<locationOption[]>([]);
  const [isLocationDataReady, setIsLocationDataReady] = useState(false);
  const [isrowLocationDataReady, setIsrowLocationDataReady] = useState(false);
  const [isDaily, setIsDaily] = useState<boolean>(false)
  const [isLumpSum, setIsLumpSum] = useState(false)
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [rowLocation, setRowLocation] = useState<{ id: number, name: string }>({ id: 0, name: '' });

  const [customerForProtocol,setCustomerForProtocol] = useState<string>();

  useEffect(() => {
    const fetchCountryData = async () => {

      try {
        const sedeResponse = await offertaService.fetchResources("location");
        const adaptedLocation = sedeAdapter(sedeResponse);
        setSede(adaptedLocation);

        /*   if (props.row?.existingFile && Array.isArray(props.row.existingFile) && props.row.existingFile.length > 0) {
  
            const uniqueIdentifiers = props.row.existingFile
              .map((attachment: { id?: string }) => attachment.id)
              .join(',');
  
            if (uniqueIdentifiers) {
  
              const response = await offertaService.getFilesByIds(uniqueIdentifiers);
  
              const fetchedAttachments = response.map((file: { uniqueIdentifier: string, file_name: string }) => ({
                id: file.uniqueIdentifier,
                name: file.file_name
              }));
              const updatedAttachments = props.row.existingFile?.map((attachment) => {
                const fetchedAttachment = fetchedAttachments.find(
                  (f) => f.id === attachment.id
                );
                return {
                  ...attachment,
                  name: fetchedAttachment ? fetchedAttachment.name : "Name not found",
                };
              });
  
              props.row.existingFile = updatedAttachments
              console.log("Updated Attachments Array:", updatedAttachments);
            }
            if (props.type === "edit" || props.type === "view") {
              if (Array.isArray(props.row.existingFile) && props.row.existingFile.length > 0) {
                // Extract all attachment names
                const attachmentNames = props.row.existingFile
                  .map((attachment) => attachment.name || null)
                  .filter(Boolean);
  
                if (attachmentNames.length > 0) {
                  setAttachmentNameState(attachmentNames[0]);
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
          } */
        setIsLocationDataReady(true);
      } catch (error) {
        console.error("Error fetching country data:", error);
      }
    };

    fetchCountryData();
  }, [props.row, props.type]);


  useEffect(() => {
    if (isLocationDataReady && (props.type === "edit" || props.type === "view")) {
      const locationLabel = getLocationLabel(sede, props.row.location_id);
      if (locationLabel) {
        setRowLocation({ id: props.row.location_id, name: locationLabel });
      }
      setIsrowLocationDataReady(true);
    }
  }, [sede, props.row.location_id, isLocationDataReady, props.type]);

 useEffect(() => {
    if (props.type === "edit" && isrowLocationDataReady) {
      if (
        formCustomerData.project_type?.name === "Consulenza" &&
        formCustomerData.billing_type?.name === "Fatturazione a giornata"
      ) {
        setIsDaily(true);
      } else {
        setIsDaily(false);
      }
    }
  }, [props.type, isrowLocationDataReady]);

  useEffect(()=>{
    if(formCustomerData && formCustomerData.customer){
      handleChangeCustomerProtocol(formCustomerData.customer)
    }
  },[formCustomerData]);

  const handleChangeCustomerProtocol = (customer:any)=>setCustomerForProtocol(customer);
  

  const openNewTaskModal = () => {
    setShowNewTaskModal(true);
  };

  const handleSelect = (e: any) => {
    setSelected(e.selected);
  };

  const handleDownload = async (fileId: string, fileName: string) => {
    return {
      fileId: fileId,
      fileName: fileName
    }

  };

 
  const valueOnChange = (name: string, value: any) => {

    if (name === "project_type") {

      if (value?.name === "Consulenza") {

        const updatedBillingType = { id: "Daily", name: "Fatturazione a giornata" };
        formCustomer.current.values.billing_type = updatedBillingType;
        setIsDaily(true);

        if (props.type === "edit") {
          setModifiedFields((prevState) => ({
            ...prevState,
            billing_type: updatedBillingType,
          }));
        }

      }
      
    }
    
    if (name === "billing_type") {
      if (value?.name === "Fatturazione a corpo") setIsLumpSum(true);
      else setIsLumpSum(false);
    }

    const currentValue = modifiedFields[name];

    if (currentValue !== value) {

      setModifiedFields((prevState) => ({
        ...prevState,
        [name]: value,
      }));

      if (props.type === "edit") {
        if (name === "location") {
          setRowLocation(value);
        }
      }

    }

    if(name==='customer') handleChangeCustomerProtocol(value);

  };


  const getLocationLabel = (sedi: locationOption[], location_id: number) => {
    return Array.isArray(sedi) ? (sedi.find((sede) => sede.value === location_id)?.label || " ") : " ";
  };

  const valueOnChangeByllingType = (name: string, value: any) => {
    if (value?.name === "Fatturazione a giornata") {

      setIsDaily(true)
    } else {
      setIsDaily(false)
    }
  };

  const combinedValueOnChangeBillyngType = (name: string, value: any) => {
    valueOnChangeByllingType(name, value)

    valueOnChange(name, value)

  };


  const handleDownloadChange = (name, files) => {
    if (files === undefined || files.length === 0) {
      setDownload(false);
    } else {
      const attachmentName = files[0].name;
      setAttachmentNameState(attachmentName);
      setDownload(false)
    }
  };

  const combinedValueOnChange = (name: string, value: any) => {

    handleDownloadChange(name, value);
    valueOnChange(name, value)
  };

  const handleCommessaSubmit = () => {
    let hasError = false;

    if (props.type === "create" || props.type === "edit") {

      if (formCommessa.current) {

        formCommessa.current.onSubmit();

        if (!formCommessa.current.isValid()) {
          hasError = true;
        }
      }


      if (!hasError) {
        let combinedData;
        combinedData = {
          ...modifiedFields,
          ...formCustomerData,
          ...formCommessa.current.values,
        };


        setformCustomerData(combinedData);


        saveOfferData(combinedData);


        setShowNewTaskModal(false);
      }
    }
  };


  const handleSubmit = () => {
    let hasError = false;

    if (props.type === "create" || props.type === "edit") {
      if (formCustomer.current) {
        formCustomer.current.onSubmit();
        if (formCustomer.current.isValid()) {
          setformCustomerData(formCustomer.current.values);

        } else {
          hasError = true;
        }
      }

      if (!hasError) {
        const outcomeType = formCustomer.current.values.outcome_type.name;
        if (outcomeType === "Positivo" && !formCustomerData.thereisProject) {
          NotificationActions.openConfirm(
            "Salvando i dati con esito positivo, è necessario creare una nuova commessa. Vuoi procedere?",
            () => {
              handlePositiveOutcome();
            },
            "Conferma Salvataggio"
          );
        } else {
          saveOfferData(formCustomer.current.values);
        }
      }
    }

    if (props.type === 'delete') {
      props.onSubmit(props.type, {}, props.refreshTable, props.row.id, props.closeModalCallback);
    }
    if(props.type === 'view'){
      props.closeModalCallback();
    }
  };
  const startValidator = useMemo(() => {
    return (value: any, valueGetter: (name: string) => any) => {
        if (!value) {
            return "Seleziona una data";
        }

        const selectedDate = new Date(value);
        const endDate = valueGetter("end_dateP");
        const parsedEndDate = endDate ? new Date(endDate) : null;

        if (parsedEndDate && selectedDate >= parsedEndDate) {
            return "La data di inizio deve essere anteriore alla data di fine";
        }
        return "";
    };
}, []);

const endValidator = useMemo(() => {
    return (value: any, valueGetter: (name: string) => any) => {
        if (!value) {
            return "";
        }

        const selectedDate = new Date(value);
        const startDate = valueGetter("start_date");
        const parsedStartDate = startDate ? new Date(startDate) : null;

        if (parsedStartDate && selectedDate <= parsedStartDate) {
            return "La data di fine deve essere posteriore alla data di inizio";
        }
        return "";
    };
}, []);
const endDateValidator = useMemo(() => {
  return (value: any, valueGetter: (name: string) => any) => {
      if (!value) return "";

      const selectedEndDate = new Date(value);
      const approvalDateValue = valueGetter("approval_date");
      const approvalDate = approvalDateValue ? new Date(approvalDateValue) : null;

  
      if (approvalDate && selectedEndDate <= approvalDate) {
        return "La data di scadenza non può essere uguale o precedente alla data di approvazione";
    }

    return "";
  };
}, []); 
const approvalDateValidator = useMemo(() => {
  return (value: any, valueGetter: (name: string) => any) => {

    if(formCustomer.current && formCustomer.current.values.outcome_type && formCustomer.current.values.outcome_type.id==='P'){
     

      if (!value) return "La data di approvazione è obbligatoria";

      const selectedApprovalDate = new Date(value);
      const endDateValue = valueGetter("end_date");
      const endDate = endDateValue ? new Date(endDateValue) : null;

      if (endDate && selectedApprovalDate >= endDate) {
          return "La data di approvazione non può essere uguale o successiva alla data di scadenza";
      }
    }

      return "";
  };
}, [formCustomer.current]); 


  /*   const saveOfferData = (dataToSave) => {
      const baseData = dataToSave ? dataToSave : formCustomerData;
  
      if (props.type === "edit") {
        const modifiedData = Object.keys(modifiedFields).reduce((result, key) => {
          if (modifiedFields[key] !== undefined) {
            result[key] = modifiedFields[key];
          }
          return result;
        }, {});
        
        const formattedData = reverseOfferAdapterUpdate(modifiedData, baseData);
        
        props.onSubmit(props.type, formattedData, props.refreshTable, props.row.id, props.closeModalCallback);
  
      } else {
        const formattedData = fromOfferModelToOfferBEModel({ ...baseData });
        props.onSubmit(props.type, formattedData, props.refreshTable, props.row.id, props.closeModalCallback);
      }
    };
   */

  const saveOfferData = (dataToSave) => {
    const baseData = dataToSave ? dataToSave : formCustomerData;
    const formattedData = fromOfferModelToOfferBEModel({ ...baseData });
    props.onSubmit(props.type, formattedData, props.refreshTable, props.row.id, props.closeModalCallback);

  };


  const handlePositiveOutcome = () => {
    openNewTaskModal();
  };

  if (!isLocationDataReady || ((props.type !== 'create' && props.type !== "delete") && !isrowLocationDataReady)) {
    return <div className={styles.loader}><LoaderComponent type="pulsing"></LoaderComponent></div>;
  }



  if (props.type === 'delete') {
    return (

      <div className={styles.formDelete}>
        <span>{"Sei sicuro di voler eliminare il record?"}</span>

        <div >
          <Button onClick={() => props.closeModalCallback()}>Cancel</Button>
          <Button themeColor={"error"} onClick={handleSubmit}>
            Elimina
          </Button>
        </div>
      </div>

    )
  }

  return <>
    <Tab
      tabs={[
        {
          title: "Dati Offerta",
          children: (
            <div className={styles.parentForm}>

              <Form
                ref={formCustomer}
                fields={Object.values(getFormOfferFields(
                  formCustomerData,
                  props.type,
                  handleDownload,
                  combinedValueOnChange,
                  download,
                  attachmentNameState,
                  rowLocation,
                  valueOnChange,
                  isDaily,
                  isLumpSum,
                  combinedValueOnChangeBillyngType,
                  customerForProtocol,
                  endDateValidator,
                  approvalDateValidator
                ))}
                formData={formCustomerData}
                onSubmit={(data: OfferModel) => setformCustomerData(data)}
                addedFields={offertaCustomFields}
              />
            </div>
          ),
        }
      ]}
      onSelect={handleSelect}
      selected={selected}
      button={{ label: props.type === 'view' ? "Esci" : "Salva", onClick: handleSubmit }}
    />

    {/* Modale per la nuova commessa */}
    {showNewTaskModal && (
      <Window
        show={showNewTaskModal}
        title="Nuova Commessa"
        onClose={() => setShowNewTaskModal(false)}
        callToAction="Salva"
        draggable
        resizable
        initialHeight={550}
        initialWidth={800}>
        <div>
          <div className={styles.parentForm}>
            <Form
              ref={formCommessa}
              formData={formProjectData}
              fields={Object.values(getFormCommesseFields(formProjectData, valueOnChange,startValidator,endValidator))}
              onSubmit={(data: Projects) => setformProjectData(data)}
            />
          </div>
          <div className={styles.buttons}>
            <Button onClick={() => setShowNewTaskModal(false)}>
              Annulla
            </Button>
            <Button themeColor={"primary"} onClick={handleCommessaSubmit}>
              Salva
            </Button>
          </div>
        </div>
      </Window>
    )}
  </>
}