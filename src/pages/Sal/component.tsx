import React, { useState } from "react";
import Tab from "common/Tab";
import { SalDraft } from "../../component/SalCrud/Draft/component";
import { SalReadyToBill } from "../../component/SalCrud/ReadyToBill/component";
import { SalHistoryCustomer } from "../../component/SalCrud/History/component";
import { SalProvider } from "./provider";

export default function SalPage(){

    const [selected,setSelected] = useState<number>(0);

    const handleSelect = (e: any) => {
        setSelected(e.selected);
    };
    

    return <SalProvider>
    <Tab
    renderAllContent={false}
    tabs={
      [
        {
          title: "Draft",
          children: (
            <SalDraft />
          ),
        },
        {
            title: "Da fatturare",
            children: (
              <SalReadyToBill />
            ),
          },
          {
            title: "Storico",
            children: (
              <SalHistoryCustomer />
            ),
          },
      ]
    }
    onSelect={handleSelect}
    selected={selected}
    
  />
  </SalProvider>
}