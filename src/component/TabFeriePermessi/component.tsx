import React, { useEffect, useState } from "react";
import Button from "common/Button";
import CustomListView from "common/CustomListView";
import Tab from "common/Tab";
import styles from "./styles.module.scss";
import { PFMData } from "./pfmDataModel";
import { PFMService } from "../../services/pfmService";

const FeriePermessiSection = () => {

  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [newRequests, setNewRequests] = useState<{ data: PFMData[], meta: any }>();
  const [archived, setArchived] = useState<{ data: PFMData[], meta: any }>();
  const [loadingRequests, setLoadingRequests] = useState<boolean>(true);
  const [loadingArchive, setLoadingArchive] = useState<boolean>(true);
  const [requestsPage, setRequestsPage] = useState({
    skip: 0,
    take: 10,
    total: 0,
  });
  const [archivePage, setArchivePage] = useState({
    skip: 0,
    take: 10,
    total: 0,
  });

  const handleRequestsPageChange = (e: any) => {
    setRequestsPage({
      skip: e.skip,
      take: e.take,
      total: newRequests?.meta.total
    });
    getData({ pageNum: e.skip, pageSize: e.take });
  };

  const handleArchivePageChange = (e: any) => {
    setArchivePage({
      skip: e.skip,
      take: e.take,
      total: archived?.meta.total
    });
    getData({ pageNum: e.skip, pageSize: e.take });
  };

  const handleSelect = (e: any) => {
    setSelectedTab(e.selected);
  };

  const getData = (pagination: { pageNum: number, pageSize: number }) => {
    if (selectedTab === 0) {
      setLoadingRequests(true);
    } else {
      setLoadingArchive(true);
    }

    PFMService.getRequests(selectedTab === 0 ? "new" : "archived", pagination).then(res => {
      if (selectedTab === 0) {
        setNewRequests(res);
        setLoadingRequests(false);
        setRequestsPage(prev => {
          return {
            ...prev,
            total: res.meta.total,
          }
        })
      } else {
        setArchived(res);
        setLoadingArchive(false);
        setArchivePage(prev => {
          return {
            ...prev,
            total: res.meta.total,
          }
        })
      }
    }).catch(err => {
      console.error("An error occurred while fetching data:", err);
    });
  }

  useEffect(() => {
    let pagination = {
      pageNum: selectedTab === 0 ? requestsPage.skip : archivePage.skip,
      pageSize: selectedTab === 0 ? requestsPage.take : archivePage.take
    }
    getData(pagination);
  }, [selectedTab]);

  const MyHeader = () => {
    return <div className={styles.header}>
      {selectedTab === 0 ? "Richieste da approvare" : "Richieste approvate"}
    </div>
  };

  const handleAction = (id: number, approve: boolean) => {
    setLoadingRequests(true);
    PFMService.approveRejectRequest(id, approve).then(res => {
      let pagination = {
        pageNum: requestsPage.skip,
        pageSize: requestsPage.take
      }
      getData(pagination);
    }).catch(err => {
      console.error("An error occurred while processing the action:", err);
    });
  }

  const handleUndo = (id: number) => {
    setLoadingArchive(true);
    PFMService.undoApproveReject(id).then(res => {
      let pagination = {
        pageNum: archivePage.skip,
        pageSize: archivePage.take
      }
      getData(pagination);
    }).catch(err => {
      console.error("An error occurred while processing the action:", err);
    });
  }

  const calculateWorkingTimeDifference = (startIso: string, endIso: string): string => {
    const WORK_START_HOUR = 9;
    const WORK_END_HOUR = 18;
    const HOURS_IN_WORKDAY = WORK_END_HOUR - WORK_START_HOUR;
    const MS_PER_HOUR = 1000 * 60 * 60;

    const startDate = new Date(startIso);
    const endDate = new Date(endIso);

    // Ensure start date is before end date
    if (startDate > endDate) {
      throw new Error("Start date must be before end date");
    }

    let totalHours = 0;

    // Calculate hours on the first day
    if (startDate.getDay() >= 1 && startDate.getDay() <= 5) {
      const workStart = new Date(startDate);
      workStart.setHours(WORK_START_HOUR, 0, 0, 0);

      const workEnd = new Date(startDate);
      workEnd.setHours(WORK_END_HOUR, 0, 0, 0);

      const actualWorkStart = startDate > workStart ? startDate : workStart;
      const hoursOnFirstDay = (workEnd.getTime() - actualWorkStart.getTime()) / MS_PER_HOUR;

      totalHours += Math.max(0, hoursOnFirstDay); // Add only positive working hours
    }

    // Calculate hours on the last day
    if (endDate.getDay() >= 1 && endDate.getDay() <= 5) {
      const workStart = new Date(endDate);
      workStart.setHours(WORK_START_HOUR, 0, 0, 0);

      const workEnd = new Date(endDate);
      workEnd.setHours(WORK_END_HOUR, 0, 0, 0);

      const actualWorkEnd = endDate < workEnd ? endDate : workEnd;
      const hoursOnLastDay = (actualWorkEnd.getTime() - workStart.getTime()) / MS_PER_HOUR;

      totalHours += Math.max(0, hoursOnLastDay); // Add only positive working hours
    }

    // Calculate full working days in between
    let fullDaysCount = 0;
    let currentDay = new Date(startDate);
    currentDay.setDate(currentDay.getDate() + 1); // Start from the day after the start date

    while (currentDay < endDate) {
      const dayOfWeek = currentDay.getDay();

      // Check if it's a working day (Monday to Friday)
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        fullDaysCount++;
      }

      currentDay.setDate(currentDay.getDate() + 1);
    }

    totalHours += fullDaysCount * HOURS_IN_WORKDAY;

    const days = Math.floor(totalHours / HOURS_IN_WORKDAY);
    const hours = totalHours % HOURS_IN_WORKDAY;

    if (days && hours) {
      return days + " giorni e " + hours + " ore";
    }

    if (days && !hours) {
      return days + " giorni"
    }

    return hours + " ore";
  }

  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  }

  const MyItemRender = (props: { dataItem: PFMData; index?: number }) => {
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
            {item.user_created || "Test nome"}
          </h2>
          <div style={{ fontSize: 12, color: "#a0a0a0" }}>ID Utente: {item.person_id}</div>
        </div>
        <div>
          <span>Tipo richiesta: {item.activity_type_id}</span>
        </div>
        <div className={styles.datesContainer}>
          <span>Inizio: {formatDate(item.start_date)}</span>
          <span>Fine: {formatDate(item.end_date)}</span>
        </div>
        <div>
          <span>Durata: {calculateWorkingTimeDifference(item.start_date, item.end_date)}</span>
        </div>
        {
          selectedTab === 1 ? <>
            {item.approved ? <h2 className={styles.approvedText}>Approvata</h2> : <h2 className={styles.rejectedText}>Rifiutata</h2>}
          </> : null
        }
        <div>
          {selectedTab === 0 ? <div className={styles.buttonsContainer}>
            <Button onClick={() => handleAction(item.id, false)}>Rifiuta</Button>
            <Button
              themeColor="primary"
              onClick={() => handleAction(item.id, true)}
            >
              {"Approva"}
            </Button>
          </div> : <div className={styles.buttonsContainer}>
            <Button
              themeColor="primary"
              onClick={() => handleUndo(item.id)}
            >
              {"Annulla azione"}
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
        children: <div className={styles.container + (loadingRequests ? " " + styles.loading : "")}>
          <CustomListView
            data={newRequests?.data}
            item={MyItemRender}
            style={{
              width: "100%",
            }}
            header={MyHeader()}
            loading={loadingRequests}
            paginate={{
              ...requestsPage,
              onPageChange: handleRequestsPageChange,
              className: styles.paginationContainer
            }}
          />
        </div>,
        contentClassName: styles.tabConten,
      },
      {
        title: "Storico",
        children: <div className={styles.container + (loadingArchive ? " " + styles.loading : "")}>
          <CustomListView
            data={archived?.data}
            item={MyItemRender}
            style={{
              width: "100%",
            }}
            header={MyHeader()}
            loading={loadingArchive}
            paginate={{
              ...archivePage,
              onPageChange: handleArchivePageChange,
              className: styles.paginationContainer
            }}
          />
        </div>,
        contentClassName: styles.tabConten,
      }
    ]
  }

  return <Tab selected={selectedTab} onSelect={handleSelect} tabs={getTabs()} />
}

export default FeriePermessiSection;