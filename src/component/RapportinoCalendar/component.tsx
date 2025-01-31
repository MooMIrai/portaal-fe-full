import React, { useEffect, useState } from "react";
import Calendar from "common/Calendar";
import CalendarMobile from "common/CalendarMobile";
import { TimesheetsService } from "../../services/rapportinoService";
import { useWindowSize } from "@uidotdev/usehooks";
import RapportinoCrud from "../RapportinoCrud/component";
import withScheduler from "common/hoc/SchedulerItem"
import NotificationActions from 'common/providers/NotificationProvider'
import { chevronLeftIcon, chevronRightIcon } from 'common/icons';
import SvgIcon from 'common/SvgIcon'
import Button from 'common/Button'
import Modal from 'common/Modal'
import { AutoCompletePerson } from "./customFields";

const RapportinoItemView = (props: any) => {

  let bg: string | undefined = undefined;
  let color: string | undefined = undefined;
  let status = '';
  if (props.request) {
    if (props.request.approved === null) {
      bg = 'rgb(255, 192, 0)';
      color = 'black';
      status = '(Da approvare)'
    } else if (props.request.approved) {
      bg = 'green';
      status = '(Approvata)'
    } else {
      bg = 'red'
      status = '(Rifiutata)'
    }
  }

  const deleteRequest = (requestSelected: any, titoloRichiesta) => {
    NotificationActions.openConfirm('Sei sicuro di rimuovere la richiesta di ' + titoloRichiesta + ' che va dal ' + new Date(requestSelected.start_date).toLocaleDateString() + ' al ' + new Date(requestSelected.end_date).toLocaleDateString() + '?',
      () => {
        TimesheetsService.deleteLeaveRequest(requestSelected.id).then(() => {
          NotificationActions.openModal(
            { icon: true, style: "success" },
            "Operazione avvenuta con successo "
          );
          setTimeout(() => { document.dispatchEvent(new CustomEvent("CalendarRefreshData")) }, 500);
        })

      },
      'Cancella richiesta'
    )
  }

  return <div style={{
    color: color,
    background: bg,
    width: "100%",
    height: "100%",
    position: "absolute",
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
    textAlign: "center",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14
  }}>{!props.request ? `${props.hours} ore - ` : null} {props.title} {status}  {/* {props.request && props.request.approved === null ?
    <button style={{ background: 'transparent', border: 'none', cursor: 'pointer' }} title={"Cancella richiesta " + props.title} onClick={(e) => {
      e.preventDefault();
      deleteRequest(props.request, props.title)
    }}>
      <svg style={{ marginLeft: 10 }} width="20px" height="20px" viewBox="0 0 1024 1024" fill="#000000" className="icon" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M32 241.6c-11.2 0-20-8.8-20-20s8.8-20 20-20l940 1.6c11.2 0 20 8.8 20 20s-8.8 20-20 20L32 241.6zM186.4 282.4c0-11.2 8.8-20 20-20s20 8.8 20 20v688.8l585.6-6.4V289.6c0-11.2 8.8-20 20-20s20 8.8 20 20v716.8l-666.4 7.2V282.4z" fill="" /><path d="M682.4 867.2c-11.2 0-20-8.8-20-20V372c0-11.2 8.8-20 20-20s20 8.8 20 20v475.2c0.8 11.2-8.8 20-20 20zM367.2 867.2c-11.2 0-20-8.8-20-20V372c0-11.2 8.8-20 20-20s20 8.8 20 20v475.2c0.8 11.2-8.8 20-20 20zM524.8 867.2c-11.2 0-20-8.8-20-20V372c0-11.2 8.8-20 20-20s20 8.8 20 20v475.2c0.8 11.2-8.8 20-20 20zM655.2 213.6v-48.8c0-17.6-14.4-32-32-32H418.4c-18.4 0-32 14.4-32 32.8V208h-40v-42.4c0-40 32.8-72.8 72.8-72.8H624c40 0 72.8 32.8 72.8 72.8v48.8h-41.6z" fill="" /></svg>
    </button> : null}</div> */}</div>
}
const RapportinoItem = withScheduler(RapportinoItemView)

export interface RapportinoCalendarProps {
  forcePerson?: { id: number, name: string };
  forceDate?:Date
}

