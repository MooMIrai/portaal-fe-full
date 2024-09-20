import React, { useCallback, useEffect, useState } from "react";
import Calendar from "common/Calendar";
import CalendarMobile from "common/CalendarMobile";
import Button from "common/Button"
import { TimesheetsService } from "../../services/rapportinoService";
import { useWindowSize } from "@uidotdev/usehooks";
import RapportinoCrud from "../RapportinoCrud/component";
import withScheduler from "common/hoc/SchedulerItem"

const RapportinoItemView = (props: any) => {

  let bg:string|undefined = undefined;
  let color:string|undefined = undefined;
  let status='';
  if(props.request){
    if(props.request.approved===null){
      bg = 'rgb(255, 192, 0)';
      color='black';
      status='(Da approvare)'
    }else if(props.request.approved){
      bg='green';
      status='(Approvata)'
    }else{
      bg='red'
      status='(Rifiutata)'
    }
  }

  return <div style={{
    color:color,
    background:bg,
    width: "100%",
    height:"100%",
    position: "absolute",
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
    textAlign: "center",
    display:'flex',
    alignItems:'center',
    justifyContent:'center'
  }}>{!props.request?`${props.hours} ore - `:null} {props.title} {status}  {props.request && props.request.approved===null?
    <button style={{background:'transparent',border:'none',cursor:'pointer'}} title={"Cancella richiesta "+ props.title} onClick={(e)=>{e.preventDefault();
      
    }}>
      <svg style={{marginLeft:10}}  width="20px" height="20px" viewBox="0 0 1024 1024" fill="#000000" className="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M32 241.6c-11.2 0-20-8.8-20-20s8.8-20 20-20l940 1.6c11.2 0 20 8.8 20 20s-8.8 20-20 20L32 241.6zM186.4 282.4c0-11.2 8.8-20 20-20s20 8.8 20 20v688.8l585.6-6.4V289.6c0-11.2 8.8-20 20-20s20 8.8 20 20v716.8l-666.4 7.2V282.4z" fill="" /><path d="M682.4 867.2c-11.2 0-20-8.8-20-20V372c0-11.2 8.8-20 20-20s20 8.8 20 20v475.2c0.8 11.2-8.8 20-20 20zM367.2 867.2c-11.2 0-20-8.8-20-20V372c0-11.2 8.8-20 20-20s20 8.8 20 20v475.2c0.8 11.2-8.8 20-20 20zM524.8 867.2c-11.2 0-20-8.8-20-20V372c0-11.2 8.8-20 20-20s20 8.8 20 20v475.2c0.8 11.2-8.8 20-20 20zM655.2 213.6v-48.8c0-17.6-14.4-32-32-32H418.4c-18.4 0-32 14.4-32 32.8V208h-40v-42.4c0-40 32.8-72.8 72.8-72.8H624c40 0 72.8 32.8 72.8 72.8v48.8h-41.6z" fill="" /></svg>
    </button>:null}</div>
}
const RapportinoItem = withScheduler(RapportinoItemView)

export default function RapportinoCalendar() {
  const [date, setDate] = useState<Date>(new Date());
  const [data, setData] = useState<any>([]);
  const [holidays,setHolidays] = useState<Array<number>>();
  const [value, setValue] = React.useState<Date | null>(new Date());
  const [timeSheetsId, setTimeSheetsId] = useState<number>();
  const size = useWindowSize();

  const convertToISODateString = (year, month, day, hour, minute) => {
    const date = new Date(Date.UTC(year, month - 1, day, hour, minute, 0, 0));

    return date.toISOString();
  };


  function mergeRequests(data) {
    const mergedRequests:any[] = [];
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

  const fetchTimesheet = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    TimesheetsService.findOrCreate(8, year, month, "")
      .then((response) => {
        setTimeSheetsId(response.id);
        setHolidays(response.holidays);
        TimesheetsService.getSingleTimesheets(response.id, true).then((res) => {
          let activities: any = [];

          res?.TimesheetDetail.forEach((el) => {

            if (el) {
              activities.push({
                request:el.LeaveRequest,
                activity:el.PersonActivity.Activity,
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
          console.log(mergeRequests(activities))
          setData(mergeRequests(activities));
        });
      })
      .catch((error) => {
        console.error("Errore:", error);
      });
  };

  const onActivitiesAdded = () => {
    fetchTimesheet(date);
  }

  const handleDateChange = useCallback(
    (event: any) => {
      const dateObject = new Date(event.value);
      fetchTimesheet(dateObject);
      setDate(event.value);
    },
    [setDate]
  );

  const handleChange = (event: any) => {
    setValue(event.value);
  };

  useEffect(() => {
    fetchTimesheet(new Date());
  }, []);

 

  const renderContent = (slot, closeModalCallback) => {
 
    const dates:Date[] = [];
    let currentDate = new Date(slot.start);
    const values={};
    const holidaysData={};

    let hasHolidayInSelection=false;
    while (currentDate < slot.end) {
        if(!hasHolidayInSelection && holidays?.some(h=>h===currentDate.getDate())){
          hasHolidayInSelection=true;
        }
        dates.push(new Date(currentDate));
        const valuesByDate = data.filter((el) => el.day === currentDate.getDate());
        //prendere i dati per riempire le ore dentro il crud
        if(valuesByDate){
          values[currentDate.getDate()]={};
          valuesByDate.forEach((el)=>{
            values[currentDate.getDate()][el.activity.id]=el.hours;
          });
        }
        
        //Prendere orari dei permessi per riempire i timepicker dentro il crud
        data.filter((el)=>{
          if(!el.request){
            return false
          }
          let startDate = new Date(el.request.start_date);
          startDate.setHours(0,0,0,0);
          let endDate = new Date(el.request.start_date);
          endDate.setHours(23,59,59,59);
          return currentDate>= startDate && currentDate<=endDate;
        }).forEach(hol=>{
          if(!holidaysData[currentDate.getDate()])
          {
            holidaysData[currentDate.getDate()]={};
          }
          holidaysData[currentDate.getDate()][hol.activity.id]={start:new Date(hol.request.start_date),end:new Date(hol.request.end_date)}
        });

        currentDate.setDate(currentDate.getDate() + 1); // Incrementa di un giorno
        
    }

    return {
      component: (
        <RapportinoCrud
          dates={dates}
          timesheetId={timeSheetsId||0}
          values={values}
          hasHoliday={hasHolidayInSelection}
          closeModal={closeModalCallback}
          holidaysData={holidaysData}
          //onClose={closeModalCallback}
          //onActivitiesAdded={onActivitiesAdded}
        />
      ),
      title: dates[0]?.toLocaleDateString("it-IT") + ' - ' + dates[dates.length-1]?.toLocaleDateString("it-IT") || "",
    };
  };

 

  return (
    <>
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
        />
      ) : (
        <CalendarMobile
          topView="month"
          navigation={true}
          focusedDate={date}
          data={data}
          content={renderContent}
        />
      )}
    </>
  );
}
