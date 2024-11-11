import React, { useState } from "react";
import Tab from "common/Tab";
import styles from "./style.module.scss";

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
            <div className={styles.parentForm} >
             Draft
            </div>
          ),
        },
        {
            title: "Da fatturare",
            children: (
              <div className={styles.parentForm} >
               Da fatturare
              </div>
            ),
          },
          {
            title: "Storico",
            children: (
              <div className={styles.parentForm} >
               Storico
              </div>
            ),
          },
      ]
    }
    onSelect={handleSelect}
    selected={selected}
    
  />
}