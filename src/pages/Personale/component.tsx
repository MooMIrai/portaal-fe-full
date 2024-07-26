import React, { useState } from "react";
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
    const [formAnagraficaData, setFormAnagraficaData] = useState<AnagraficaData>({});
    const [formTrattamentoEconomicoData, setFormTrattamentoEconomicoData] = useState<TrattamentoEconomicoData>({});
    const [formRuoliData, setFormRuoliData] = useState<RuoliData>({});

    const handleSelect = (e: TabStripSelectEventArguments) => {
        setSelected(e.selected);
    };

    const handleFieldChange = (fieldName: string, value: any) => {
        switch (selected) {
            case 0:
                setFormAnagraficaData((prevData) => ({ ...prevData, [fieldName]: value }));
                break;
            case 1:
                setFormTrattamentoEconomicoData((prevData) => ({ ...prevData, [fieldName]: value }));
                break;
            case 2:
                setFormRuoliData((prevData) => ({ ...prevData, [fieldName]: value }));
                break;
            default:
                break;
        }
    };


    const handleSubmit = () => {
        const combinedData = {
            anagrafica: formAnagraficaData,
            trattamentoEconomico: formTrattamentoEconomicoData,
            ruoli: formRuoliData
        };
        console.log('Combined Data:', combinedData);
    };

    const getFormFields = () => {
        switch (selected) {
            case 0:
                return { fields: getFormAnagraficaFields(formAnagraficaData), formData: formAnagraficaData };
            case 1:
                return { fields: getFormTrattamentoEconomicoFields(formTrattamentoEconomicoData), formData: formTrattamentoEconomicoData };
            case 2:
                return { fields: getFormRuoliFields(formRuoliData), formData: formRuoliData };
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

                                fields={Object.values(fields)}
                                formData={formData}
                            /*     showSubmit={true}
                                submitText={"Salva"} */
                               /*  onSubmit={handleSubmit} */
                            />
                        </div>
                    },
                    {
                        title: "Trattamento Economico", children: <div className={styles.parentForm}>
                            <Form

                                fields={Object.values(fields)}
                                formData={formData}
                                /* showSubmit={true}
                                submitText={"Salva"} */
                               /*  onSubmit={handleSubmit} */
                            />
                        </div>
                    },
                    {
                        title: "Assegna Profilo", children: <div className={styles.parentForm}>
                            <Form

                                fields={Object.values(fields)}
                                formData={formData}
                              /*   showSubmit={true}
                                submitText={"Salva"} */
                              /*   onSubmit={handleSubmit} */
                            />
                        </div>
                    },
                    {
                        title: "Assegna Tipologia Ferie e Permessi", children: <div className={styles.parentForm}>
                            <Form

                                fields={Object.values(fields)}
                                formData={formData}
                             /*    showSubmit={true}
                                submitText={"Salva"} */
                               /*  onSubmit={handleSubmit} */
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
