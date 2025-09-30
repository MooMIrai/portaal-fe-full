import React, { useState } from "react";
import Tab from "common/Tab";
import authService from 'common/services/AuthService';
import { SalDraft } from "../../component/SalCrud/Draft/component";
import { SalReadyToBill } from "../../component/SalCrud/ReadyToBill/component";
import { SalHistoryCustomer } from "../../component/SalCrud/History/component";
import { SalProvider } from "./provider";

export default function SalPage(){

  const [selected,setSelected] = useState<number>(0);

  const handleSelect = (e: any) => {
      setSelected(e.selected);
  };

  const tabs: Array<{title: string; children: React.JSX.Element}> = [];

  if (authService.hasPermission("READ_SALES_SAL")) {
    tabs.push(
      {
        title: "Draft",
        children: (
          <SalDraft />
        ),
      }
    );
  }

  if (authService.hasPermission("READ_SALES_BILL")) {

    tabs.push(
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
      }
    );

  }

  return <SalProvider>
  <Tab
  renderAllContent={false}
  tabs={tabs}
  onSelect={handleSelect}
  selected={selected}
    
  />
  </SalProvider>
}