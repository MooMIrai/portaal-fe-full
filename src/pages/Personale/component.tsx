import React, { useState, useEffect } from "react";
import GridTable from "common/Table";
import PersonaleSection from "./../../component/TabPersonaleHR/component";
import { CrudGenericService } from "../../services/personaleServices";
import { cityAdapter, cityTypeOption, countryAdapter, countryOption, locationOption, sedeAdapter, transformUserData } from "../../adapters/personaleAdapters";
import Button from "common/Button";
import NotificationProviderActions from "common/providers/NotificationProvider";


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
  const [filter, setFilter] = useState<any>({ logic: "or", filters: [] });
  const [sorting, setSorting] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({ currentPage: 1, pageSize: 10 });
  const [country, setCountry] = useState<countryOption[]>([]);
  const [loading, setLoading] = useState(true); // Stato di caricamento
  const [city, setCity] = useState<cityTypeOption[]>([]);
  const [sede,setSede]=useState<locationOption[]>([])



  useEffect(() => {
    const fetchCountryData = async () => {
      const countryResponse = await CrudGenericService.fetchResources("country");
      const adaptedCountry = countryAdapter(countryResponse);
      setCountry(adaptedCountry);
      
      const cityResponse = await CrudGenericService.fetchResources("city");
      const adaptedCity = cityAdapter(cityResponse);
      setCity(adaptedCity);

      const sedeResponse = await CrudGenericService.fetchResources("location");
      const adaptedLocation = sedeAdapter(sedeResponse)
      setSede(adaptedLocation)
 
      setLoading(false); 
    };

    fetchCountryData();
  }, []); 


  useEffect(() => {
    if (!loading && country.length > 0 && city.length >0 && sede.length > 0) { // Solo quando non si sta caricando e `country` è pronto
      const fetchData = async () => {
        await loadData(pagination, filter, sorting);
      };

      fetchData();
    }
  }, [pagination, filter, sorting, country, loading,city,sede]); 

  const loadData = async (
    pagination: any,
    filter: any,
    sorting: any[],
    term?: string
  ) => {
    const include = true;

    const mappedFilter = mapFilterFields(filter);

    // Mappa i campi di ordinamento ai campi originali
    const mappedSorting = sorting.map((s) => ({
      ...s,
      field: columnFieldMap[s.field] || s.field,
    }));

    const resources = await CrudGenericService.getAccounts(
      pagination.currentPage,
      pagination.pageSize,
      mappedFilter,
      mappedSorting,
      term,
      include
    );
    const transformedData = transformUserData(resources.data, country,city,sede); 
    console.log("resources", resources);
    console.log("transformedData", transformedData);
    setData(transformedData);

    return {
      data: transformedData,
      meta: {
        total: resources.meta.total,
      },
    };
  };
  const handleFormSubmit = async (type: any, formData: any, refreshTable: any, id?: any) => {

    try {
      if (type === "create") {
        await CrudGenericService.createResource(formData);
      } else if (type === "edit") {
        await CrudGenericService.updateResource(id, formData);
      } else if (type === "delete") {
        await CrudGenericService.deleteResource(id);
      }
  
      NotificationProviderActions.openModal({icon: true, style: 'success'}, "Operazione avvenuta con successo");
      refreshTable();
    } catch (error) {
    /*   NotificationProviderActions.openModal({icon: true, style: 'error'}, "Errore nell'operazione"); */
      console.error("Error during form submission:", error);
    }
  };
  

  return (
    <div>
      {loading ? ( // Controlla lo stato di caricamento
        <p>Loading...</p> // Visualizza un messaggio di caricamento (puoi usare un'animazione o un indicatore)
      ) : (
        <GridTable
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
          draggableWindow={true}
          initialHeightWindow={800}
          initialWidthWindow={900}
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
                        await handleFormSubmit(type, null, refreshTable, row?.id);
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
