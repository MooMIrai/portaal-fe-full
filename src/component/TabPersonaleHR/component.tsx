import React, { useState, useEffect, useRef } from "react";
import Tab from "common/Tab";
import { TabStripSelectEventArguments } from "@progress/kendo-react-layout";
import Form from "common/Form";
import styles from "./style.module.scss";
import {
  getFormAnagraficaFields,
  getFormTrattamentoEconomicoFields,
  getFormRuoliFields,
  getFormPermessiFields,
} from "./FormFields";
import { AnagraficaData, TrattamentoEconomicoData, RuoliData, PermessiData } from "./modelForms";
import { FORM_TYPE } from "../../pages/Personale/formModel";
import { ActivityTypeOption, companyAdapter, companyOption, contractTypeAdapter, contractTypeOption, dataAdapter, permessiAdapter, reverseAdapter, roleAdapter, RoleOption, wokeScopeAdapter, WokeScopeOption } from "../../adapters/personaleAdapters";
import { CrudGenericService } from "../../services/personaleServices";
type PersonaleSectionProps = {
  row: Record<string, any>;
  type: FORM_TYPE;
  closeModalCallback: () => void;
  refreshTable: () => void;
  onSubmit: (type: FORM_TYPE, formData: any, refreshTable: () => void, id: any) => void;
};

