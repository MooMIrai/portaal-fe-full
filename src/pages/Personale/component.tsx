
import React, { useEffect, useState } from "react";
import Tab from "common/Tab"
import Form from "common/Form"
import { TabStripSelectEventArguments } from '@progress/kendo-react-layout';
import { Button } from "@progress/kendo-react-buttons";
import FormAnagrafica from "../../component/FormAnagrafica/component";
import FormTrattamentoEconomico from "../../component/FormTrattamentoPersonale/component";
import FormRuoli from "../../component/FormAssegnaProfilo/component";

 const PersonaleSection = () => {
    const [selected, setSelected] = React.useState(0);
    const handleSelect = (e: TabStripSelectEventArguments) => {
        setSelected(e.selected);
    };

   
    const tabs = [
        {
            title: "Anagrafica", children: <FormAnagrafica></FormAnagrafica>
        },
        { title: "Trattamento Economico", children: <FormTrattamentoEconomico></FormTrattamentoEconomico> },
        { title: "Assegna Profilo", children:<FormRuoli></FormRuoli>},
        { title: "Assegna Tipologia Ferie e Permessi", children: <p>Assegna Tipologia Ferie e Permessi</p>}
        
    ];



    return (

        <Tab
            tabs={tabs}
            selected={selected}
            onSelect={handleSelect}
        >
            <Button type="submit">Salva</Button>
       </Tab>


    )
};

export default PersonaleSection
