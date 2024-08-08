import React, { useState, useEffect } from "react";
import GridTable from "common/Table";
import { customerService } from "../../services/clienteService";
import { ClienteCrud } from "../../component/ClienteCrud/component";
import { adaptToCustomerModel } from "../../adapters/clienteAdapters";


const columns = [
    { key: "code", label: "Codice", type: "string", sortable: true, filter: "text" },
    { key: "name", label: "Ragione sociale", type: "string", sortable: true, filter: "text" },
    { key: "email", label: "Email", type: "string", sortable: true, filter: "text" },
    { key: "website", label: "Sito web", type: "string", sortable: true, filter: "text" },
    { key: "vatNumber", label: "P.IVA", type: "string", sortable: true, filter: "numeric" },
    
  ];
  

function Clienti(){
    const [termValue, setTermValue] = useState<string>("");
    const [filter, setFilter] = useState();
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({ currentPage: 1, pageSize: 10 });

    const handleInputSearch = (e: any) => {
        const value = e.target.value || "";
        setTermValue(value);
    };

    const loadData = async (
        pagination: any,
        filter: any,
        sorting: any[],
        term?: string
      ) => {
        const include= true;
       
       const tableResponse= await customerService.getCustomers(
          pagination.currentPage,
          pagination.pageSize,
          filter,
          sorting,
          term,
          include,
        );
        

        return{ 
          data:tableResponse.data.map(adaptToCustomerModel),
          meta: {
            total:tableResponse.meta.model
          }
        }
        
      };

    useEffect(() => {
        loadData(pagination, filter, sorting, termValue)
    }, [pagination, filter, sorting, termValue]);


    const handleFormSubmit = (type: string, formData: any, refreshTable: any, id: any, closeModal:()=>void)=>{
        let promise:Promise<any> = Promise.reject()
        if (type === "create") {
          promise = customerService.createResource(formData);
        } else if (type === "edit") {
          promise =customerService.updateResource(id,formData);
        } else if (type === "delete") {
          promise = customerService.deleteResource(id);
        }

        promise.then(()=>{
          refreshTable();
          closeModal();
        }).catch((e)=>{
          alert('errore ' + e.message)
        })
        
      
    }

    return <GridTable
    inputSearchConfig={{
      inputSearch: termValue,
      handleInputSearch: handleInputSearch,
      debouncedSearchTerm: termValue,
    }}
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
        <ClienteCrud
                row={row}
                type={type}
                closeModalCallback={closeModalCallback}
                refreshTable={refreshTable}
                onSubmit={handleFormSubmit}
              />
      </>
    )}
  />


}

export default Clienti