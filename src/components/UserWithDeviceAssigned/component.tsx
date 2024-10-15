import React from 'react'
import { deviceService } from '../../services/deviceService'
import GridTable from 'common/Table';
import { DeviceAssigned } from '../DeviceAssigned/component';
import { DeviceAssignedProvider } from './context';
import { UnassignDevices } from '../UnassignDevice/component';

export function UserWithDeviceAssigned(){

    const columns = [
       
        { key: "firstName", label: "Nome", type: "string", sortable: true, filter: "text" },
        { key: "lastName", label: "Cognome", type: "string", sortable: true, filter: "text" },
        { key: "id", label: "email", type: "custom", sortable: false, render:(row)=><td>{row.Accounts[0].email}</td> }
    ];

    const loadData = (
        pagination: any,
        filter: any,
        sorting: any[],
      )=>{
       return deviceService.searchUserWithAllocation(pagination.currentPage,pagination.pageSize,filter,sorting,undefined,true)
    }


    return <DeviceAssignedProvider>
      
        <GridTable
        customToolBarComponent={(refresh)=>{
            return   <UnassignDevices handleRefresh={refresh} />
        }}
        expand={{
            enabled: true,
            render: (rowProps) => <DeviceAssigned user={rowProps.dataItem.id} />
        }}
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
    </DeviceAssignedProvider>
}