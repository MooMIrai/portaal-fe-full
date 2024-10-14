import React, { useState } from "react";
import GridTable from "common/Table";
import { deviceService } from "../../services/deviceService";
import DeviceCrud from "../../components/DeviceCrud/component";
import NotificationProviderActions from "common/providers/NotificationProvider";
import Modal from 'common/Modal';
import Button from 'common/Button'
import { RelateDevice } from "../../components/RelateDevice/component";

export default function DevicePage(){

  const [selectedRows,setSelectedRows] = useState<any[]>([]);
  const [showRelate,setShowRelate] = useState<boolean>(false);
  const [refreshCount,setRefreshCount] = useState<number>(0);

    const columns = [
        { key: "model", label: " ", type: "custom", sortable: false, width:'35px', render:(row,refresh)=> <td >
          {!row.isCurrentlyAssigned && <input title="Seleziona riga" type="checkbox" style={{width:15,height:15}} 
          checked={selectedRows?.some(s=>s.serial_number===row.serial_number)} 
          onChange={()=>{
            if(selectedRows?.some(s=>s.serial_number===row.serial_number)){
              setSelectedRows(selectedRows.filter(s=>s.serial_number!=row.serial_number));
            }else{
              setSelectedRows([...selectedRows,row]);
            }
          }} />}
        </td> },
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
    {/* <SignDocumentScanner 
      name="calogero" surname="miraglia" description="Firma il documento e non rompe" 
      onSign={(data)=>{console.log(data)}}
      onError={(err)=>console.log(err)}
    /> */}
   {/*  <Button onClick={createPdf}>ppp</Button> */}
    <Button themeColor={"success"} disabled={!selectedRows.length} onClick={()=>{setShowRelate(true)}}>Associa dispositivi selezionati</Button>
    <GridTable
     forceRefresh={refreshCount}
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
   <Modal
    title="Associa dispositivi"
    isOpen={showRelate}
    onClose={()=>setShowRelate(false)}
    width="100%"
    height="100%"
   >
      <RelateDevice devices={selectedRows} onSubmit={()=>{
        setShowRelate(false);
        setRefreshCount(refreshCount+1);
      }} />
   </Modal>
   </>
}