import React, { useState } from "react";
import Tab from "common/Tab";
import styles from "./style.module.scss";
import { SalDraft } from "../../component/SalCrud/Draft/component";
import { SalReadyToBill } from "../../component/SalCrud/ReadyToBill/component";
import { SalHistoryCustomer } from "../../component/SalCrud/History/component";

export default function SalPage(){

    const [selected,setSelected] = useState<number>(0);

    const handleSelect = (e: any) => {
        setSelected(e.selected);
    };
    

    return <Tab
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
}