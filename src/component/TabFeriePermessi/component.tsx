import React, { useEffect, useState } from "react";
import Button from "common/Button";
import CustomListView from "common/CustomListView";
import Tab from "common/Tab";
import styles from "./styles.module.scss";

const pfmData = [
  {
    "name": "jenson delaney",
    "email": "jenson.delaney@mail.com",
    "dateTimeStart": "2024-08-08T07:00:00.000Z",
    "dateTimeEnd": "2024-08-08T11:00:00.000Z",
  },
  {
    "name": "amaya coffey",
    "email": "amaya.coffey@mail.com",
    "dateTimeStart": "2024-08-08T00:00:00.000Z",
    "dateTimeEnd": "2024-08-11T00:00:00.000Z",
  },
  {
    "name": "habib joyce",
    "email": "habib.joyce@mail.com",
    "dateTimeStart": "2024-08-12T00:00:00.000Z",
    "dateTimeEnd": "2024-08-26T00:00:00.000Z",
  },
  {
    "name": "lilly-ann roche",
    "email": "lilly-ann.roche@mail.com",
    "dateTimeStart": "2024-08-08T00:00:00.000Z",
    "dateTimeEnd": "2024-08-11T00:00:00.000Z",
  },
  {
    "name": "giulia haworth",
    "email": "giulia.haworth@mail.com",
    "dateTimeStart": "2024-08-14T00:00:00.000Z",
    "dateTimeEnd": "2024-08-16T00:00:00.000Z",
  },
  {
    "name": "dawson humphrey",
    "email": "dawson.humphrey@mail.com",
    "dateTimeStart": "2024-08-20T00:00:00.000Z",
    "dateTimeEnd": "2024-08-28T00:00:00.000Z",
  },
  {
    "name": "reilly mccullough",
    "email": "reilly.mccullough@mail.com",
    "dateTimeStart": "2024-08-08T09:00:00.000Z",
    "dateTimeEnd": "2024-08-08T14:00:00.000Z",
  }
]

const FeriePermessiSection = () => {

  const [selectedTab, setSelectedTab] = useState<number>(0);

  const handleSelect = (e: any) => {
    setSelectedTab(e.selected);
  };

  useEffect(() => {
    console.log("pfmData", pfmData);
  }, [pfmData]);

  const MyHeader = () => {
    return <>
      {selectedTab === 0 ? "Richieste da approvare" : "Richieste approvate"}
    </>
  };

  const MyFooter = () => {
    return <>
      {pfmData.length} Richieste totali
    </>
  };

  const MyItemRender = (props: { dataItem: any; index?: number }) => {
    let item = props.dataItem;
    return (
      <div
        className={styles.itemContainer + " k-listview-item"}
        style={{ margin: 0 }}
      >
        <div>
          <h2
            style={{ fontSize: 14, color: "#454545", marginBottom: 0 }}
            className={styles.name}
          >
            {item.name}
          </h2>
          <div style={{ fontSize: 12, color: "#a0a0a0" }}>{item.email}</div>
        </div>
        <div>

        </div>
        <div>
          {selectedTab === 0 ? <div className={styles.buttonsContainer}>
            <Button onClick={() => { }}>Rifiuta</Button>
            <Button
              themeColor="primary"
              onClick={() => { }}
            >
              {"Approva"}
            </Button>
          </div> : <div className={styles.buttonsContainer}>
            <Button
              themeColor="primary"
              onClick={() => { }}
            >
              {"Annulla approvazione"}
            </Button>
          </div>}
        </div>
      </div>
    );
  };

  const getTabs = () => {
    return [
      {
        title: "Richieste",
        children: <div className={styles.container}>
          <CustomListView
            data={pfmData}
            item={MyItemRender}
            style={{
              width: "100%",
            }}
            header={MyHeader}
            footer={MyFooter}
          />
        </div>,
        contentClassName: styles.tabConten
      },
      {
        title: "Storico",
        children: <div className={styles.container}>
          <CustomListView
            data={pfmData}
            item={MyItemRender}
            style={{
              width: "100%",
            }}
            header={MyHeader}
            footer={MyFooter}
          />
        </div>,
        contentClassName: styles.tabConten
      }
    ]
  }

  return <Tab selected={selectedTab} onSelect={handleSelect} tabs={getTabs()} />
}

export default FeriePermessiSection;