import React from "react";
import { deviceService } from "../../services/deviceService";
import GridTable from 'common/Table'
import { filePdfIcon } from 'common/icons';
import SvgIcon from 'common/SvgIcon';
import Button from 'common/Button';
import fileService from 'common/services/FileService';

export function DeviceHistory(props:{id:number}){

    const columns = [
        { key: "Person.firstName", label: "Nome", type: "string", sortable: false  },
        { key: "Person.lastName", label: "Cognome", type: "string", sortable: false  },
        { key: "allocation_date", label: "Data assegnazione", type: "custom", sortable: true, 
            render:(row)=>{
                return <td>
                        {new Date(row.allocation_date).toLocaleDateString()}
                        {
                            row.waiver? <Button themeColor="error" fillMode="clear" size="small" 
                                onClick={() => fileService.openFromBE(row.waiver)}>
                                    <SvgIcon size="large" icon={filePdfIcon} />
                                </Button>
                              :null
                        }
                    </td>
            }
         },
         { key: "restituition_date", label: "Data restituzione", type: "custom", sortable: false, 
            render:(row)=>{
                if(row.restituition_date)
                    return <td>
                        {new Date(row.restituition_date).toLocaleDateString()}
                        {
                            row.receipt ? <Button themeColor="error" fillMode="clear" size="small"  onClick={() => fileService.openFromBE(row.receipt)}>
                                <SvgIcon size="large" icon={filePdfIcon} />
                            </Button>
                              :null
                        }
                        </td>;
                return <td>Ancora assegnato</td>
            }
         },
    ];
      
    const loadData = (
        pagination: any,
        filter: any,
        sorting: any[],
      )=>{
       return  deviceService.searchHistory(props.id,pagination.currentPage,pagination.pageSize,filter,sorting,undefined,true)
    }



    return <GridTable
        
            filterable={true}
            sortable={true}
            getData={loadData}
            columns={columns}
            
        />

}