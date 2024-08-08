import React, { useState, useEffect } from "react";
import GridTable from "common/Table";
import PersonaleSection from "./../../component/TabPersonaleHR/component";
import { CrudGenericService } from "../../services/personaleServices";
import { transformUserData } from "../../adapters/personaleAdapters";
import Button from "common/Button"

// TO DO  cambiare stile aggiungere icone e fare sorting filtering a gestire il form trattamento (aggiungere button)



const columnFieldMap: { [key: string]: string } = {
  company: "Person.EmploymentContract.Company.name",
  lastName: "Person.lastName",
  firstName: "Person.firstName",
  ContractType: "Person.EmploymentContract.ContractType.description",
  annualCost: "Person.EmploymentContract.annualCost",
  dailyCost: "Person.EmploymentContract.dailyCost",
};
// serve per convertire le key delle colonne per field per il sorting e il filter
const mapFilterFields = (filter: any | null): any => {
  if (!filter || !filter.filters) {
    return { logic: "or", filters: [] };
  }

  const mappedFilters = filter.filters.map(f => {
    if ('field' in f) {
      const fd = f as any;
      return { ...fd, field: columnFieldMap[fd.field as string] || fd.field };
    } else {
      const cf = f as any;
      return mapFilterFields(cf);
    }
  });
  return { ...filter, filters: mappedFilters };
};

const columns: any = [
  { key: "company", label: "Società", type: "string", sortable: true, filter: "text" },
  { key: "lastName", label: "Cognome", type: "string", sortable: true, filter: "text" },
  { key: "email", label: "Email", type: "string", sortable: true, filter: "text" },
  { key: "ContractType", label: "Tipo di Contratto", type: "string", sortable: true, filter: "text" },
  { key: "annualCost", label: "Costo Annuale", type:"string", sortable: true, filter: "numeric" },
  { key: "dailyCost", label: "Costo Giornaliero", type: "string", sortable: true, filter: "numeric" },
];

const PersonalPage = () => {
  const [data, setData] = useState<any>();
  const [termValue, setTermValue] = useState<string>("");
  const [filter, setFilter] = useState<any>({ logic: "or", filters: [] });
  const [sorting, setSorting] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({ currentPage: 1, pageSize: 10 });
  const [loading, setLoading] = useState<boolean>(false);


  const loadData = async (
    pagination: any,
    filter: any,
    sorting:any[],
    term?: string
  ) => {
    const include = true;

    const mappedFilter = mapFilterFields(filter);

    // Mappa i campi di ordinamento ai campi originali
    const mappedSorting = sorting.map(s => ({
      ...s,
      field: columnFieldMap[s.field] || s.field
    }));


    const resources = await CrudGenericService.getAccounts(
      pagination.currentPage,
      pagination.pageSize,
      mappedFilter,
      mappedSorting,
      term,
      include,
    );
    const transformedData = transformUserData(resources.data);
    console.log("resources", resources)
    console.log("transformedData", transformedData)
    setData(transformedData);

    return {
      data: transformedData,
      meta: {
        total: resources.meta.total
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


  const handleFormSubmit = async (type: any, formData: any, refreshTable: any, id?: any,) => {

    if (type === "create") {
      await CrudGenericService.createResource(formData);
    } else if (type === "edit") {
      await CrudGenericService.updateResource(id, formData);
    } else if (type === "delete") {
      await CrudGenericService.deleteResource(id);
    }
    refreshTable();
  };
  return (
    <div>
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
      /*     initialHeightWindow={800} */
          draggableWindow={true}
         /*  initialWidthWindow={900} */
          resizable={true}
          actions={[
            "create",
            "delete",
            "edit",
            "show",
          ]}

          formCrud={(row: any, type: any, closeModalCallback: any, refreshTable: any) => (
            <>
              {type === "delete" ? (
                <>
                  <div style={{ padding: "20px" }}>
                    <span>{"Sei sicuro di voler eliminare il record?"}</span>
                  </div>
                  <div className="k-form-buttons">
                    <Button onClick={closeModalCallback}>Cancel</Button>
                    <Button
                      themeColor="primary"
                      onClick={async () => {
                        await handleFormSubmit(type, null, refreshTable, row?.id,);
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
    </div>
  );
};

export default PersonalPage;
