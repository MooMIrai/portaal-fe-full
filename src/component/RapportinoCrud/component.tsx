import Accordion from 'common/Accordion'
import React, { PropsWithChildren, useEffect, useState } from 'react'
import { TimesheetsService } from '../../services/rapportinoService';
import InputText from 'common/InputText';
import Button from 'common/Button'
import NotificationActions from 'common/providers/NotificationProvider'

import styles from './styles.module.scss';

const MAX_HOURS=process.env.MAXIMUM_HOURS_WORK;

interface RapportinoCrudProps {
    
    dates: Date[];
    timesheetId: number;
    values:Record<number,Record<string,number>>;
    hasHoliday:boolean
}

function RapportinoInput(props:PropsWithChildren<{id:number,description:string,value:number,onChange:(value:number)=>void}>){


    return <div className={styles.rapportinoContainer}>
        <p>{props.description}</p>
        <InputText value={props.value} onChange={(e)=>{
            if(e.value.length)
                props.onChange(parseInt(e.value))
            else
                props.onChange(0)
        }} />
    </div>

}


export default function RapportinoCrud(props:RapportinoCrudProps){

    const [data,setData] = useState<Record<string,any>>();
    const [values,setValues] = useState<Record<number,number>>({});
    const [errors,setErrors] = useState<string>();

    const updateData = ()=>{
        return TimesheetsService.getActivitiesByListDates(props.dates, props.timesheetId).then(res=>{
            setData(res);
        });
    }

    useEffect(()=>{
        if(props.dates && props.dates.length){
            updateData().then(()=>{
                if(props.values){
                    if(Object.keys(props.values).length===1){
                        setValues(props.values[Object.keys(props.values)[0]])
                    }
                    
                }
            });
        }
    },[props.dates])

    useEffect(()=>{
        let validatorsMessage = validateMaxHours();
        setErrors(validatorsMessage);
        
    },[values])



    const onInputChange = (activityId:number,hours:number)=>{
        const newValues=JSON.parse(JSON.stringify(values));
        newValues[activityId]=hours;
        setValues(newValues);
    }

    const validateMaxHours = ()=>{
        if(MAX_HOURS){
            let sum=0;
            if(values){
                Object.keys(values).forEach((key)=>sum+=values[key]);
            }
            
            if(sum > parseInt(MAX_HOURS)){
                return "\n Hai superato il limite massimo di "+ MAX_HOURS + " proseguendo registrerai degli straordinari.";
            }
        }
        return "";
    }


    if(!data){
        return <p>loading...</p>
    }

    return <div>
            {
                errors && <div className={styles.errorBox}>
                    <p>{errors}</p>
                </div>
            }
            <div className='wrapper'>
            <Accordion title="Produttive" defaultOpened={true}>
                {
                    !data.productive || !data.productive.length ?<p>Nessun attività produttiva assegnata per il range di date selezionate</p>
                    :data.productive.map((res)=>{
                        return <RapportinoInput 
                                    value={values?values[res.Activity.id]:0} 
                                    key={res.Activity.id} 
                                    id={res.Activity.id} 
                                    description={res.Activity.description} 
                                    onChange={(value)=>{
                                        onInputChange(res.Activity.id,value)
                                    }}
                                />
                    })
                }
            </Accordion>
            <Accordion title="Non Produttive" defaultOpened={true}>
                {
                    !data.unproductive || !data.unproductive.length ?<p>Nessun attività non produttiva assegnata per il range di date selezionate</p>
                    :data.unproductive.map((res)=>{
                        return <RapportinoInput 
                                value={values?values[res.Activity.id]:0} 
                                key={res.Activity.id} 
                                id={res.Activity.id} 
                                description={res.Activity.description} 
                                onChange={(value)=>{
                                    onInputChange(res.Activity.id,value)
                                }}
                            />
                    })
                }
            </Accordion>
            <Accordion title="Richiedi P-F-M" defaultOpened={true}>
                {
                    !data.holidays || !data.holidays.length ?<p>Non puoi richiedere ferie o permessi nel range date selezionato</p>
                    :data.holidays.map((res)=>{
                        return <RapportinoInput 
                                    value={values?values[res.Activity.id]:0} 
                                    key={res.Activity.id} 
                                    id={res.Activity.id} 
                                    description={res.Activity.description} 
                                    onChange={(value)=>{
                                        onInputChange(res.Activity.id,value)
                                    }}
                                />
                    })
                    
                }
            </Accordion>
            </div>
            <div className={styles.footer}>
                <Button themeColor="success" onClick={()=>{
                    if(props.hasHoliday){
                        NotificationActions.openConfirm('Vuoi includere i giorni fesivi compresi nella tua selezione?',()=>alert('si'),'Conferma azione')
                    }
                }}>Conferma</Button>
            </div>
            
        </div>

}