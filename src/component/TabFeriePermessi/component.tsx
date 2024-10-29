import React, { useEffect, useRef, useState } from "react";
import Button from "common/Button";
import CustomListView from "common/CustomListView";
import Tab from "common/Tab";
import GenericGrid from "common/Table";
import styles from "./styles.module.scss";
import { PFMData } from "./pfmDataModel";
import { PFMService } from "../../services/pfmService";
import { checkOutlineIcon, xOutlineIcon, cancelOutlineIcon } from "@progress/kendo-svg-icons";
import HoursDaysFilterCell from "common/HoursDaysFilterCell"

const FeriePermessiSection = () => {
  const [refreshRequests, setRefreshRequests] = useState<number>(0);
  const [refreshArchive, setRefreshArchive] = useState<number>(0);
  const requestsTableRef = useRef(null);
  const archiveTableRef = useRef(null);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [newRequests, setNewRequests] = useState<{ data: PFMData[], meta: any }>();
  const [archived, setArchived] = useState<{ data: PFMData[], meta: any }>();
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

  const getColumns = (isArchive: boolean) => {
    let ret = [
      {
        key: 'user_created',
        label: isArchive ? 'Approvatore' : 'Richiedente',
        sortable: false,
        type: 'string',
        filter: 'text',
      },
      {
        key: 'ActivityType.description',
        label: 'Tipo richiesta',
        sortable: true,
        type: 'number',
        filter: 'text',
      },
      {
        key: 'start_date',
        label: 'Inizio',
        sortable: true,
        type: 'date',
        filter: 'date'
      },
      {
        key: 'hours',
        label: 'Durata',
        sortable: true,
        filter:"numeric",
        type: 'number',
        filterCell: (props) => <HoursDaysFilterCell {...props} />
      },
    ]
    if (isArchive) {
      ret.push({
        key: 'approved',
        label: 'Approvata',
        sortable: true,
        type: 'boolean',
        filter: 'boolean'
      })
    }
    return ret;
  }

  const handleSelect = (e: any) => {
    setSelectedTab(e.selected);
  };

  const getData = (pagination: any, filtering: any, sorting: any[]) => {
    if (typeof pagination.pageNum !== "number") {
      pagination.pageNum = 0;
    }
  
    return PFMService.getRequests(
      selectedTab === 0 ? "new" : "archived",
      pagination.currentPage,
      pagination.pageSize,
      filtering,
      sorting,
      true
    ).then((response: any) => {
      const transformedData = response.data.map((dataItem: any) => {
        let hours = '';
        const timeUnit = dataItem.ActivityType.time_unit; 
  
        if (dataItem.TimesheetDetail.length > 0) {
          const totalHours = dataItem.TimesheetDetail[0].hours; 
  
          if (timeUnit === "D") {
            const fullDays = Math.floor(totalHours / 8); 
            const remainingHours = totalHours % 8; 
  
            if (fullDays > 0 && remainingHours > 0) {
              hours = `${fullDays} giorno/i e ${remainingHours} ora/e`;
            } else if (fullDays > 0) {
              hours = `${fullDays} giorno/i`;
            } else {
              hours = `${remainingHours} ora/e`;
            }
          } else {
            hours = `${totalHours} ora/e`;
          }
        }
  
        // Ritorna l'elemento dati con la nuova proprietà 'hours'
        return { ...dataItem, hours }; 
      });
  
      return {
        ...response,
        data: transformedData
      };
    });
  };
  

  

  useEffect(() => {
    if (selectedTab === 0) {
      setRefreshRequests(prev => prev + 1);
    } else {
      setRefreshArchive(prev => prev + 1);
    }
  }, [selectedTab]);

  const handleAction = (id: number, approve: boolean, closeModal: () => void) => {
    PFMService.approveRejectRequest(id, approve).then(res => {
      if (res) {
        setRefreshRequests(prev => prev + 1);
      }
      closeModal();
    }).catch(err => {
      console.error("An error occurred while processing the action:", err);
      closeModal();
    });
  }

  const handleUndo = (id: number, closeModal: () => void) => {
    PFMService.undoApproveReject(id).then(res => {
      if (res) {
        setRefreshArchive(prev => prev + 1);
      }
      closeModal();
    }).catch(err => {
      console.error("An error occurred while processing the action:", err);
      closeModal();
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
    /* if (startDate > endDate) {
      throw new Error("Start date must be before end date");
    } */

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

  const getTabs = () => {
    return [
      {
        title: "Richieste",
        children: <div>
          <GenericGrid
            ref={requestsTableRef}
            dropListLookup={false}
            filterable={true}
            sortable={true}
            getData={getData}
            columns={getColumns(false)}
            resizable={true}
            forceRefresh={refreshRequests}
            pageable
            customRowActions={[
              {
                icon: checkOutlineIcon,
                themeColor: 'success',
                tooltip: "Approva",
                modalContent: (dataItem, closeModal, refreshTable) => {
                  console.log(dataItem);
                  return (
                    <div>
                      Confermando, approverai la richiesta.
                      <div className={styles.actionButtonsContainer}>
                        <Button onClick={closeModal}>Chiudi</Button>
                        <Button themeColor="primary" onClick={() => {
                          handleAction(dataItem.id, true, closeModal)
                        }}>Conferma</Button>
                      </div>
                    </div>
                  );
                },
              },
              {
                icon: xOutlineIcon,
                tooltip: "Rifiuta",
                themeColor: 'error',
                modalContent: (dataItem, closeModal, refreshTable) => {
                  console.log(dataItem);
                  return (
                    <div>
                      Confermando, rifiuterai la richiesta.
                      <div className={styles.actionButtonsContainer}>
                        <Button onClick={closeModal}>Chiudi</Button>
                        <Button themeColor="primary" onClick={() => {
                          handleAction(dataItem.id, false, closeModal)
                        }}>Conferma</Button>
                      </div>
                    </div>
                  );
                },
              },
            ]}
          />
        </div>,
        contentClassName: styles.tabContent,
      },
      {
        title: "Storico",
        children: <div>
          <GenericGrid
            ref={archiveTableRef}
            dropListLookup={false}
            filterable={true}
            sortable={true}
            getData={getData}
            columns={getColumns(true)}
            resizable={true}
            forceRefresh={refreshArchive}
            pageable
            customRowActions={[
              {
                icon: cancelOutlineIcon,
                themeColor: 'warning',
                tooltip: "Annulla approvazione",
                modalContent: (dataItem, closeModal, refreshTable) => {
                  console.log(dataItem);
                  return (
                    <div>
                      Confermando, annullerai l'approvazione della richiesta.
                      <div className={styles.actionButtonsContainer}>
                        <Button onClick={closeModal}>Chiudi</Button>
                        <Button themeColor="primary" onClick={() => {
                          handleUndo(dataItem.id, closeModal)
                        }}>Conferma</Button>
                      </div>
                    </div>
                  );
                },
              },
            ]}
          />
        </div>,
        contentClassName: styles.tabContent,
      }
    ]
  }

  return <Tab selected={selectedTab} onSelect={handleSelect} tabs={getTabs()} />
}

export default FeriePermessiSection;