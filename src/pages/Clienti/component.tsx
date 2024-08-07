import React, { useState, useEffect } from "react";
import GridTable from "common/Table";
import { FORM_TYPE } from "../Personale/formModel";


const columns = [
    { key: "codicecliente", label: "Codice", type: "string", sortable: true, filter: "text" },
    { key: "ragioneSociale", label: "Ragione sociale", type: "string", sortable: true, filter: "text" },
    { key: "email", label: "Email", type: "string", sortable: true, filter: "text" },
    { key: "sitoweb", label: "Sito web", type: "string", sortable: true, filter: "text" },
    { key: "piva", label: "P.IVA", type: "string", sortable: true, filter: "numeric" },
    
  ];
  

function Clienti(){
    const [termValue, setTermValue] = useState<string>("");
    const [filter, setFilter] = useState({ logic: "or", filters: [] });
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
       
      
        return{ 
          data:[{
            codicecliente:'AEMMEX',
            ragioneSociale:"Aemmex eletronics service",
            piva:'01111111',
            sitoweb:'kkk.kkk.ii',
            email:'kkk@kkk.it'
          },
          {
            codicecliente:'AEMMEX2',
            ragioneSociale:"Aemmex eletronics service",
            piva:'01111111',
            sitoweb:'kkk.kkk.ii',
            email:'kkk@kkk.it'
          },
          {
            codicecliente:'AEMMEX3',
            ragioneSociale:"Aemmex eletronics service",
            piva:'01111111',
            sitoweb:'kkk.kkk.ii',
            email:'kkk@kkk.it'
          },
          {
            codicecliente:'AEMMEX4',
            ragioneSociale:"Aemmex eletronics service",
            piva:'01111111',
            sitoweb:'kkk.kkk.ii',
            email:'kkk@kkk.it'
          },
          {
            codicecliente:'AEMMEX5',
            ragioneSociale:"Aemmex eletronics service",
            piva:'01111111',
            sitoweb:'kkk.kkk.ii',
            email:'kkk@kkk.it'
          },
          {
            codicecliente:'AEMMEX6',
            ragioneSociale:"Aemmex eletronics service",
            piva:'01111111',
            sitoweb:'kkk.kkk.ii',
            email:'kkk@kkk.it'
          },
          {
            codicecliente:'AEMMEX7',
            ragioneSociale:"Aemmex eletronics service",
            piva:'01111111',
            sitoweb:'kkk.kkk.ii',
            email:'kkk@kkk.it'
          },
          {
            codicecliente:'AEMMEX8',
            ragioneSociale:"",
            piva:'01111111',
            sitoweb:'kkk.kkk.ii',
            email:'kkk@kkk.it'
          }

        ],
          meta: {
            total:8
          }
        }
        
      };

    useEffect(() => {
   

        loadData(pagination, filter, sorting, termValue)
    }, [pagination, filter, sorting, termValue]);


    
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

    formCrud={(row: any, type: FORM_TYPE, closeModalCallback: any, refreshTable: any) => (
      <>
        
      </>
    )}
  />


}

export default Clienti