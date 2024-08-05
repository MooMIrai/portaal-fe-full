import React, { useState, useEffect } from "react";
import GridTable from "common/Table";
import { FORM_TYPE, Fields } from "./formModel";
import { TABLE_ACTION_TYPE, TABLE_COLUMN_TYPE, TableColumn } from "./tableModel";
import { PaginationModel } from "./gridModel";
import { CompositeFilterDescriptor, SortDescriptor } from "@progress/kendo-data-query";
import { Button } from "@progress/kendo-react-buttons";
import PersonaleSection from "./../../component/TabPersonaleHR/component";
import { Loader } from "@progress/kendo-react-indicators"; 
import { CrudGenericService } from "../../services/personaleServices";
import { transformUserData } from "../../adapters/personaleAdapters";


// TO DO  cambiare stile aggiungere icone e fare sorting filtering a gestire il form trattamento (aggiungere button Nuovo)


const columns: TableColumn[] = [
  { key: "company", label: "Società", type: TABLE_COLUMN_TYPE.string, sortable: true, filter: "text" },
  { key: "lastName", label: "Cognome", type: TABLE_COLUMN_TYPE.string, sortable: true, filter: "text" },
  { key: "email", label: "Email", type: TABLE_COLUMN_TYPE.string, sortable: true, filter: "text" },
  { key: "ContractType", label: "Tipo di Contratto", type: TABLE_COLUMN_TYPE.string, sortable: true, filter: "text" },
  { key: "annualCost", label: "Costo Annuale", type:TABLE_COLUMN_TYPE.string, sortable: true, filter: "numeric" },
  { key: "dailyCost", label: "Costo Giornaliero", type: TABLE_COLUMN_TYPE.string, sortable: true, filter: "numeric" },
];

const PersonalPage = () => {
  const [data, setData] = useState<any>();
  const [termValue, setTermValue] = useState<string>("");
  const [filter, setFilter] = useState<CompositeFilterDescriptor>({ logic: "or", filters: [] });
  const [sorting, setSorting] = useState<SortDescriptor[]>([]);
  const [pagination, setPagination] = useState<PaginationModel>({ currentPage: 1, pageSize: 10 });
  const [loading, setLoading] = useState<boolean>(false);

  const loadData = async (
    pagination: PaginationModel,
    filter: CompositeFilterDescriptor,
    sorting: SortDescriptor[],
    term?: string
  ) => {
    const include= true;
    const resources = await CrudGenericService.getAccounts(
      pagination.currentPage,
      pagination.pageSize,
      filter,
      sorting,
      term,
      include,
    );
    const transformedData = transformUserData(resources.data);
    console.log("resources",resources)
    console.log("transformedData",transformedData)
    setData(transformedData);
  
    return{ 
      data:transformedData,
      meta: {
        total:resources.meta.total
      }
    }
    
  };


  useEffect(() => {
   

    loadData(pagination, filter, sorting, termValue)
  }, [pagination, filter, sorting, termValue]);

  const handleInputSearch = (e: any) => {
    const value = e.target.value || "";
    setTermValue(value);
  };


  const handleFormSubmit = async (type: FORM_TYPE, formData: any,  refreshTable: any,id?:any,) => {

    if (type === FORM_TYPE.create) {
      await CrudGenericService.createResource(formData);
    } else if (type === FORM_TYPE.edit) {
      await CrudGenericService.updateResource(id,formData);
    } else if (type === FORM_TYPE.delete) {
      await CrudGenericService.deleteResource(id);
    }
    refreshTable();
  };
  return (
<div>
      {loading ? ( 
        <Loader type="infinite-spinner" />
      ) : (
      <GridTable
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
          TABLE_ACTION_TYPE.create,
          TABLE_ACTION_TYPE.delete,
          TABLE_ACTION_TYPE.edit,
          TABLE_ACTION_TYPE.show,
        ]}

        formCrud={(row: any, type: FORM_TYPE, closeModalCallback: any, refreshTable: any) => (
          <>
            {type === FORM_TYPE.delete ? (
              <>
                <div style={{ padding: "20px" }}>
                  <span>{"Sei sicuro di voler eliminare il record?"}</span>
                </div>
                <div className="k-form-buttons">
                  <Button onClick={closeModalCallback}>Cancel</Button>
                  <Button
                    themeColor="primary"
                    onClick={async () => {
                      await handleFormSubmit(type,null, refreshTable, row?.id,);
                      closeModalCallback();
                    }}
                  >
                    {"Elimina"}
                  </Button>
                </div>
              </>
            ) : (
              <PersonaleSection
                row={row}
                type={type}
                closeModalCallback={closeModalCallback}
                refreshTable={refreshTable}
                onSubmit={handleFormSubmit}
              />
            )}
          </>
        )}
      />
      )}
    </div>
  );
};

export default PersonalPage;
