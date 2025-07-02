import Accordion from 'common/Accordion'
import React, { PropsWithChildren, useEffect, useState } from 'react'
import { TimesheetsService } from '../../services/rapportinoService';
import { sortBy } from "lodash";
import InputText from 'common/InputText';
import Button from 'common/Button';
import CustomChip from 'common/CustomChip';
import NotificationActions from 'common/providers/NotificationProvider';
import { checkCircleIcon } from "common/icons";


import styles from './styles.module.scss';

const MAX_HOURS = process.env.MAXIMUM_HOURS_WORK;

export const dateWithoutTimezone = (date: Date) => {
    const tzoffset = date.getTimezoneOffset() * 60000; //offset in milliseconds
    const withoutTimezone = new Date(date.valueOf() - tzoffset)
        .toISOString()
        .slice(0, -1);
    return withoutTimezone;
};

interface RapportinoCrudProps {

    dates: Date[];
    timesheetId: number;
    values: Record<number, Record<string, number>>;
    assignment_values: Record<number, Record<string, number>>;
    hasHoliday: boolean;
    closeModal: () => void;
    holidaysData: Record<number, Record<string, { hours: number, name: string, approved: Date }[]>>;
    editLocked?: boolean;
}

function RapportinoInput(props: PropsWithChildren<{
    id: number,
    description: string,
    value: number,
    onChange: (value: number) => void,
    type: "H" | "D",
    disabled: boolean
}>) {

    useEffect(() => {
        if (props.value === 8 && props.type === 'D') {
            props.onChange(8);
        }
    }, [props.value])


    return <div className={styles.rapportinoContainer}>
        <p>{props.description}</p>
        {props.type === 'H' ? <InputText style={{width: "65px"}} disabled={props.disabled} value={props.value} clearable onChange={(e) => {
            if (e.value.length)
                props.onChange(parseInt(e.value))
            else
                props.onChange(0)
        }} /> :
            <input type='checkbox' disabled={props.disabled} style={{ width: 20, height: 20 }} checked={props.value === 8} onChange={(ev) => {
                if (ev.target.checked) {
                    props.onChange(8)
                } else {
                    props.onChange(0)
                }
            }}></input>

        }
    </div>

}


