import React, { useState } from "react";
import GenericGrid from "common/Table";
import DynamicForm from "common/Form";

import { useDebounce } from "@uidotdev/usehooks";
import { LookupsService } from "../../services/LookupService";

const determineColumnType = (type: string): "text" | "numeric" | "date" => {
  switch (type) {
    case "Int":
      return "numeric";
    case "DateTime":
      return "date";
    case "String":
    default:
      return "text";
  }
};

const generateColumns = (data: any): any[] => {
  if (!data || data.length === 0) return [];
  const columns = Object.keys(data).map(
    (key) =>
      ({
        key: key,
        label: key.charAt(0).toUpperCase() + key.slice(1),
        sortable: true,
        type: "string",
        filter: determineColumnType(data[key]),
      } as any)
  );
  return columns;
};

const determineFieldType = (
  value: any
):
  | "number"
  | "text"
  | "email"
  | "date"
  | "time"
  | "textarea"
  | "password"
  | "checkbox"
  | "select" => {
  if (typeof value === "boolean") return "checkbox";
  if (typeof value === "number") return "number";
  if (typeof value === "string") {
    if (value.includes("@")) return "email";
    return "text";
  }
  if (value instanceof Date) return "date";
  return "text";
};

const LookUps = () => {
  const [selectedData, setSelectedData] = useState<string>("Role");
  const [columns, setColumns] = useState<any[]>([]);
  const [fields, setFields] = useState<any>({});
  const [termValue, setTermValue] = useState<string>("");
  const debouncedSearchTerm = useDebounce(termValue, 650);
  const [filter, setFilter] = useState<any>({
    logic: "and",
    filters: [],
  });
  const [sorting, setSorting] = useState<any[]>([]);
  const pagination = {
    currentPage: 1,
    pageSize: 10,
  };

  const loadModel = async (type: string) => {
    try {
      const resources = await LookupsService.getGridModel(
        type.toLowerCase()
      );
      if (!resources) {
        throw new Error("No resources found");
      }
      setColumns(generateColumns(resources));

      const newModel: any = {};
      for (const key in resources) {
        if (key !== "id") {
          if (resources.hasOwnProperty(key)) {
            newModel[key] = {
              name: key,
              type: determineFieldType(resources[key]),
              label: key,
              value: resources[key],
              disabled: false,
              required: true,
            };
          }
        }
      }

      setFields(newModel);

      const newDataItem: Record<string, any> = {};
      for (const key in newModel) {
        if (newModel.hasOwnProperty(key)) {
          newDataItem[key] = "";
        }
      }
    } catch (error) {
      console.error("Error loading fields:", error);
      setFields({});
      setColumns([]);
    }
  };

  const loadData = async (
    pagination: any,
    filter: any,
    sorting: any[],
    term?: string
  ) => {
    try {
      const resources = await LookupsService.searchGenericGrid(
        selectedData,
        pagination.currentPage,
        pagination.pageSize,
        filter,
        sorting,
        term
      );
      return resources;
    } catch (error) {
      console.error("Error loading data:", error);
      setColumns([]);
    }
  };

  const handleSubmit = async (
    type: string,
    dataItem: any,
    refreshTable: any
  ): Promise<void> => {
    if (type === "create") {
      await LookupsService.createResource(selectedData, dataItem);
    } else if (type === "edit") {
      await LookupsService.updateResource(
        selectedData,
        dataItem?.id,
        dataItem
      );
    } else if (type === "delete") {
      await LookupsService.deleteResource(selectedData, dataItem);
    }

    refreshTable();
  };

  const handleInputSearch = (e: any) => {
    const value = e.target.value || "";
    setTermValue(value);
  };

  return (
    <div>
      <GenericGrid
        inputSearchConfig={{
          inputSearch: termValue,
          debouncedSearchTerm: debouncedSearchTerm,
          handleInputSearch: handleInputSearch,
        }}
        typological={{
          type: selectedData,
          getModel: loadModel,
          setType: setSelectedData,
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
        resizable={true}
        actions={[
          "create",
          "delete",
          "edit",
          "show"        
        ]}
        formCrud={(row, type, closeModalCallback, refreshTable) => {
          const crudCondition = type === "view";
          const handleFields = Object.values(fields).map((el: any) => {
            return {
              ...el,
              disabled: crudCondition,
            };
          });
          const filterOutObjectKeys = (
            obj: any,
            keysToRemove: Array<string>
          ) => {
            return Object.keys(obj)
              .filter((key) => !keysToRemove.includes(key))
              .reduce((result: any, key) => {
                result[key] = obj[key];
                return result;
              }, {});
          };

          const keysToRemove = [
            "date_created",
            "date_modified",
            "user_created",
            "user_modified",
          ];

          const filteredObject = filterOutObjectKeys(row, keysToRemove);

          return (
            <>
              {type === "delete" ? (
                <>
                  <div style={{ padding: "20px" }}>
                    <span>{"Sei sicuro di voler eliminare il record?"}</span>
                  </div>
                  <div className="k-form-buttons">
                    <button onClick={closeModalCallback}>Cancel</button>
                    <button
                      //themeColor="primary"
                      onClick={async () => {
                        await handleSubmit(type, row?.id, refreshTable);
                        closeModalCallback();
                      }}
                    >
                      {"Elimina"}
                    </button>
                  </div>
                </>
              ) : (
                <DynamicForm
                  submitText={crudCondition ? "Esci" : "Salva"}
                  customDisabled={crudCondition}
                  formData={filteredObject}
                  fields={handleFields}
                  showSubmit={!crudCondition}
                  extraButton={true}
                  extraBtnAction={closeModalCallback}
                  onSubmit={async (dataItem: { [name: string]: any }) => {
                    await handleSubmit(type, dataItem, refreshTable);
                    closeModalCallback();
                  }}
                />
              )}
            </>
          );
        }}
      />
    </div>
  );
};

export default LookUps;
