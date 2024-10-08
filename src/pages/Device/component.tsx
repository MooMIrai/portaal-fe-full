import React from "react";
import GridTable from "common/Table";
import { deviceService } from "../../services/deviceService";
import DeviceCrud from "../../components/DeviceCrud/component";
import NotificationProviderActions from "common/providers/NotificationProvider";
import SignDocumentScanner from 'common/SignDocumentScanner';

export default function DevicePage(){
    const columns = [

        { key: "model", label: "Modello", type: "string", sortable: true, filter: "text" },
        { key: "serial_number", label: "Seriale", type: "string", sortable: true, filter: "text" },
        { key: "DeviceType.name", label: "Tipo dispositivo", type: "string", sortable: false, filter: "text" }
      ];
      
    const loadData = (
        pagination: any,
        filter: any,
        sorting: any[],
      )=>{
       return deviceService.search(pagination.currentPage,pagination.pageSize,filter,sorting,null,true)
    }

    const handleFormSubmit = (type: string, formData: any, refreshTable: any, id: any, closeModal: () => void) => {
      let promise: Promise<any> | undefined = undefined;
  
      if (type === "create") {
        promise = deviceService.createResource(formData);
      } else if (type === "edit") {
        promise = deviceService.updateResource(id, formData);
      } else if (type === "delete") {
        promise = deviceService.deleteResource(id);
      }
  
      if (promise) {
        promise.then(() => {
          NotificationProviderActions.openModal({ icon: true, style: 'success' }, "Operazione avvenuta con successo");
          refreshTable();
          closeModal();
        })
      }
  
    }
  

    return <>
    <SignDocumentScanner 
      name="calogero" surname="miraglia" description="Firma il documento e non rompe" 
      onSign={(data)=>{console.log(data)}}
      onError={(err)=>console.log(err)}
    />
    <GridTable
     filterable={true}
     sortable={true}
     getData={loadData}
     columns={columns}
     resizableWindow={true}
     initialHeightWindow={800}
     draggableWindow={true}
     initialWidthWindow={900}
     resizable={true}
     actions={()=>[
       "create",
       "edit",
       "delete",
       "show"
     ]}
 
     formCrud={(row: any, type: string, closeModalCallback: any, refreshTable: any) => <DeviceCrud 
        row={row}
        type={type} 
        closeModalCallback={closeModalCallback}
        refreshTable={refreshTable}
        onSubmit={handleFormSubmit}
        />}
   />
   </>
}