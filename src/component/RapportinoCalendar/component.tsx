import React, { useCallback, useEffect, useState } from "react";
import Calendar from "common/Calendar";
import CalendarMobile from "common/CalendarMobile";

import { TimesheetsService } from "../../services/rapportinoService";
import { useWindowSize } from "@uidotdev/usehooks";
import RapportinoCrud from "../RapportinoCrud/component";

export default function RapportinoCalendar() {
  const [date, setDate] = useState<Date>(new Date());
  const [data, setData] = useState<any>([]);
  const [value, setValue] = React.useState<Date | null>(new Date());
  const [timeSheetsId, setTimeSheetsId] = useState<number>();
  const size = useWindowSize();

  const convertToISODateString = (year, month, day, hour, minute) => {
    const date = new Date(Date.UTC(year, month - 1, day, hour, minute, 0, 0));

    return date.toISOString();
  };

  const fetchTimesheet = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    TimesheetsService.findOrCreate(8, year, month, "")
      .then((response) => {
        setTimeSheetsId(response.id);
        TimesheetsService.getSingleTimesheets(response.id, true).then((res) => {
          let activities: any = [];

          res?.TimesheetDetail.forEach((el) => {

            if (el) {
              activities.push({
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

          setData(activities);
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
    while (currentDate < slot.end) {
        dates.push(new Date(currentDate));
        const valuesByDate = data.filter((el) => el.day === currentDate.getDate());
        if(valuesByDate){
          values[currentDate.getDate()]={};
          valuesByDate.forEach((el)=>{
            values[currentDate.getDate()][el.activity.id]=el.hours;
          });
        }
        currentDate.setDate(currentDate.getDate() + 1); // Incrementa di un giorno
        
    }

    return {
      component: (
        <RapportinoCrud
          dates={dates}
          timesheetId={timeSheetsId||0}
          values={values}
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
          timezone="Europe/Rome"
          handleDateChange={handleDateChange}
          defaultView="month"
          handleDataChange={() => { }}
          data={data}
          contentModal={renderContent}
          
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
