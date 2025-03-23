import React, { useEffect, useState } from "react";
import InputText from "common/InputText"
import Accordion from "common/Accordion"
import { salService } from "../../services/salService";
import Button from 'common/Button';
import { calendarIcon } from 'common/icons'
import Modal from 'common/Modal';
import RapportinoCalendar from "hr/RapportinoCalendar";

type MoneyInputSalProps=any & {options:{project:any,sal:any}}

export function MoneyInputSal(props:MoneyInputSalProps)
{
    const [workingDays,setWorkingDays] = useState<number>();
    const [person,setPerson] = useState<Array<any>>();
    const [effectiveDays,setEffectiveDays] = useState<number | undefined>(props.value?.actualDays);
    const [effectiveDaysPristine,setEffectiveDaysPristine] = useState<boolean>(!!props.value?.actualDays);
    const [finalAmount,setFinalAmount] = useState<number | undefined>(props.value?.amount);
    
    const [isFirstloading,setIsFirstloading] = useState<boolean>(true);
    
    const [rapportinoViewParam,setRapportinoViewParam] = useState<{
        person:{
            id:number,
            name:string
        },
        date:Date
    }>()

    useEffect(()=>{
        setTimeout(()=>{setIsFirstloading(false)},500)
    },[]);//accrocchio ma non sapevo come fare in modo veloce

    useEffect(()=>{

        if(props.options.sal && props.options.sal.monthyear && props.options.project){
            //setEffectiveDaysPristine(false)
            salService.getSalWorkedDays(props.options.project.id,props.options.sal.monthyear.getMonth()+1,props.options.sal.monthyear.getFullYear())
            .then(res=>{
                if(res.data){
                    const person = res.data.map(d=>{
                        return {
                            ...d.person,
                            detail:d.detail,
                            total:d.detail.reduce((accumulator, currentValue) => {
                                return accumulator + ((currentValue.minutes / 60) + (currentValue.hours) / 8)
                              },0)
                        }
                    });
                    const allPersonSum = person.reduce((accumulator, currentValue) => {
                        return accumulator + currentValue.total
                      },0);
                    setWorkingDays(allPersonSum);
                    setPerson(person);
                }
            })
        }
    },[props.options.sal,props.options.project]);

    useEffect(()=>{
    
        if(!effectiveDaysPristine){
            setEffectiveDays(workingDays);
        }
    },[workingDays])

    useEffect(()=>{
        props.onChange({value:{
            effectiveDays,
            finalAmount
        }});
        if(!isFirstloading)
            setFinalAmount(props.options.project.rate * (effectiveDays || 0));
    },[effectiveDays])

    useEffect(()=>{
        props.onChange({value:{
            effectiveDays,
            finalAmount
        }})
    },[finalAmount]);

    if(!props.options.project || !props.options.sal || !props.options.sal.monthyear){
        return <span>Seleziona anno mese</span>
    }

    return <div>
        {
            person && person.length ? <Accordion title="Dettaglio lavoro dipendente" defaultOpened={false} >
                <div className="k-grid k-grid-md">
                    <table className="k-table k-grid-header-table k-table-md">
                        <thead className="k-table-thead">
                            <tr className="k-table-row">
                                <th className="k-table-th k-header">Nominativo</th>
                                <th className="k-table-th k-header">Giorni</th>
                                <th className="k-table-th k-header">Rapportino</th>
                            </tr>
                        </thead>
                        <tbody className="k-table-tbody">
                            {person.map(p=><tr className="k-table-row" key={p.id}>
                                <td className="k-table-td">{p.first_name} {p.last_name}</td>
                                <td className="k-table-td">{p.total} Giorni</td>
                                <td className="k-table-td"><div>
                                <Button
                                    type="button"
                                    svgIcon={calendarIcon}
                                    themeColor={"outline"}
                                    onClick={() => {
                                        setRapportinoViewParam({
                                            date:new Date(props.options.sal.monthyear),
                                            person:{
                                                name:p.first_name + ' ' + p.last_name,
                                                id:p.id
                                            }
                                        })
                                    }}
                                >
                                    
                                </Button>
                                </div></td>
                                </tr>)}
                        </tbody>
                    </table>
                </div>
                
            </Accordion>:null

        }
        {
            props.options.project.Offer.ProjectType.code === "CONS"?
            <div>
                <InputText label="Giorni Lavorati Sal"  type="number" value={workingDays} disabled /> 
                <InputText label="Giorni Effettivi Sal" onChange={(e)=>{
                    setEffectiveDaysPristine(true);
                    let v = e.target.value && e.target.value.length?parseInt(e.target.value):undefined;
                    setEffectiveDays(v);
                   
                }} required type="number" value={effectiveDays} disabled={props.disabled} />
                <InputText label="Tariffa Sal" type="number" value={props.options.project.rate} disabled />
            </div>
            :null
        }
        
        <InputText required label="Importo Sal" type="number" value={finalAmount} onChange={(e)=>{
            let v = e.target.value && e.target.value.length?parseInt(e.target.value):undefined;
            setFinalAmount(v);
        }} disabled={props.disabled} />
        
        {rapportinoViewParam && <Modal title={"Rapportino di " + rapportinoViewParam.person.name }
            isOpen={rapportinoViewParam}
            onClose={() => setRapportinoViewParam(undefined)}
            width="100%"
            height="100%">
                <RapportinoCalendar forcePerson={{ id: rapportinoViewParam.person.id, name: rapportinoViewParam.person.name }} forceDate={rapportinoViewParam.date} />
        </Modal>}
    </div>

}


