import React, { useState, useCallback, useRef } from "react";
import GridTable from "common/Table";
import { TimesheetsService } from "../../services/rapportinoService";
import Typography from 'common/Typography';
import { GestioneRapportinoInner } from "../../component/GestioneRapportinoInner/component";
import Button from 'common/Button';
import Modal from 'common/Modal';
import { unlockIcon, lockIcon, calendarIcon } from "common/icons";
import RapportinoCalendar from "../../component/RapportinoCalendar/component";

export function GestioneRapportinoPage() {

    const tableGestioneRapportino = useRef<any>();

    const columns = [
        { key: "first_name", label: "Nome", type: "string", sortable: true, filter: "text" },
        { key: "last_name", label: "Cognome", type: "string", sortable: true, filter: "text" },
        { key: "workedHours", label: "Ore lavorate", type: "number" },
        {
            key: "id", label: " ", type: 'custom', width: 250, render: (data) => {
                return <td>
                    {data.finalized ? <Button svgIcon={unlockIcon} themeColor="error" onClick={() => {
                        TimesheetsService.deconsolidateTimesheet(data.timesheet_id).finally(tableGestioneRapportino.current.refreshTable)
                    }}>Deconsolida</Button> :
                        <Button svgIcon={lockIcon} themeColor="success" onClick={() => {
                            TimesheetsService.finalizeTimesheet(data.timesheet_id).finally(tableGestioneRapportino.current.refreshTable)
                        }}>Consolida</Button>
                    }
                    <Button style={{marginLeft:10}} svgIcon={calendarIcon} themeColor="info" onClick={() => {
                        setDataItem(data)
                    }}>Visualizza</Button>
                </td>
            }
        }
    ];
    const [opened, setOpened] = useState<number[]>([]);
    const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
    const [dataItem, setDataItem] = useState<any>(undefined);

    const loadData = async (
        pagination: any,
        filter: any,
        sorting: any[],
    ) => {

        let f = JSON.parse(JSON.stringify(filter));

        let year = currentYear;
        let month = currentMonth + 1;
        
        if (filter && filter.filters) {
            
            f.filters = filter.filters.filter(f => f.field != 'year' && f.field != 'month');
            const monthFilter = filter.filters.find(f => f.field === 'month');
            if (monthFilter) {
                month = monthFilter.value;
                setCurrentMonth(monthFilter.value);
            }
            const yearFilter = filter.filters.find(f => f.field === 'year');
            if (yearFilter) {
                year = yearFilter.value;
                setCurrentYear(yearFilter.value);
            }
        }
        const tableResponse = await TimesheetsService.getGestioneRapportino(
            pagination.currentPage,
            pagination.pageSize,
            f,
            sorting,
            year,
            month
        );


        return {
            data: tableResponse.data.map((d: any) => ({ ...d, gridtable_expanded: opened.some(c => c === d.id) })),
            meta: tableResponse.meta

        }

    };

    const renderExpand = useCallback((rowProps) => (
        <GestioneRapportinoInner id={rowProps.dataItem.timesheet_id} />
    ), [tableGestioneRapportino.current]);



    return <div>

        <GridTable
            ref={tableGestioneRapportino}
            //writePermissions={["WRITE_TIMESHEET_MANAGER"]}
            expand={{
                enabled: true,
                render: renderExpand,
                onExpandChange: (row: any, expanded: boolean) => {
                    if (expanded) {
                        setOpened([...opened, row.id])
                    } else {
                        setOpened(opened.filter(o => o != row.id))
                    }
                }
            }}
            customToolBarComponent={() => <Typography.h5>Dati del: {String(currentMonth + 1).padStart(2, '0')}/{currentYear}</Typography.h5>}
            addedFilters={[
                {
                    name: "month",
                    label: "Mese",
                    type: "filter-autocomplete",
                    options: {
                        getData: (term: string) => Promise.resolve([
                            { id: 1, name: "Gennaio" },
                            { id: 2, name: "Febbraio" },
                            { id: 3, name: "Marzo" },
                            { id: 4, name: "Aprile" },
                            { id: 5, name: "Maggio" },
                            { id: 6, name: "Giugno" },
                            { id: 7, name: "Luglio" },
                            { id: 8, name: "Agosto" },
                            { id: 9, name: "Settembre" },
                            { id: 10, name: "Ottobre" },
                            { id: 11, name: "Novembre" },
                            { id: 12, name: "Dicembre" }
                        ].filter(p => !term || p.name.toLowerCase().indexOf(term.toLowerCase()) >= 0)),
                        getValue: (v: any) => v?.id
                    }
                },
                {
                    name: "year",
                    label: "Anno",
                    type: "number"
                }
            ]}
            filterable={true}
            pageable={true}
            sortable={true}
            getData={loadData}
            columns={columns}
            resizableWindow={true}
            initialHeightWindow={800}
            draggableWindow={true}
            initialWidthWindow={900}
            rowStyle={(rowData) => ({
                background: !rowData.finalized ? 'rgba(255,0,0,0.2)' : 'rgba(0,255,0,0.2)',
            })}
            resizable={true}
            actions={() => []}
           
        />
        <Modal title={dataItem?"Rapportino di " + dataItem.first_name + ' ' + dataItem.last_name:''}
            width="100%"
            height="100%"
            isOpen={dataItem}
            onClose={() => {

                setDataItem(undefined);
                tableGestioneRapportino.current.refreshTable();

            }}>
            {dataItem && <RapportinoCalendar forceTimeSheet={dataItem.timesheet_id} forceDate={new Date(currentYear, currentMonth, 1)} />}
        </Modal>

    </div>
}