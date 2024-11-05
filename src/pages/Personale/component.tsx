import React, { useState, useEffect, useCallback } from "react";
import GridTable from "common/Table";
import PersonaleSection from "./../../component/TabPersonaleHR/component";
import { accountsService, CrudGenericService } from "../../services/personaleServices";
import {
  locationOption,
  sedeAdapter,
  transformUserData,
} from "../../adapters/personaleAdapters";
import Button from "common/Button";
import NotificationProviderActions from "common/providers/NotificationProvider";
import styles from "./style.modules.scss"
// Column field mapping
const columnFieldMap: { [key: string]: string } = {
  company: "Person.CurrentContract.Contract.Company.name",
  lastName: "Person.lastName",
  firstName: "Person.firstName",
  ContractType: "Person.CurrentContract.Contract.ContractType.description",
  annualCost: "Person.CurrentContract.Contract.annualCost",
  dailyCost: "Person.CurrentContract.Contract.dailyCost",
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
  const [sede, setSede] = useState<locationOption[]>([]);
  const [isLocationDataReady, setIsLocationDataReady] = useState(false); // Nuovo stato per i dati geografici

  useEffect(() => {
    const fetchCountryData = async () => {

      try {
        const sedeResponse = await CrudGenericService.fetchResources("location");
        const adaptedLocation = sedeAdapter(sedeResponse);
        setSede(adaptedLocation);

        // Imposta lo stato a true dopo aver caricato tutti i dati geografici
        setIsLocationDataReady(true);
      } catch (error) {
        console.error("Error fetching country data:", error);
      }
    };

    fetchCountryData();
  }, []);


  const loadData = async (pagination: any, filter: any, sorting: any[]) => {
    if (!isLocationDataReady) {
      return {
        data: [],
        meta: { total: 0 },
      };
    }

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

    const transformedData = transformUserData(
      resources.data,
      sede
    );
    console.log("transfoermedData", transformedData)
    setData(transformedData);

    return {
      data: transformedData,
      meta: {
        total: resources.meta.total,
      },
    };
  };

  const handleFormSubmit = async (
    type: string,
    formData: any,
    refreshTable: any,
    id: any,
    closeModal: () => void
  ) => {
    let promise: Promise<any> | undefined;
  
    if (type === "create") {
      promise = accountsService.createResource(formData);
    } else if (type === "edit") {
      promise = accountsService.updateResource(id, formData);
    } else if (type === "delete") {
      promise = accountsService.deleteResourcewidthFiles(id, formData.deleteFiles);
    }
  
    if (promise) {
      try {
        await promise;
        NotificationProviderActions.openModal(
          { icon: true, style: "success" },
          "Operazione avvenuta con successo"
        );
        refreshTable();
        closeModal();
      } catch (error) {
        console.error("Error handling form submit:", error);
      }
    }
  };
  


  // Se i dati non sono pronti, non renderizzare nulla
  if (!isLocationDataReady) {
    return null;
  }

  return (
    <div>
      <GridTable
        filterable={true}
        sortable={true}
        getData={loadData}
        columns={columns}
        resizable={true}
        pageable={true}
        stageWindow={"FULLSCREEN"}
        actions={() => ["show", "edit", "delete", "create"]}
        classNameWindow={styles.windowStyle}
        classNameWindowDelete={styles.windowDelete}
        formCrud={(row, type, closeModalCallback, refreshTable) => (

          <PersonaleSection
            row={row}
            type={type}
            closeModalCallback={closeModalCallback}
            refreshTable={refreshTable}
            onSubmit={handleFormSubmit}
          />


        )}
      />
    </div>
  );
};

export default PersonalPage;