export default function RapportinoCrud(props: RapportinoCrudProps) {

    const [data, setData] = useState<Record<string, any>>();
    const [values, setValues] = useState<Record<number, number>>({});
    const [personActivityvalues, setPersonActivityValues] = useState<Record<number, number>>({});
    const [personActivityNotes, setPersonActivityNotes] = useState<string>();
    const [holidayDetails, setHolidayDetails] = useState<number[]>([]);
    const [errors, setErrors] = useState<string>();
    const [disableExcept, setDisableExcept] = useState();

    const updateData = () => {
        return TimesheetsService.getActivitiesByListDates(props.dates, props.timesheetId).then(res => {
            setData(res);
        });
    }

    useEffect(() => {
        if (props.dates && props.dates.length) {
            updateData().then(() => {
                if (props.values) {
                    if (Object.keys(props.values).length === 1) {
                        let day = Object.keys(props.values)[0];
                        let ids = Object.keys(props.values[day]);
                        let newObj = {};
                        ids.forEach((id: string) => {
                            let isApprovedHoliday = !!(props.holidaysData[day] && props.holidaysData[day][id]?.every(h => h.approved));
                            if (!isApprovedHoliday) {
                                newObj[id] = props.values[day][id];
                            }
                        })
                        setValues(newObj);
                    }
                }
                if (props.assignment_values) {

                    if (Object.keys(props.assignment_values).length === 1) {
                        let day = Object.keys(props.assignment_values)[0];
                        let ids = Object.keys(props.assignment_values[day]);
                        let newObj = {};
                        ids.forEach((id: string) => {

                            let isApprovedHoliday = !!(props.holidaysData[day] && props.holidaysData[day][id]?.every(h => h.approved));
                            if (!isApprovedHoliday) {
                                newObj[id] = props.assignment_values[day][id];
                            }

                            const notes = props.holidaysData?.[day]?.[id]?.find(request => request.notes)?.notes;
                            if (notes) setPersonActivityNotes(notes);

                            const isHoliday = props.holidaysData?.[day]?.[id];
                            if (isHoliday) setHolidayDetails(holidayDetails => [...holidayDetails, Number(id)]);

                        });
                        setPersonActivityValues(newObj);
                    }

                }
            });
        }
    }, [props.dates]);

    useEffect(() => {
        const filteredKeys = Object.keys(values).filter(k => values[k] !== 0);
        if (Object.keys(values).length != filteredKeys.length) {
            const newVal = {};
            filteredKeys.forEach(k => { newVal[k] = values[k] });
            setValues(newVal)
        } else {
            let validatorsMessage = validateMaxHours();
            setErrors(validatorsMessage);
        }

    }, [values])



    const onInputChange = (activityId: number, hours: number, personActivityId:number) => {

        const newValues = JSON.parse(JSON.stringify(values));
        newValues[activityId] = hours;
        setValues(newValues);
        const newValuesPA = JSON.parse(JSON.stringify(personActivityvalues));
        newValuesPA[activityId] = personActivityId;
        setPersonActivityValues(newValuesPA);
    }

    const validateMaxHours = () => {
        if (MAX_HOURS && !disableExcept) {
            let sum = 0;
            if (values) {
                Object.keys(values).forEach((key) => sum += values[key]);
            }

            if (sum > parseInt(MAX_HOURS)) {
                return "\n Hai superato il limite massimo di " + MAX_HOURS + " proseguendo registrerai degli straordinari.";
            }
        }
        return "";
    }

    const handleSave = (holidayConfirm: boolean) => {

        TimesheetsService.saveActivities(
            props.timesheetId, dateWithoutTimezone(props.dates[0]),
            dateWithoutTimezone(props.dates[props.dates.length - 1]),
            Object.keys(values).filter(key => {
                return !disableExcept || key == disableExcept
            }).map((key) => {

                return {
                    person_activity_id:personActivityvalues[key],
                    activity_id: parseInt(key),
                    hours: values[key],
                    minutes: 0,
                    notes: holidayDetails.includes(parseInt(key)) ? personActivityNotes : undefined
                }
            }),
            holidayConfirm
        ).then(res => {
            NotificationActions.openModal(
                { icon: true, style: "success" },
                "Operazione avvenuta con successo"
            );
            props.closeModal();
        })
    }

    const getApprovedPills = () => {
        if (props.dates.length === 1) { //this makes sense only when clicking on one day, not multiple
            let day = props.dates[0].getDate();
            let approvedHolidayIds = props.holidaysData[day] ? Object.keys(props.holidaysData[day]).filter(h => props.holidaysData[day][h].find(hol => hol.approved)) : [];
            return <div className={styles.chipsContainer}>
                {approvedHolidayIds.map((id: string) => {
                    let data = props.holidaysData[day][id].filter(h => h.approved);
                    return data.map((d, index) => {
                        return <CustomChip
                            key={id + "_" + index}
                            text={d.name + ": " + d.hours + "h"}
                            removable={false}
                            rounded={"small"}
                            fillMode={"solid"}
                            themeColor={"success"}
                            svgIcon={checkCircleIcon}
                        />
                    })
                })}
            </div>
        }
        return null;
    }

    const isHolidayApproved = (id: number) => {
        if (props.dates.length === 1) { //this makes sense only when clicking on one day, not multiple
            let day = props.dates[0].getDate();
            return !!(props.holidaysData[day] && props.holidaysData[day][id]?.find(h => h.approved));
        }
        return false;
    }


    if (!data) {
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
                    !data.productive || !data.productive.length ? <p>Nessun attività produttiva assegnata per il range di date selezionate</p>
                        : <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                            {data.productive.map((res) => {
                                return <RapportinoInput
                                    type='H'
                                    disabled={!!props.editLocked || (!!disableExcept && disableExcept !== res.Activity.id)}
                                    value={values ? values[res.Activity.id] : 0}
                                    key={res.Activity.id}
                                    id={res.Activity.id}
                                    description={res.Activity.description}
                                    onChange={(value) => {
                                        onInputChange(res.Activity.id, value,res.id)
                                    }}
                                />
                            })}
                        </div>
                }
            </Accordion>
            <Accordion title="Non Produttive" defaultOpened={true}>
                {
                    !data.unproductive || !data.unproductive.length ? <p>Nessun attività non produttiva assegnata per il range di date selezionate</p>
                        : <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                            {data.unproductive.map((res) => {
                                return <RapportinoInput
                                    type='H'
                                    disabled={!!props.editLocked || (!!disableExcept && disableExcept !== res.Activity.id)}
                                    value={values ? values[res.Activity.id] : 0}
                                    key={res.Activity.id}
                                    id={res.Activity.id}
                                    description={res.Activity.description}
                                    onChange={(value) => {
                                        onInputChange(res.Activity.id, value,res.id)
                                    }}
                                />
                            })}
                        </div>
                }
            </Accordion>
            <Accordion title="Richiedi P-F-M" defaultOpened={true}>
                {
                    !data.holidays || !data.holidays.length ? <p>Non puoi richiedere ferie o permessi nel range date selezionato</p>
                        : <>
                            {getApprovedPills()}
                            <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                                {sortBy(data.holidays, ["Activity.ActivityType.time_unit"]).map((res) => {
                                    return <RapportinoInput
                                        disabled={!!props.editLocked || (!!disableExcept && disableExcept !== res.Activity.id) || (data.holidays.some(res => res.Activity.ActivityType.time_unit === 'D' && isHolidayApproved(res.Activity.id)))}
                                        type={res.Activity.ActivityType.time_unit}
                                        value={values ? values[res.Activity.id] : 0}
                                        key={res.Activity.id}
                                        id={res.Activity.id}
                                        description={res.Activity.description}
                                        onChange={(value) => {
                                            if (res.Activity.ActivityType.time_unit === 'D') {
                                                if (value !== 0)
                                                    setDisableExcept(res.Activity.id)
                                                else
                                                    setDisableExcept(undefined);
                                            }
                                            onInputChange(res.Activity.id, value,res.id);
                                            setHolidayDetails(holidayDetails => [...holidayDetails, res.Activity.id]);
                                        }}

                                    />
                                })}
                            </div>
                        </>
                }
                <div className={styles.leaveRequestNotes} onKeyDown={e => e.stopPropagation()}>
                    <label htmlFor='LeaveRequestNotes'>Note</label>
                    <textarea maxLength={255} id='LeaveRequestNotes' value={personActivityNotes}
                    onChange={e => setPersonActivityNotes(e.target.value)}
                    />
                </div>
            </Accordion>
        </div>
        {
            !props.editLocked ? <div className={styles.footer}>
                <Button themeColor="success" onClick={() => {
                    if (props.hasHoliday) {
                        NotificationActions.openConfirm('Vuoi includere i giorni festivi compresi nella tua selezione?',
                            () => handleSave(true),
                            'Conferma azione',
                            () => handleSave(false)
                        )
                    } else {
                        handleSave(false)
                    }
                }}>Conferma</Button>
            </div> : <div className={styles.footer}>
                <Button themeColor="primary" onClick={() => {
                    props.closeModal();
                }}>Chiudi</Button>
            </div>
        }

    </div>

}