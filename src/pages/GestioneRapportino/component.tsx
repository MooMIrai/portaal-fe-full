import React, { useState, useCallback, useRef } from "react";
import { mapKeys, pick, sortBy } from "lodash";
import GridTable from "common/Table";
import * as XLSX from "common/xlsx";
import { TimesheetsService } from "../../services/rapportinoService";
import Typography from 'common/Typography';
import { GestioneRapportinoInner } from "../../component/GestioneRapportinoInner/component";
import Button from 'common/Button';
import Modal from 'common/Modal';
import { unlockIcon, lockIcon, calendarIcon, calculatorIcon } from "common/icons";
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
                    {data.finalized ? <Button disabled={!data.timesheet_id} svgIcon={unlockIcon} themeColor="error" onClick={() => {
                        TimesheetsService.deconsolidateTimesheet(data.timesheet_id).finally(tableGestioneRapportino.current.refreshTable)
                    }}>Deconsolida</Button> :
                        <Button svgIcon={lockIcon} disabled={!data.timesheet_id} themeColor="success" onClick={() => {
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

    const filterInitialValues = {
        year: new Date().getFullYear()
    };

    const loadData = async (
        pagination: any,
        filter: any,
        sorting: any[],
    ) => {

        let f = JSON.parse(JSON.stringify(filter));

        let year = currentYear;
        let month = currentMonth;
        
        if (filter && filter.filters) {
            
            f.filters = filter.filters.filter(f => f.field != 'year' && f.field != 'month');
            const monthFilter = filter.filters.find(f => f.field === 'month');
            if (monthFilter) {
                month = monthFilter.value ;
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
            month+1
        );


        return {
            data: tableResponse.data.map((d: any) => ({ ...d, gridtable_expanded: opened.some(c => c === d.id) })),
            meta: tableResponse.meta

        }

    };

    const renderExpand = useCallback((rowProps) => (
        <GestioneRapportinoInner id={rowProps.dataItem.timesheet_id} />
    ), [tableGestioneRapportino.current]);

    
    const createReport = async () => {

        function getOrigin (worksheet: any, blankRows: number) {
            const range = XLSX.utils.decode_range(worksheet["!ref"]!);
            const origin = XLSX.utils.encode_cell({r: range.e.r + 1 + blankRows, c: 0});
            return origin;
        }

        function getMonthHeader () {
            const date = new Date(currentYear, currentMonth);
            const month = date.toLocaleDateString("it-IT", {month: "long"});
            const dateString = `${month.toUpperCase()} ${currentYear}`;
            return dateString;
        }

        function setWidth (worksheet: any) {

            const range = XLSX.utils.decode_range(worksheet["!ref"]!);
            const numRows = range.e.r + 1;
            const numColumns = range.e.c + 1;

            const maxWidths: Array<{wch: number}> = [];

            for (let column = 0; column < numColumns; column++) {

                let maxWidth = 0;

                for (let row = 0; row < numRows; row++) {
                    const address = XLSX.utils.encode_cell({r: row, c: column});
                    const value = worksheet[address]?.v;
                    const width = value ? String(value).length : 1;
                    maxWidth = width > maxWidth ? width : maxWidth;

                }

                maxWidths.push({wch: maxWidth + 1});
            }

            worksheet['!cols'] = maxWidths;
        }

        const reportData = await TimesheetsService.getReport(currentMonth + 1, currentYear);
        const reports_by_company = reportData.report;
        const holidays_table = reportData.holidaysKey;
        const workbook = XLSX.utils.book_new();

        Object.entries(reports_by_company).forEach(([company, report]) => {

            const holidayReport = sortBy(report.holidayReport, (o => o.nominativo.toLowerCase()));
            let calendarReport = report.calendarReport;

            const monthHeader = getMonthHeader();
            for (const holidayRow of holidayReport) {
    
                calendarReport = calendarReport.map(calendarRow => {
                    if (!calendarRow[holidayRow.nominativo]) calendarRow[holidayRow.nominativo] = null;
                    return calendarRow;
                });
    
            }
            calendarReport = calendarReport.map(row => {
                const day = row["day"];
                delete row["day"];
                const sorted_row = pick(row, sortBy(Object.keys(row), o => o.toLowerCase()));
                return {[monthHeader]: day, ...sorted_row};
            });

            const holiday_worksheet = XLSX.utils.json_to_sheet(
                holidayReport.map(row => mapKeys(row, (_, key) => key.toUpperCase()))
            );

            const calendar_worksheet = XLSX.utils.sheet_add_json(
                holiday_worksheet, 
                calendarReport, 
                {origin: getOrigin(holiday_worksheet, 2)}
            );

            const holiday_key_worksheet = XLSX.utils.sheet_add_json(
                calendar_worksheet, 
                holidays_table.map(row => mapKeys(row, (_, key) => key.toUpperCase())),
                {origin: getOrigin(calendar_worksheet, 3)}
            );

            setWidth(holiday_key_worksheet);

            // Append the worksheet to the workbook
            XLSX.utils.book_append_sheet(workbook, holiday_key_worksheet, company);

        });


        // Export the workbook as an Excel file
        XLSX.writeFile(workbook, "report.xlsx");
    };


    return <div>

        <GridTable
            ref={tableGestioneRapportino}
            className={`text-align-center`}
            filterFormStyle={{alignItems: "unset"}}
            openFilterDefault={true}
            filterInitialValues={filterInitialValues}
            extraButtons={[
                <Button svgIcon={calculatorIcon} onClick={createReport} themeColor={"error"}>Genera Report</Button>
            ]}
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
                    required: true,
                    options: {
                        getData: (term: string) => Promise.resolve([
                            { id: 0, name: "Gennaio" },
                            { id: 1, name: "Febbraio" },
                            { id: 2, name: "Marzo" },
                            { id: 3, name: "Aprile" },
                            { id: 4, name: "Maggio" },
                            { id: 5, name: "Giugno" },
                            { id: 6, name: "Luglio" },
                            { id: 7, name: "Agosto" },
                            { id: 8, name: "Settembre" },
                            { id: 9, name: "Ottobre" },
                            { id: 10, name: "Novembre" },
                            { id: 11, name: "Dicembre" }
                        ].filter(p => !term || p.name.toLowerCase().indexOf(term.toLowerCase()) >= 0)),
                        getValue: (v: any) => v?.id
                    },
                    validator: value => value ? "" : "Completare il campo 'Mese'"
                },
                {
                    name: "year",
                    label: "Anno",
                    required: true,
                    type: "number",
                    validator: value => value ? "" : "Completare il campo 'Anno'"
                },
                {
                    name: "finalized",
                    label: "Stato rapportino",
                    type: "filter-autocomplete",
                    options: {
                        getData: () => Promise.resolve([
                            {id: true, name: "Consolidato"},
                            {id: false, name: "Non consolidato"}
                        ]),
                        getValue: (v: any) => v?.id
                    }
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
            {dataItem && 

                <RapportinoCalendar 
                forcePerson={{id: dataItem.person_id, name: dataItem.first_name + ' ' + dataItem.last_name}} 
                forceDate={new Date(currentYear, currentMonth, 1)} 
                />
            }
        </Modal>

    </div>
}