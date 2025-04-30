import React, { useEffect, useRef, useState } from "react";
import Button from "common/Button";
import Tab from "common/Tab";
import GenericGrid from "common/Table";
import { PFMService } from "../../services/pfmService";
import { checkOutlineIcon, xOutlineIcon, cancelOutlineIcon } from "common/icons";
import HoursDaysFilterCell from "common/HoursDaysFilterCell"
import authService from "common/services/AuthService";
import AvatarIcon from 'common/AvatarIcon';
import Typography from 'common/Typography';

import styles from "./styles.module.scss";

const FeriePermessiSection = () => {
  const [refreshRequests, setRefreshRequests] = useState<number>(0);
  const [refreshArchive, setRefreshArchive] = useState<number>(0);
  const requestsTableRef = useRef(null);
  const archiveTableRef = useRef(null);
  const [selectedTab, setSelectedTab] = useState<number>(0);


  const columns=[
    {
      key: "Person.lastName",
      label: "Nominativo",
      type: "custom",
      sortable: true,
      render:(row)=>{
        const n = row.Person;
        return <td>
                  <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 15, alignItems: 'center', paddingTop: 5, paddingBottom: 5 }}>
                      <AvatarIcon name={`${n.firstName} ${n.lastName}`}
                          initials={`${n.firstName[0].toUpperCase()}${n.lastName[0].toUpperCase()}`} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                          <Typography.h6>{n.firstName} {n.lastName}</Typography.h6>
                          <Typography.p>{row.user_created}</Typography.p>
                      </div>
                  </div>
              </td>
        }
    },
      {
        key: 'user_created',
        label: selectedTab===1?'Approvatore' : 'Richiedente',
        sortable: false,
        type: 'string',
        filter: 'text',
      },
      {
        key: 'ActivityType.description',
        label: 'Tipo richiesta',
        sortable: true,
        type: 'string',
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
      }
      
    ]
    
    if(selectedTab===1){
      columns.push({
        
        key: 'approved',
        label: 'Approvata',
        sortable: true,
        type: 'boolean',
        filter: 'boolean'
      
  })
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


  const getTabs = () => {
    return [
      {
        title: "Richieste",
        children: <div>
          <GenericGrid
            addedFilters={[
              {
                name: "Person.firstName",
                label: "Nome",
                type: "text"
              },
              {
                name: "Person.lastName",
                label: "Cognome",
                type: "text"
              }]
            }
            writePermissions={["WRITE_HR_HOLIDAY"]}
            ref={requestsTableRef}
            dropListLookup={false}
            filterable={true}
            sortable={true}
            getData={getData}
            columns={columns}
            resizable={true}
            forceRefresh={refreshRequests}
            pageable
            customRowActions={[
              {
                icon: checkOutlineIcon,
                themeColor: 'success',
                tooltip: "Approva",
                modalContent: (dataItem, closeModal, refreshTable) => {
                  
                  if(authService.hasPermission("WRITE_HR_HOLIDAY")){
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
                  }
                  return <></>
                },
              },
              {
                icon: xOutlineIcon,
                tooltip: "Rifiuta",
                themeColor: 'error',
                modalContent: (dataItem, closeModal, refreshTable) => {
                  if(authService.hasPermission("WRITE_HR_HOLIDAY")){
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
                  }
                  return <></>
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
            addedFilters={[
              {
                name: "Person.firstName",
                label: "Nome",
                type: "text"
              },
              {
                name: "Person.lastName",
                label: "Cognome",
                type: "text"
              }]
            }
            ref={archiveTableRef}
            dropListLookup={false}
            filterable={true}
            sortable={true}
            getData={getData}
            columns={columns}
            resizable={true}
            forceRefresh={refreshArchive}
            pageable
            customRowActions={[
              {
                icon: cancelOutlineIcon,
                themeColor: 'warning',
                tooltip: "Annulla approvazione",
                modalContent: (dataItem, closeModal, refreshTable) => {
                  if(authService.hasPermission("WRITE_HR_HOLIDAY")){
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
                  }
                  return <></>
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