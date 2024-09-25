import { PropsWithRef, useEffect, useRef, useState } from "react";
import { OfferModel, Projects } from "./model";
import Button from 'common/Button';
import Form from "common/Form";
import Tab from "common/Tab";
import React from "react";
import NotificationActions from 'common/providers/NotificationProvider'

import styles from "./style.module.scss";
import { getFormCommesseFields, getFormOfferFields } from "./form";
import { offertaCustomFields } from "./customfields";
import { fromOfferModelToOfferBEModel, locationOption, reverseOfferAdapterUpdate, sedeAdapter } from "../../adapters/offertaAdapters";
import { offertaService } from "../../services/offertaService";
import LoaderComponent from "common/Loader"
import Window from "common/Window";


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
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
 const [rowLocation,setrowLocation]=useState<{id:number,name:string}>({ id: 0, name: '' }); 

  useEffect(() => {
    const fetchCountryData = async () => {

      try {
        const sedeResponse = await offertaService.fetchResources("location");
        const adaptedLocation = sedeAdapter(sedeResponse);
        setSede(adaptedLocation);

    
        setIsLocationDataReady(true);
      } catch (error) {
        console.error("Error fetching country data:", error);
      }
    };

    fetchCountryData();
  }, []);

  useEffect(() => {
    if (props.type === "edit" || props.type === "view") {
      const attachmentName = props.row.attachment && props.row.attachment.length > 0
        ? props.row.attachment[0].name
        : null;

      setAttachmentNameState(attachmentName);
      setDownload(!!attachmentName);
    }
  }, [props.row, props.type]);


  useEffect(() => {
    if (isLocationDataReady && (props.type === "edit" || props.type === "view")) {
      const locationLabel = getLocationLabel(sede, props.row.location_id);
      if (locationLabel) {
        setrowLocation({ id: props.row.location_id, name: locationLabel });
      }
      setIsrowLocationDataReady(true);
    } 
  }, [sede, props.row.location_id, isLocationDataReady, props.type]);
  
  

  const openNewTaskModal = () => {
    setShowNewTaskModal(true);
  };

  const handleSelect = (e: any) => {
    setSelected(e.selected);
  };
  const handleDownload = async () => {
    try {
      if (props.row.attachment_id) {
        const blob = await offertaService.getCV(props.row.attachment_id);
        const fileUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = fileUrl;
        if (props.row?.existingFile?.name) {
          link.download = props.row?.existingFile?.name
        } else {
          link.download = "Documento Scaricato"
        }

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(fileUrl);
      }

    } catch (error) {
      console.error('Errore durante il download del file:', error);
    }
  };
  const valueOnChange = (name: string, value: any) => {
    if (props.type === "edit") {
      const currentValue = modifiedFields[name];
      if (currentValue !== value) {
        setModifiedFields((prevState) => ({
          ...prevState,
          [name]: value,
        }));

        if (name === "location") {
          setrowLocation(value);
        }
      }
    }
  };

  
  
  const getLocationLabel = (sedi: locationOption[], location_id: number) => {
    return Array.isArray(sedi) ? (sedi.find((sede) => sede.value === location_id)?.label || " ") : " ";
  };
  

  const valueOnChangeByllingType = (name: string, value: any) => {
    if (value.name === "Fatturazione a giornata") {
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

        if (props.type === "edit") {
          combinedData = {
            ...modifiedFields,
            ...formCommessa.current.values,
          };
        } else {
          combinedData = {
            ...formCustomerData,
            ...formCommessa.current.values,
          };
        }

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
        if (outcomeType === "Positivo") {
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
  };


  const saveOfferData = (dataToSave) => {
    const baseData = dataToSave ? dataToSave : formCustomerData;

    if (props.type === "edit") {
      const modifiedData = Object.keys(modifiedFields).reduce((result, key) => {
        if (modifiedFields[key] !== undefined) {
          result[key] = modifiedFields[key];
        }
        return result;
      }, {});
      const formattedData = reverseOfferAdapterUpdate({ ...modifiedData });
      props.onSubmit(props.type, formattedData, props.refreshTable, props.row.id, props.closeModalCallback);

    } else {
      const formattedData = fromOfferModelToOfferBEModel({ ...baseData });
      props.onSubmit(props.type, formattedData, props.refreshTable, props.row.id, props.closeModalCallback);
    }
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
                  combinedValueOnChangeBillyngType
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
              fields={Object.values(getFormCommesseFields(formProjectData, valueOnChange))}
              onSubmit={(data: Projects) => setformProjectData(data)}
            />
          </div>
          <div className={styles.buttons}>
          <Button  onClick={() => setShowNewTaskModal(false)}>
            Annulla
          </Button>
          <Button  themeColor={"primary"}  onClick={handleCommessaSubmit}>
            Salva
          </Button>
          </div>
        </div>
      </Window>
    )}
  </>
}