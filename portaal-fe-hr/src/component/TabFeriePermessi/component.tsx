import React, { useEffect, useRef, useState } from "react";
import { isNil } from "lodash";
import Button from "common/Button";
import Tab from "common/Tab";
import GenericGrid from "common/Table";
import { PFMService } from "../../services/pfmService";
import { checkOutlineIcon, xOutlineIcon, cancelOutlineIcon, pencilIcon } from "common/icons";
import Modal from 'common/Modal';
import NotificationActions from 'common/providers/NotificationProvider'
import HoursDaysFilterCell from "common/HoursDaysFilterCell";
import authService from "common/services/AuthService";
import AvatarIcon from 'common/AvatarIcon';
import Typography from 'common/Typography';
import SvgIcon from 'common/SvgIcon';

import styles from "./styles.module.scss";

const FeriePermessiSection = () => {
  const [data, setData] = useState<any>();
  const [refreshRequests, setRefreshRequests] = useState<number>(0);
  const [refreshArchive, setRefreshArchive] = useState<number>(0);
  const [notes, setNotes] = useState<string>();
  const [notesModal, setNotesModal] = useState<boolean>();
  const [selectedRecords, setSelectedRecords] = useState<number[]>([]);
  const [multipleApprovalModal, setMultipleApprovalModal] = useState<{open: boolean, approve?: boolean}>();
  const requestsTableRef = useRef(null);
  const archiveTableRef = useRef(null);
  const [selectedTab, setSelectedTab] = useState<number>(0);


  const getMultipleApprovalButtons = () => {

    return [

      <Button themeColor="info" svgIcon={checkOutlineIcon} disabled={!selectedRecords.length} 
      onClick={() => setMultipleApprovalModal({open: true, approve: true})}>
        Approva
      </Button>,

      <Button themeColor="error" svgIcon={xOutlineIcon} disabled={!selectedRecords.length}
      onClick={() => setMultipleApprovalModal({open: true, approve: false})}>
        Rifiuta
      </Button>

    ];
  };

  const getMultipleResetButton = () => {

    return [
      <Button themeColor="warning" svgIcon={cancelOutlineIcon} disabled={!selectedRecords.length} 
      onClick={() => setMultipleApprovalModal({open: true})}>
        Annulla
      </Button>
    ];
  };

  const getMultipleModalMessage = () => {

    const approveMessage = selectedRecords.length > 1
    ? `Saranno approvate ${selectedRecords.length} richieste.`
    : `Sarà approvata ${selectedRecords.length} richiesta.`;

    const denyMessage = selectedRecords.length > 1
    ? `Saranno rifiutate ${selectedRecords.length} richieste.`
    : `Sarà rifiutata ${selectedRecords.length} richiesta.`;

    const resetMessage = selectedRecords.length > 1
    ? `Saranno annullate ${selectedRecords.length} richieste.`
    : `Sarà annullata ${selectedRecords.length} richiesta.`;
    
    const confirmMessage = `Confermare?`;

    if (multipleApprovalModal?.approve === true) return `${approveMessage} ${confirmMessage}`;
    else if(multipleApprovalModal?.approve === false) return `${denyMessage} ${confirmMessage}`;
    else return `${resetMessage} ${confirmMessage}`;
  };

  const multipleApprovalStyle: React.CSSProperties = {display: "flex", justifyContent: "center", alignItems: "center"};

  const onChangeSelected = (id: number, isSelected: boolean) => {

    const currentSelection = new Set(selectedRecords);
    if (isSelected) currentSelection.add(id);
    else currentSelection.delete(id);

    setSelectedRecords([...currentSelection]);
  };

  const onSubmitMultiple = () => {

    if (!isNil(multipleApprovalModal?.approve)) {

      PFMService.approveRejectRequestMany(selectedRecords, multipleApprovalModal?.approve!)
      .then(res => {
        if (res) setRefreshRequests(prev => prev + 1);
        setMultipleApprovalModal({open: false});
        setSelectedRecords([]);
      })
      .catch(err => {
        NotificationActions.openModal({ icon: true, style: "error" }, err?.message || "Errore nell'operazione.");
        setMultipleApprovalModal({open: false});
        setSelectedRecords([]);
      });

    }

    else {

      PFMService.undoApproveRejectMany(selectedRecords)
      .then(res => {
        if (res) setRefreshArchive(prev => prev + 1);
        setMultipleApprovalModal({open: false});
        setSelectedRecords([]);
      })
      .catch(err => {
        NotificationActions.openModal({ icon: true, style: "error" }, err?.message || "Errore nell'operazione.");
        setMultipleApprovalModal({open: false});
        setSelectedRecords([]);
      });

    } 

  };


  const defaultSort = [
    {
      "field": "start_date",
      "dir": "desc"
    }
  ];


  const columns=[
    {
      key: "id",
      label: "",
      headerCell:  (props: any) => {

        return (
          <td style={{padding: 0, display: "flex", justifyContent: "center"}}>
            <input 
            type="checkbox"
            checked={data?.length > 0 && selectedRecords?.length === data?.length}
            onChange={(e) => {
              const all_ids = data.map(record => record.id);
              if (e.target.checked) setSelectedRecords(all_ids);
              else setSelectedRecords([]);
            }}
            />
          </td>
        );

      },
      type: "custom",
      width: "40px",
      render: (row) => {
        return (
          <td>
            <input 
              type="checkbox"
              checked={selectedRecords.includes(row.id)} 
              onChange={(e) => onChangeSelected(row.id, e.target.checked)} 
            />
          </td>
        );
      }
    },
    {
      key: "Person.lastName",
      label: "Nominativo",
      type: "custom",
      width: "200px",
      sortable: true,
      render:(row)=>{
        const n = row.Person;
        return <td>
                  <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', paddingTop: 5, paddingBottom: 5 }}>
                      <AvatarIcon name={`${n.firstName} ${n.lastName}`}
                          initials={`${n.firstName[0].toUpperCase()}${n.lastName[0].toUpperCase()}`} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, flexGrow: 1 }}>
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
      },
      {
        key: 'notes',
        label: "Note",
        sortable: false,
        type: "custom",
        filter: "text",
        render: (row: any) => {

          const openModal = () => {
            setNotes(row.notes);
            setNotesModal(true);
          };

          return (
            <td>
              <Button className={row.notes ? styles.notesButton : ""} onClick={openModal} svgIcon={pencilIcon}>Apri</Button>
            </td>
          );
        }
      }
      
    ]
    
    if(selectedTab===1){
      columns.push({
        key: 'approved',
        label: 'Approvata',
        sortable: true,
        type: 'custom',
        filter: 'boolean',
        render: (row: any) => {
          const icon = row.approved ? checkOutlineIcon : xOutlineIcon;
          const className = row.approved ? styles.approvedRequest : styles.rejectedRequest;
          return <td className={className}><SvgIcon icon={icon} /></td>;
        }
      } as any)
    }


  const handleSelect = (e: any) => {
    setSelectedTab(e.selected);
    setSelectedRecords([]);
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

          const startDate = new Date(dataItem.start_date);
          const endDate = new Date(dataItem.end_date);
          const totalHours = dataItem.TimesheetDetail[0].hours; 
  
          if (timeUnit === "D") {
            const endDay = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDay());
            const startDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDay());
            const fullDays = ((endDay.getTime() - startDay.getTime()) / (1000 * 60 * 60 * 24)) + 1; 
            hours = `${fullDays} giorno/i`;
          }
          
          else {
            hours = `${totalHours} ora/e`;
          }

        }
  
        // Ritorna l'elemento dati con la nuova proprietà 'hours'
        return { ...dataItem, hours }; 
      });

      setSelectedRecords([]);
      setData(transformedData);
  
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
            className={"text-align-center center-align-th"}
            ref={requestsTableRef}
            extraButtons={getMultipleApprovalButtons()}
            dropListLookup={false}
            filterable={true}
            sortable={true}
            sorting={defaultSort}
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
            sorting={defaultSort}
            className={"text-align-center center-align-th"}
            extraButtons={getMultipleResetButton()}
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

  return (
    <>
      <Tab selected={selectedTab} onSelect={handleSelect} tabs={getTabs()} />
      <Modal
        title={"Gestione richieste"}
        callToAction="Conferma"
        showModalFooter
        height={150}
        style={multipleApprovalStyle}
        isOpen={multipleApprovalModal?.open}
        onClose={() => setMultipleApprovalModal({open: false})}
        onSubmit={onSubmitMultiple}
        >
          {getMultipleModalMessage()}
        </Modal>
      <Modal
        title={"Note"}
        callToAction="Chiudi"
        noClose
        showModalFooter
        height={250}
        isOpen={notesModal}
        onClose={() => setNotesModal(false)}
        onSubmit={() => setNotesModal(false)}
      >
        {notes || <i>Nessuna nota.</i>}
      </Modal>
    </>
  );
}

export default FeriePermessiSection;