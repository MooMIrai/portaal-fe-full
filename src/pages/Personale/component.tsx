import React, { useRef, useState } from "react";
import Tab from "common/Tab";
import { TabStripSelectEventArguments } from '@progress/kendo-react-layout';
import Form from "common/Form";
import styles from "./style.module.scss";
import {
    getFormAnagraficaFields,
    getFormTrattamentoEconomicoFields,
    getFormRuoliFields
} from "./FormFields";
import { AnagraficaData, TrattamentoEconomicoData, RuoliData } from './modelForms';

const PersonaleSection: React.FC = () => {
    const [selected, setSelected] = useState(0);
   
    //const [formTrattamentoEconomicoData, setFormTrattamentoEconomicoData] = useState<TrattamentoEconomicoData>({});
    //const [formTrattamentoEconomicoData, setFormTrattamentoEconomicoData] = useState<TrattamentoEconomicoData>({});
    //const [formRuoliData, setFormRuoliData] = useState<RuoliData>({});

    const formAnagrafica = useRef<any>();
    const formTrattamentoEconomico = useRef<any>();
    const formRuoli = useRef<any>();

    const handleSelect = (e: TabStripSelectEventArguments) => {
        setSelected(e.selected);
    };

    const handleSubmit = () => {

        let hasError=false

        let formAnagraficaData:AnagraficaData={};
        formAnagrafica.current?.onSubmit();
        if(formAnagrafica.current?.isValid()){
            formAnagraficaData=formAnagrafica.current.values;
        }else{
            hasError=true
        }

        let formTrattamentoEconomicoData:TrattamentoEconomicoData={};
        formTrattamentoEconomico.current?.onSubmit();
        if(formTrattamentoEconomico.current?.isValid()){
            formTrattamentoEconomicoData=formTrattamentoEconomico.current.values;
        }else{
            hasError=true
        }

        let formRuoliData:RuoliData={};
        formRuoli.current?.onSubmit();
        if(formRuoli.current?.isValid()){
            formRuoliData=formRuoli.current.values;
        }else{
            hasError=true;
        }
        
        const combinedData = {
            anagrafica: formAnagraficaData,
            trattamentoEconomico: formTrattamentoEconomicoData,
            ruoli: formRuoliData
        };

        console.log('Combined Data:', combinedData);

        if(!hasError){
            //TODO chiamata al BE
        }
    };

    const getFormFields = () => {
        switch (selected) {
            case 0:
                return { fields: getFormAnagraficaFields({}), formData: {} };
            case 1:
                return { fields: getFormTrattamentoEconomicoFields({}), formData: {} };
            case 2:
                return { fields: getFormRuoliFields({}), formData: {} };
            default:
                return { fields: {}, formData: {} };
        }
    };

    const { fields, formData } = getFormFields();

    return (
        <div className={styles.parentTab}>
            <Tab
                tabs={[
                    {
                        title: "Anagrafica", children: <div className={styles.parentForm}>
                            <Form
                                ref={formAnagrafica}
                                fields={Object.values(fields)}
                                formData={formData}
                                onSubmit={(data:AnagraficaData)=>data }
                                description="Ana"
                            />
                        </div>
                    },
                    {
                        title: "Trattamento Economico", children: <div className={styles.parentForm}>
                            <Form
                                fields={Object.values(fields)}
                                formData={formData}
                                ref={formTrattamentoEconomico}
                                onSubmit={(data:TrattamentoEconomicoData)=>data }
                                description="TE"
                            />
                        </div>
                    },
                    {
                        title: "Assegna Profilo", children: <div className={styles.parentForm}>
                            <Form
                                ref={formRuoli}
                                fields={Object.values(fields)}
                                formData={formData}
                                onSubmit={(data:RuoliData)=>data }
                                description="PR"
                            />
                        </div>
                    },
                    {
                        title: "Assegna Tipologia Ferie e Permessi", children: <div className={styles.parentForm}>
                            <Form

                                fields={Object.values(fields)}
                                formData={formData}
                                description="per"
                             
                            />
                        </div>
                    }
                ]}
                selected={selected}
                onSelect={handleSelect}
                button={{ label: 'Salva', onClick: handleSubmit }}
            />
            {/*   <div className={styles.parentForm}>
                <Form

                    fields={Object.values(fields)}
                    formData={formData}
                    showSubmit={true}
                    submitText={"Salva"}
                    onSubmit={handleSubmit}
                />
            </div> */}
        </div>
    );
};

export default PersonaleSection;
