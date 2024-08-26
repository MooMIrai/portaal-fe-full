import React, { useEffect, useState } from "react";
import NotificationProviderActions from "common/providers/NotificationProvider";
import GridTable from "common/Table";
import { offertaService } from "../../services/offertaService";
import { fromOfferBEModelToOfferModel } from "../../adapters/offertaAdapters";
import { OffertaCrud } from "../../component/OffertaCrud/component";
import CountrySelector from 'common/CountrySelector';

const columns = [
    { key: "customer_name", label: "Cliente", type: "string", sortable: true, filter: "text" },
    { key: "accountManager.name", label: "Commerciale", type: "string", sortable: true, filter: "text" },
    { key: "protocol", label: "Protocollo", type: "string", sortable: true, filter: "text" },
    { key: "title", label: "Titolo", type: "string", sortable: true, filter: "text" },
    { key: "description", label: "Descrizione", type: "string", sortable: true, filter: "text" },
    { key: "creation_date", label: "Data creazione", type: "date", sortable: true, filter: "date" },
    
  ];
  

export default function OffertePage(){
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
       

       const tableResponse= await offertaService.search(
          pagination.currentPage,
          pagination.pageSize,
          filter,
          sorting,
          term,
          include,
        );
        

        

        return{ 
          data:tableResponse.data.map(fromOfferBEModelToOfferModel),
          meta: {
            total:tableResponse.meta.model
          }
        }
        
      };

    useEffect(() => {
        loadData(pagination, filter, sorting)
    }, [pagination, filter, sorting]);


    const handleFormSubmit = (type: string, formData: any, refreshTable: any, id: any, closeModal:()=>void)=>{
        let promise:Promise<any> | undefined=undefined;
        
        if (type === "create") {
          promise = offertaService.createResource(formData);
        } else if (type === "edit") {
          promise =offertaService.updateResource(id,formData);
        } else if (type === "delete") {
          promise = offertaService.deleteResource(id);
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
    <CountrySelector />
    <GridTable
    /*  inputSearchConfig={{
       inputSearch: termValue,
       handleInputSearch: handleInputSearch,
       debouncedSearchTerm: termValue,
     }} */
     filter={filter}
     setFilter={setFilter}
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
     actions={[
       "show",
       "edit",
       "delete",
       "create",
     ]}
 
     formCrud={(row: any, type: string, closeModalCallback: any, refreshTable: any) => (
       <>
          <OffertaCrud
                 row={row}
                 type={type}
                 closeModalCallback={closeModalCallback}
                 refreshTable={refreshTable}
                 onSubmit={handleFormSubmit}
               /> 
       </>
     )}
   />
</>
}