const PersonaleSection: React.FC<PersonaleSectionProps> = ({ row, type, closeModalCallback, refreshTable, onSubmit }) => {
  const isCreate = type === FORM_TYPE.create;
  const { anagrafica, trattamentoEconomico, ruoli, permessi } = isCreate ? {
    anagrafica: {},
    trattamentoEconomico: {},
    ruoli: {},
    permessi: {},
  } : dataAdapter(row);
  const [selected, setSelected] = useState(0);
  const [formAnagraficaData, setFormAnagraficaData] = useState<AnagraficaData>(anagrafica);
  const [formTrattamentoEconomicoData, setFormTrattamentoEconomicoData] = useState<TrattamentoEconomicoData>(trattamentoEconomico);
  const [formRuoliData, setFormRuoliData] = useState<RuoliData>(ruoli);
  const [formPermessiData, setFormPermessiData] = useState<PermessiData>(permessi);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [wokeScope, setWokeScope] = useState<WokeScopeOption[]>([])
  const [company,setCompany]=useState<companyOption[]>([])
  const [contractType, setContractType] = useState<contractTypeOption[]>([])
  const [activity,setActivity]= useState<ActivityTypeOption[]>([])
  const formAnagrafica = useRef<HTMLFormElement>(null);
  const formTrattamentoEconomico = useRef<HTMLFormElement>(null);
  const formRuoli = useRef<HTMLFormElement>(null);
  const formPermessi = useRef<HTMLFormElement>(null);
  const handleSelect = (e: TabStripSelectEventArguments) => {
    setSelected(e.selected);
  };

  const handleSubmit = () => {
    let hasError = false;

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

    const combinedData = {
      id: row.id,
      idRuoli: roles,
      wokescope: wokeScope,
      contractType: contractType,
      company: company,
      anagrafica: { ...formAnagraficaData },
      trattamentoEconomico: formTrattamentoEconomicoData,
      ruoli: formRuoliData,
      permessi: formPermessiData,
    };

    console.log("Combined Data:", combinedData);

    if (!hasError) {
      const formattedData = reverseAdapter(combinedData);
      console.log("formattedData", formattedData)
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
      setFormTrattamentoEconomicoData(formTrattamentoEconomico.current.values);
    }
    if (formRuoli.current) {
      setFormRuoliData(formRuoli.current.values);
    }
    if (formPermessi.current) {
      setFormPermessiData(formPermessi.current.values);
    }
  }, [selected]);

  useEffect(() => {
    //serve per la creazione del form dei ruoli (label e value è l'id)
    const fetchRoles = async () => {
      try {
        const response = await CrudGenericService.fetchResources("role");
        const adaptedRoles = roleAdapter(response);
        setRoles(adaptedRoles);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    //serve per la creazione del form dei ruoli (label e value è l'id)
    const fetchWorkScope = async () => {
      try {
        const response = await CrudGenericService.fetchResources("WorkScope");
        console.log("resworkscope", response);
        const adaptedWokeScope = wokeScopeAdapter(response);
        setWokeScope(adaptedWokeScope)
        console.log("wokescope", adaptedWokeScope)
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchWorkScope();
  }, []);

  useEffect(() => {
    //serve per la creazione del form dei ruoli (label e value è l'id)
    const fetchGender = async () => {
      try {
        const response = await CrudGenericService.fetchResources("Gender");
        console.log("Gender", response);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchGender();
  }, []);

  useEffect(() => {
    //serve per la creazione del form dei ruoli (label e value è l'id)
    const fetchContractType = async () => {
      try {
        const response = await CrudGenericService.fetchResources("ContractType");
        console.log("ContractType", response);
        const adaptedContractType = contractTypeAdapter(response)
        setContractType(adaptedContractType)
        console.log(adaptedContractType)
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchContractType();
  }, []);

  useEffect(() => {
    //serve per la creazione del form dei ruoli (label e value è l'id)
    const fetchContractType = async () => {
      try {
        const response = await CrudGenericService.fetchResources("Company");
        console.log("Company", response);
        const adaptedCompany= companyAdapter(response)
        setCompany(adaptedCompany)
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchContractType();
  }, []);

  useEffect(() => {
    //serve per la creazione del form dei ruoli (label e value è l'id)
    const fetchContractType = async () => {
      try {
        const response = await CrudGenericService.fetchResources("ActivityType");
        console.log("ActivityType", response);
        const adaptedActivities= permessiAdapter(response)
        setActivity(adaptedActivities)
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchContractType();
  }, []);


  const tabs = [
    {
      title: "Anagrafica",
      children: (
        <div className={styles.parentForm}>
          <Form
            ref={formAnagrafica}
            fields={Object.values(getFormAnagraficaFields(formAnagraficaData))}
            formData={formAnagraficaData}
            onSubmit={(data: AnagraficaData) => setFormAnagraficaData(data)}
            description="Ana"
          />
        </div>
      ),
    },
  ];

  if (type === FORM_TYPE.edit || type === FORM_TYPE.create || type === FORM_TYPE.view) {
    tabs.push(
      {
        title: "Trattamento Economico",
        children: (
          <div className={styles.parentForm}>
            <Form
              ref={formTrattamentoEconomico}
              fields={Object.values(getFormTrattamentoEconomicoFields(formTrattamentoEconomicoData, wokeScope, contractType,company))}
              formData={formTrattamentoEconomicoData}
              onSubmit={(data: TrattamentoEconomicoData) => setFormTrattamentoEconomicoData(data)}
              description="TE"
              disabled={type === FORM_TYPE.view}
            />
          </div>
        ),
      },
      {
        title: "Assegna Profilo",
        children: (
          <div className={styles.checkboxContainer}>
            <Form
              ref={formRuoli}
              fields={Object.values(getFormRuoliFields(formRuoliData, roles))}
              formData={formRuoliData}
              onSubmit={(data: RuoliData) => setFormRuoliData(data)}
              description="PR"
              disabled={type === FORM_TYPE.view}
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
              fields={Object.values(getFormPermessiFields(formPermessiData,))}
              formData={formPermessiData}
              onSubmit={(data: PermessiData) => setFormPermessiData(data)}
              description="per"
              disabled={type === FORM_TYPE.view}
            />
          </div>
        ),
      }
    );
  }

  return (
    <div className={styles.parentTab}>
      <Tab
        tabs={tabs}
        selected={selected}
        onSelect={handleSelect}
        button={{ label: "Salva", onClick: handleSubmit }}
      />
    </div>
  );
};

export default PersonaleSection;
