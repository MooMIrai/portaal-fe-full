import React, { useEffect, useState } from "react";
import NotificationProviderActions from "common/providers/NotificationProvider";
import GridTable from "common/Table";
import { progettoService } from "../../services/progettoSerice";
import { convertProjectBEToProject } from "../../adapters/progettoAdapters";
import OffertePage from "../Offerte/component";
import { customerService } from "../../services/clienteService";

const columns = [
    { key: "accountManager.name", label: "Commerciale", type: "string", sortable: true, filter: "text" },
    { key: "protocol", label: "Protocollo", type: "string", sortable: true, filter: "text" },
    { key: "title", label: "Titolo offerta", type: "string", sortable: true, filter: "text" },
    { key: "description", label: "Descrizione", type: "string", sortable: true, filter: "text" },
    { key: "start_date", label: "Data inizio", type: "date", sortable: true, filter: "date" },
    { key: "end_date", label: "Data fine", type: "date", sortable: true, filter: "date" },
  ];
  

  const columnsCustomer = [

    { key: "name", label: "Cliente", type: "string", sortable: true, filter: "text" },
    
  ];
  


const ProjectTable=(props:{customer:number})=>{
    const [filter, setFilter] = useState();
    const [sorting, setSorting] = useState([]);
    const [pagination] = useState({ currentPage: 1, pageSize: 10 });


    const loadData = async (
        pagination: any,
        filter: any,
        sorting: any[],
        term?: string
      ) => {
        const include= true;
        debugger;
        let correctFilters=JSON.parse(JSON.stringify(filter));
        const customerFilter = {"field":"Offer.customer_id","operator":"equals","value":props.customer};
        if(!correctFilters){
            correctFilters={"logic":"and","filters":[customerFilter]}
        }else{
            correctFilters.logic="and";
            correctFilters.filters.push(customerFilter);
        }
       const tableResponse= await progettoService.search(
          pagination.currentPage,
          pagination.pageSize,
          correctFilters,
          sorting,
          term,
          include,
        );
        
        return{ 
          data:tableResponse.data.map(convertProjectBEToProject),
          meta: {
            total:tableResponse.meta.model
          }
        }
        
      };


    const handleFormSubmit = (type: string, formData: any, refreshTable: any, id: any, closeModal:()=>void)=>{
        let promise:Promise<any> | undefined=undefined;
        
        if (type === "create") {
          promise = progettoService.createResource(formData);
        } else if (type === "edit") {
          promise =progettoService.updateResource(id,formData);
        } else if (type === "delete") {
          promise = progettoService.deleteResource(id);
        }
      

        if(promise){
          promise.then(()=>{
            NotificationProviderActions.openModal({icon:true,style:'success'},"Operazione avvenuta con successo");
            refreshTable();
            closeModal();

          })
        }

    }


    return <>
    <GridTable

     filterable={true}
     initialPagination={pagination}
     sortable={true}
     setSorting={setSorting}
     sorting={sorting}
     getData={loadData}
     columns={columns}
     resizableWindow={true}
     initialHeightWindow={800}
     draggableWindow={true}
     initialWidthWindow={900}
     resizable={true}
     actions={()=>[
       "show",
       "edit",
       "delete",
       
     ]}
 
     formCrud={(row: any, type: string, closeModalCallback: any, refreshTable: any) => (
       <>
          
       </>
     )}
   />
</>
}

export default function ProgettiPage(){
    const [filter, setFilter] = useState();
    const [sorting, setSorting] = useState([]);
    const [pagination] = useState({ currentPage: 1, pageSize: 10 });


    const loadData = async (
        pagination: any,
        filter: any,
        sorting: any[],
        term?: string
      ) => {
       
       const tableResponse= await customerService.getHasProject();
        
        return{ 
          data:tableResponse.data,
          meta: {
            total:tableResponse.data.length
          }
        }
        
      };

    useEffect(() => {
        loadData(pagination, filter, sorting)
    }, [pagination, filter, sorting]);





    return <>
    <GridTable
     expand={{
        enabled:true,
        render:(rowProps)=><ProjectTable customer={rowProps.dataItem.id} />
     }}
     filter={filter}
     setFilter={setFilter}
     filterable={true}
     initialPagination={pagination}
     sortable={true}
     setSorting={setSorting}
     sorting={sorting}
     getData={loadData}
     columns={columnsCustomer}
     resizableWindow={true}
     initialHeightWindow={800}
     draggableWindow={true}
     initialWidthWindow={900}
     resizable={true}


   />
</>
}