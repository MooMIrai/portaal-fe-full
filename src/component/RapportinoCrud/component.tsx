import Accordion from 'common/Accordion'
import React, { useEffect, useState } from 'react'
import { TimesheetsService } from '../../services/rapportinoService';


interface RapportinoCrudProps {
    
    dates: Date[];
    timesheetId: number;
  }
  

export default function RapportinoCrud(props:RapportinoCrudProps){

    const [data,setData] = useState<Record<string,any>>()

    const updateData = ()=>{
        TimesheetsService.getActivitiesByListDates(props.dates, props.timesheetId).then(res=>{
            console.log(res)
            setData(res);
        });
    }

    useEffect(()=>{
        if(props.dates && props.dates.length){
            debugger;
            updateData();
        }
    },[props.dates])

    if(!data){
        return <p>loading...</p>
    }

    return <div className='wrapper'>
        <Accordion title="Produttive" defaultOpened={true}>
            {
                !data.productive || !data.productive.length ?<p>Nessun attività produttiva assegnata per il range di date selezionate</p>
                :<>mo ce penso</>
            }
        </Accordion>
        <Accordion title="Non Produttive" defaultOpened={true}>
            {
                !data.unproductive || !data.unproductive.length ?<p>Nessun attività non produttiva assegnata per il range di date selezionate</p>
                :<>mo ce penso</>
            }
        </Accordion>
        <Accordion title="Richiedi P-F-M" defaultOpened={true}>
            {
                !data.holidays || !data.holidays.length ?<p>Nessun attività non produttiva assegnata per il range di date selezionate</p>
                :<>mo ce penso</>
            }
        </Accordion>
        </div>

}