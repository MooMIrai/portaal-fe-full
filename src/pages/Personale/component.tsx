import React, { useState, useEffect, useCallback } from "react";
import GridTable from "common/Table";
import PersonaleSection from "./../../component/TabPersonaleHR/component";
import { CrudGenericService } from "../../services/personaleServices";
import {
  cityAdapter,
  cityTypeOption,
  countryAdapter,
  countryOption,
  locationOption,
  sedeAdapter,
  transformUserData,
} from "../../adapters/personaleAdapters";
import Button from "common/Button";
import NotificationProviderActions from "common/providers/NotificationProvider";
import { useDebounce } from "@uidotdev/usehooks";
import styles from "./styles.modules.scss";
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
const mapFilterFields = (filter: any | null): any => {
  if (!filter || !filter.filters) {
    return { logic: "or", filters: [] };
  }

  const mappedFilters = filter.filters.map((f) => {
    if ("field" in f) {
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
  {
    key: "company",
    label: "Società",
    type: "string",
    sortable: true,
    filter: "text",
  },
  {
    key: "lastName",
    label: "Cognome",
    type: "string",
    sortable: true,
    filter: "text",
  },
  {
    key: "email",
    label: "Email",
    type: "string",
    sortable: true,
    filter: "text",
  },
  {
    key: "ContractType",
    label: "Tipo di Contratto",
    type: "string",
    sortable: true,
    filter: "text",
  },
  {
    key: "annualCost",
    label: "Costo Annuale",
    type: "string",
    sortable: false,
    filter: "numeric",
  },
  {
    key: "dailyCost",
    label: "Costo Giornaliero",
    type: "string",
    sortable: false,
    filter: "numeric",
  },
];

const PersonalPage = () => {
  const [data, setData] = useState<any>();
  const [country, setCountry] = useState<countryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState<cityTypeOption[]>([]);
  const [sede, setSede] = useState<locationOption[]>([]);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });



  useEffect(() => {
    const fetchCountryData = async () => {
      const countryResponse = await CrudGenericService.fetchResources(
        "country"
      );
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
        height: window.innerHeight,
      });
    };

    updateWindowSize();

    window.addEventListener("resize", updateWindowSize);

    return () => window.removeEventListener("resize", updateWindowSize);
  }, []);

  const loadData = async (
    pagination: any,
    filter: any,
    sorting: any[],
  ) => {
    const include = true;

    const mappedFilter = mapFilterFields(filter);
    const mappedSorting = sorting.map((s) => ({
      ...s,
      field: columnFieldMap[s.field] || s.field,
    }));

    const resources = await CrudGenericService.getAccounts(
      pagination.currentPage,
      pagination.pageSize,
      mappedFilter,
      mappedSorting,
      include
    );
    console.log(resources)
    const transformedData = transformUserData(
      resources.data,
      country,
      city,
      sede
    );
    setData(transformedData);
    console.log("datatransformed", transformedData);
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

      NotificationProviderActions.openModal(
        { icon: true, style: "success" },
        "Operazione avvenuta con successo"
      );
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
          filterable={true}
          sortable={true}
          getData={loadData}
          columns={columns}
          stageWindow={"FULLSCREEN"}
          actions={()=>[
            "show",
            "edit",
            "delete",
            "create"
            
          ]}
          classNameWindow={styles.windowStyle}
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
                        await handleFormSubmit(
                          type,
                          null,
                          refreshTable,
                          row?.id
                        );
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