export default function RapportinoCalendar(props: RapportinoCalendarProps) {
  const defaultPerson = props.forcePerson || { id: 0, name: '(Me)' };

  const [date, setDate] = useState<Date>(props.forceDate || new Date());
  const [data, setData] = useState<any>([]);
  const [holidays, setHolidays] = useState<Array<number>>();
  const [timeSheetsId, setTimeSheetsId] = useState<number>();
  const [mobileSelectedDate, setMobileSelectedDate] = useState<Date>();
  const [showConsolidaConfirmModal, setShowConsolidaConfirmModal] = useState<boolean>(false);
  const [isFinalized, setIsFinalized] = useState<boolean | undefined>(undefined);

  const [userSelected, setUserSelected] = useState<{ id: number, name: string }>(defaultPerson);

  const size = useWindowSize();

  const convertToISODateString = (year, month, day, hour, minute) => {
    const date = new Date(Date.UTC(year, month - 1, day, hour, minute, 0, 0));

    return date.toISOString();
  };


  function mergeRequests(data) {
    const mergedRequests: any[] = [];
    const requestMap = {};

    data.forEach(item => {
      // Verifica se l'elemento ha la proprietà request
      if (item.request) {
        const reqId = item.request.id;

        // Se non esiste ancora nel map, lo aggiungiamo
        if (!requestMap[reqId]) {
          requestMap[reqId] = {
            ...item,
            request: { ...item.request },
            start: new Date(item.start),
            end: new Date(item.end)
          };
        } else {
          // Aggiorniamo le date minime e massime
          const currentStart = new Date(item.start);
          const currentEnd = new Date(item.end);

          if (currentStart < requestMap[reqId].start) {
            requestMap[reqId].start = currentStart;
          }
          if (currentEnd > requestMap[reqId].end) {
            requestMap[reqId].end = currentEnd;
          }
        }
      } else {
        // Se l'elemento non ha request, lo aggiungiamo direttamente
        mergedRequests.push(item);
      }
    });

    // Convertiamo il map in un array e formatta le date come ISO string
    for (const reqId in requestMap) {
      const mergedItem = requestMap[reqId];
      mergedItem.start = mergedItem.start;
      mergedItem.end = mergedItem.end;
      mergedRequests.push(mergedItem);
    }

    return mergedRequests;
  }

  const fetchTimesheet = () => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    TimesheetsService.findOrCreate(year, month, "", userSelected.id > 0 ? userSelected.id : undefined)
      .then((response) => {
        setTimeSheetsId(response.id);
        setHolidays(response.holidays);
        TimesheetsService.getSingleTimesheets(response.id, true).then((res) => {

          setIsFinalized(!!res?.finalized);

          let activities: any = [];

          res?.TimesheetDetail.forEach((el) => {

            if (el) {
              activities.push({
                request: el.LeaveRequest,
                activity: el.PersonActivity.Activity,
                id: el.id,
                title: el.PersonActivity.Activity.description,
                day: el.day,
                hours: el.hours,
                start: new Date(
                  convertToISODateString(year, month, el.day, 9, 0)
                ),
                end: new Date(
                  convertToISODateString(year, month, el.day, 18, 0)
                ),
              });
            }
          });

          setData(mergeRequests(activities));
        });
      })
      .catch((error) => {
        console.error("Errore:", error);
      });
  };

  const handleDateChange = (event: any) => {
    //const dateObject = new Date(event.value);
    //fetchTimesheet(dateObject);
    setDate(event.value);
  };

  useEffect(() => {
    fetchTimesheet();
    document.addEventListener('CalendarRefreshData', fetchTimesheet);
    return () => {
      document.removeEventListener('CalendarRefreshData', fetchTimesheet);
    }
  }, [date, userSelected]);



  const renderContent = (slot, closeModalCallback) => {

    const dates: Date[] = [];
    let currentDate = new Date(slot.start);
    const values = {};
    const holidaysData = {};

    let hasHolidayInSelection = false;
    while (currentDate < slot.end) {

      if (!hasHolidayInSelection && holidays?.some(h => h === currentDate.getDate())) {
        hasHolidayInSelection = true;
      }
      dates.push(new Date(currentDate));
      const valuesByDate = data.filter((el) => {
        if (el.request) {
          let startDate = new Date(el.request.start_date);
          let endDate = new Date(el.request.end_date);
          return startDate.getDate() <= currentDate.getDate() && endDate.getDate() >= currentDate.getDate();
        } else {
          return el.start.getDate() <= currentDate.getDate() && el.end.getDate() >= currentDate.getDate();
        }
      });
      //prendere i dati per riempire le ore dentro il crud
      if (valuesByDate) {
        values[currentDate.getDate()] = {};
        valuesByDate.forEach((el) => {
          values[currentDate.getDate()][el.activity.id] = el.hours;
        });
      }

      //Prendere orari dei permessi per riempire i timepicker dentro il crud
      data.filter((el) => {
        if (!el.request) {
          return false
        }
        let startDate = new Date(el.request.start_date);
        startDate.setHours(0, 0, 0, 0);
        let endDate = new Date(el.request.end_date);
        endDate.setHours(23, 59, 59, 59);
        return currentDate >= startDate && currentDate <= endDate;
      }).forEach(hol => {
        if (!holidaysData[currentDate.getDate()]) {
          holidaysData[currentDate.getDate()] = {};
        }
        let holActData = {
          hours: hol.hours,
          approved: hol.request.approve_date ? new Date(hol.request.approve_date) : null,
          name: hol.title,
        }
        if (holidaysData[currentDate.getDate()][hol.activity.id]) {
          holidaysData[currentDate.getDate()][hol.activity.id].push(holActData);
        } else {
          holidaysData[currentDate.getDate()][hol.activity.id] = [holActData];
        }
      });

      currentDate.setDate(currentDate.getDate() + 1); // Incrementa di un giorno

    }

    return {
      component: (
        <RapportinoCrud
          dates={dates}
          timesheetId={timeSheetsId || 0}
          values={values}
          hasHoliday={hasHolidayInSelection}
          closeModal={() => {
            closeModalCallback();
            fetchTimesheet()
          }}
          holidaysData={holidaysData}
          editLocked={!!props.forcePerson || isFinalized}
        //onClose={closeModalCallback}
        //onActivitiesAdded={onActivitiesAdded}
        />
      ),
      title: dates.length >= 2
        ? dates[0]?.toLocaleDateString("it-IT") + ' - ' + dates[dates.length - 1]?.toLocaleDateString("it-IT") || ""
        : dates[0]?.toLocaleDateString("it-IT"),
    };
  };


  const renderContentMobile = (cellProps: any) => {
    const ret = {
      style: {},
      hours: undefined
    }

    const isHoliday = holidays?.some((h) => cellProps.value.getDate() === h && cellProps.value.getMonth() === date.getMonth());
    const request = data.find(d => {
      if (!d.request) return false;
      let startDate = new Date(d.request.start_date);
      let endDate = new Date(d.request.end_date);
      return startDate.getDate() <= cellProps.value.getDate() && endDate.getDate() >= cellProps.value.getDate() && cellProps.value.getMonth() === date.getMonth();
    });
    const activities = data.filter(d => d.day === cellProps.value.getDate() && cellProps.value.getMonth() === date.getMonth());
    if (isHoliday) {
      ret.style["color"] = 'red'
    }
    if (request) {
      if (isFinalized) {
        ret.style["background"] = '#e9ecef';
      } else if (request.request.approved === true) {
        ret.style["background"] = 'green';
      } else if (request.request && request.request.approved === false) {
        ret.style["background"] = 'red';
      } else {
        ret.style["background"] = 'rgb(255, 192, 0)';
      }
      ret.hours = activities.reduce((aggregator, obj) => aggregator + obj.hours, 0)
    } else if (activities.length) {
      ret.hours = activities.reduce((aggregator, obj) => aggregator + obj.hours, 0)
    }

    return ret;
  }

  const getCrudMobile = () => {

    const dates: Date[] = [];
    const values = {};
    let hasHolidayInSelection = false;
    const holidaysData = {};

    if (mobileSelectedDate) {
      hasHolidayInSelection = holidays ? holidays.some(h => h === mobileSelectedDate.getDate()) : false;
      dates.push(mobileSelectedDate);
      values[mobileSelectedDate.getDate()] = {};
      const dataFiltered = data.filter(el => {
        if (el.request) {
          let startDate = new Date(el.request.start_date);
          let endDate = new Date(el.request.end_date);
          return startDate.getDate() <= mobileSelectedDate.getDate() && endDate.getDate() >= mobileSelectedDate.getDate();
        } else {
          return el.start.getDate() <= mobileSelectedDate.getDate() && el.end.getDate() >= mobileSelectedDate.getDate();
        }
      });
      dataFiltered.forEach(d => {
        values[mobileSelectedDate.getDate()][d.activity.id] = d.hours
      });

      data.filter((el) => {
        if (!el.request) {
          return false
        }
        let startDate = new Date(el.request.start_date);
        startDate.setHours(0, 0, 0, 0);
        let endDate = new Date(el.request.end_date);
        endDate.setHours(23, 59, 59, 59);
        return mobileSelectedDate >= startDate && mobileSelectedDate <= endDate;
      }).forEach(hol => {
        if (!holidaysData[mobileSelectedDate.getDate()]) {
          holidaysData[mobileSelectedDate.getDate()] = {};
        }
        let holActData = {
          hours: hol.hours,
          approved: hol.request.approve_date ? new Date(hol.request.approve_date) : null,
          name: hol.title,
        }
        if (holidaysData[mobileSelectedDate.getDate()][hol.activity.id]) {
          holidaysData[mobileSelectedDate.getDate()][hol.activity.id].push(holActData);
        } else {
          holidaysData[mobileSelectedDate.getDate()][hol.activity.id] = [holActData];
        }
      });
    }

    return <RapportinoCrud
      dates={dates}
      timesheetId={timeSheetsId || 0}
      values={values}
      hasHoliday={hasHolidayInSelection}
      closeModal={() => {
        document.dispatchEvent(new CustomEvent("CalendarRefreshData"));
      }}
      holidaysData={holidaysData}
      editLocked={!!props.forcePerson || isFinalized}

    //onClose={closeModalCallback}
    //onActivitiesAdded={onActivitiesAdded}
    />
  }

  return (
    <>
      {!props.forcePerson ? <div style={{ display: 'flex', flexDirection: size.width && size.width >= 768 ? 'row' : 'column', justifyContent: "space-between", marginBottom: 10 }}>
        <p>Tocca una data per inserire le ore di attività o trascina per selezionare più date</p>
        <div style={{ display: 'flex', justifyContent: "space-between", alignItems: 'flex-end', gap: 15 }}>
          <div style={{ width: 300 }}>Utente Selezionato <AutoCompletePerson label="" value={userSelected} onChange={(e) => {
            if (!e.value) {
              setUserSelected(defaultPerson)
            } else {
              setUserSelected(e.value)
            }
          }} />
          </div>
          {isFinalized != undefined && <Button style={{ maxHeight: 'min-content' }} themeColor="success" onClick={() => setShowConsolidaConfirmModal(true)}>{isFinalized ? "Deconsolida" : "Consolida"}</Button>}
        </div>

      </div> : null}

      <Modal
        title={isFinalized ? "Deconsolida" : "Consolida"}
        callToAction="Conferma"
        showModalFooter
        height={250}
        isOpen={!!showConsolidaConfirmModal}
        onClose={() => setShowConsolidaConfirmModal(false)}
        onSubmit={() => {
          if (!isFinalized) {
            TimesheetsService.finalizeTimesheet(timeSheetsId || 0).then(res => {
              if (res) {
                setIsFinalized(true);
              }
            }).finally(() => {
              setShowConsolidaConfirmModal(false);
            })
          } else {
            TimesheetsService.deconsolidateTimesheet(timeSheetsId || 0).then(res => {
              if (res) {
                setIsFinalized(false);
              }
            }).finally(() => {
              setShowConsolidaConfirmModal(false);
            });
          }
        }}
      >
        L'operazione è irreversibile.
      </Modal>

      {size.width && size.width >= 768 ? (
        <Calendar
          date={date}
          model={{
            timeSheetsId: timeSheetsId,
          }}
          //timezone="UTC"
          handleDateChange={handleDateChange}
          defaultView="month"
          handleDataChange={() => { }}
          data={data}
          contentModal={renderContent}
          item={RapportinoItem}
          holidays={holidays}
          disableDrag={!!props.forcePerson}
          isFinalized={!props.forcePerson && isFinalized}
        />
      ) : (<>
        <CalendarMobile
          topView="month"
          navigation={true}
          focusedDate={date}
          data={data}
          cellProps={renderContentMobile}

          header={(p) => {

            return <>
              <p style={{ marginLeft: 10 }}>{p.headerTitleProps.value}</p>
              <div style={{ display: 'flex', gap: 10, marginRight: 10 }}>
                <Button onClick={() => {
                  setDate(new Date(date.getFullYear(), date.getMonth() - 1, date.getDate()));
                }}><SvgIcon icon={chevronLeftIcon} /></Button>
                <Button onClick={() => {
                  setDate(new Date(date.getFullYear(), date.getMonth() + 1, date.getDate()));
                }}><SvgIcon icon={chevronRightIcon} /></Button>
              </div>
            </>
          }}
          min={new Date(date.getFullYear(), date.getMonth(), 1)}
          max={new Date(date.getFullYear(), date.getMonth() + 1, 0)}
          onChange={(ev) => {
            setMobileSelectedDate(ev.value);
          }}
          isFinalized={!props.forcePerson && isFinalized}
        />
        {
          mobileSelectedDate && getCrudMobile()
        }
      </>
      )}
    </>
  );
}
