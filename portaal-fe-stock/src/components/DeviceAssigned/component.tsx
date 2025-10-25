import React, { useState } from "react";
import GridTable from "common/Table";
import { deviceService } from "../../services/deviceService";
import { CellCheckbox } from "./CellCheckbox";
import Button from 'common/Button';
import SvgIcon from 'common/SvgIcon';
import {clockArrowRotateIcon} from 'common/icons';
import Modal from 'common/Modal';
import { DeviceHistory } from "../DeviceHistory/component";

export  function DeviceAssigned(props:{user:number}){

    const [historyId,setHistoryId] = useState<number>()

    const columns = [
        { key: "model", label: " ", type: "custom", sortable: false, width:'35px', render:(row)=> <CellCheckbox idGroup={props.user} row={row} />},
        { key: "Stock.model", label: "Modello", type: "string", sortable: true, filter: "text" },
        { key: "Stock.serial_number", label: "Seriale", type: "string", sortable: true, filter: "text" },
        { key: "Stock.DeviceType.name", label: "Tipo dispositivo", type: "string", sortable: false},
        { key: "Stock.id", label:"Storico",type:"custom", render:(row)=>{
            return <td>
                <Button themeColor="secondary" fillMode="clear" size="small" onClick={() => {
                                setHistoryId(row.Stock.id);
                              }}><SvgIcon size="large" icon={clockArrowRotateIcon} /> Visualizza Storico</Button>
            </td>
        }}
    ];
      
    const loadData = (
        pagination: any,
        filter: any,
        sorting: any[],
      )=>{
       return deviceService.searchAssignedByUser(props.user,pagination.currentPage,pagination.pageSize,filter,sorting,undefined,true)
    }


    return <><GridTable
        
        filterable={true}
        sortable={true}
        getData={loadData}
        columns={columns}
        resizableWindow={true}
        initialHeightWindow={800}
        draggableWindow={true}
        initialWidthWindow={900}
        resizable={true}
        
    />
    <Modal
        title="Visualizza Storico"
        isOpen={!!historyId}
        onClose={()=>setHistoryId(undefined)}
        width="100%"
        height="100%"
    >
        {historyId && <DeviceHistory id={historyId} />}
    </Modal>
    </>
   
   
}