import React, { useState, useEffect, useCallback } from "react";
import GridTable from "common/Table";
import PersonaleSection from "./../../component/TabPersonaleHR/component";
import { CrudGenericService } from "../../services/personaleServices";
import { cityAdapter, cityTypeOption, countryAdapter, countryOption, locationOption, sedeAdapter, transformUserData } from "../../adapters/personaleAdapters";
import Button from "common/Button";
import NotificationProviderActions from "common/providers/NotificationProvider";
import { useDebounce } from "@uidotdev/usehooks";
import styles from "./styles.modules.scss"
// Column field mapping
const columnFieldMap: { [key: string]: string } = {
  company: "Person.EmploymentContract.Company.name",
  lastName: "Person.lastName",
  firstName: "Person.firstName",
  ContractType: "Person.EmploymentContract.ContractType.description",
  annualCost: "Person.EmploymentContract.annualCost",
  dailyCost: "Person.EmploymentContract.dailyCost",
};

// Filter mapping function
const mapFilterFields = (filter: any | null, debouncedValue: string): any => {
  if (!filter || !filter.filters) {
    return { logic: "or", filters: [] };
  }

  const mappedFilters = filter.filters.map(f => {
    if ('field' in f) {
      const fd = f as any;
      const isNumericField = fd.filter === "numeric";
      const filterValue = isNumericField && !isNaN(Number(debouncedValue)) ? Number(debouncedValue) : debouncedValue;

      return { ...fd, field: columnFieldMap[fd.field as string] || fd.field, value: filterValue };
    } else {
      const cf = f as any;
      return mapFilterFields(cf, debouncedValue);
    }
  });
  return { ...filter, filters: mappedFilters };
};
const columns: any = [
  { key: "company", label: "Società", type: "string", sortable: true, filter: "text" },
  { key: "lastName", label: "Cognome", type: "string", sortable: true, filter: "text" },
  { key: "email", label: "Email", type: "string", sortable: true, filter: "text" },
  { key: "ContractType", label: "Tipo di Contratto", type: "string", sortable: true, filter: "text" },
  { key: "annualCost", label: "Costo Annuale", type: "string", sortable: true, filter: "numeric" },
  { key: "dailyCost", label: "Costo Giornaliero", type: "string", sortable: true, filter: "numeric" },
];

const PersonalPage = () => {
  const [data, setData] = useState<any>();
  const [filter, setFilter] = useState<any>({ logic: "or", filters: [] });
  const [sorting, setSorting] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({ currentPage: 1, pageSize: 10 });
  const [country, setCountry] = useState<countryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState<cityTypeOption[]>([]);
  const [sede, setSede] = useState<locationOption[]>([]);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const fetchCountryData = async () => {
      const countryResponse = await CrudGenericService.fetchResources("country");
      const adaptedCountry = countryAdapter(countryResponse);
      setCountry(adaptedCountry);

      const cityResponse = await CrudGenericService.fetchResources("city");
      const adaptedCity = cityAdapter(cityResponse);
      setCity(adaptedCity);

      const sedeResponse = await CrudGenericService.fetchResources("location");
      const adaptedLocation = sedeAdapter(sedeResponse);
      setSede(adaptedLocation);

      setLoading(false);
    };

    fetchCountryData();
  }, []);


  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateWindowSize();

    window.addEventListener('resize', updateWindowSize);

    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  // Verifica la presenza di filtri prima di accedere
  const firstFilter = filter && filter.filters && filter.filters.length > 0 ? filter.filters[0] : null;
console.log("filter")
  // Controlla se il filtro è per un campo stringa e usa il debounce solo in quel caso
  const isStringFilter = firstFilter &&( typeof firstFilter.value === "string" );
  
  const debouncedSearchTerm = isStringFilter
    ? useDebounce(firstFilter.value, 650)
    : firstFilter ? firstFilter.value : "";
    console.log("debounceterm",debouncedSearchTerm)
    
  useEffect(() => {
    if (!loading && country.length > 0 && city.length > 0 && sede.length > 0) {
      const updatedFilter = mapFilterFields(filter, debouncedSearchTerm);
      loadData(pagination, updatedFilter, sorting);
    }
  }, [pagination, filter, sorting, country, loading, city, sede, debouncedSearchTerm]);

  const loadData = async (
    pagination: any,
    filter: any,
    sorting: any[],
    term?: string
  ) => {
    const include = true;
    console.log("insidefunction", debouncedSearchTerm)
    const mappedFilter = mapFilterFields(filter, debouncedSearchTerm);
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
    const transformedData = transformUserData(resources.data, country, city, sede);
    setData(transformedData);
    console.log("datatransformed", transformedData)
    return {
      data: transformedData,
      meta: {
        total: resources.meta.total,
      },
    };
  };

  const handleFormSubmit = async (type, formData, refreshTable, id) => {
    try {
      if (type === "create") {
        await CrudGenericService.createResource(formData);
      } else if (type === "edit") {
        await CrudGenericService.updateResource(id, formData);
      } else if (type === "delete") {
        await CrudGenericService.deleteResource(id);
      }

      NotificationProviderActions.openModal({ icon: true, style: 'success' }, "Operazione avvenuta con successo");
      refreshTable();
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
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
          resizable={true}
          resizableWindow={false}
          topWindow={0}
          leftWindow={0}
          draggableWindow={true}
          heightWindow={windowSize.height}
          widthWindow={windowSize.width}
          actions={["create", "delete", "edit", "show"]}
          formCrud={(row, type, closeModalCallback, refreshTable) => (
            <>
              {type === "delete" ? (

                <div className={styles.formDelete}>
                  <span>{"Sei sicuro di voler eliminare il record?"}</span>
                  <div>
                    <Button onClick={closeModalCallback}>Cancel</Button>
                    <Button
                      themeColor={"error"}
                      onClick={async () => {
                        await handleFormSubmit(type, null, refreshTable, row?.id);
                        closeModalCallback();
                      }}
                    >
                      {"Elimina"}
                    </Button>
                  </div>
                </div>

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
