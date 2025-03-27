import React, { useEffect, useRef, useState } from "react";
import GenericGrid from "common/Table";
import DynamicForm from "common/Form";
import InputText from "common/InputText";
import Button from "common/Button";
import { useDebounce } from "@uidotdev/usehooks";
import { LookupsService } from "../../services/LookupService";
import { LookUpsSelector } from "../../components/lookupsSelector/component";
// Utility function to filter out unwanted keys from an object
const filterOutObjectKeys = (obj: any, keysToRemove: Array<string>) => {
  return Object.keys(obj)
    .filter((key) => !keysToRemove.includes(key))
    .reduce((result: any, key) => {
      result[key] = obj[key];
      return result;
    }, {});
};


const excludedKeys = ["date_created", "date_modified", "user_created", "user_modified"];

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

const generateColumns = (data: any[]): any[] => {
  if (!data || data.length === 0) return [];

  return data
    .filter(item => !excludedKeys.includes(item.name))
    .map((item) => ({
      key: item.name,
      label: item.name.charAt(0).toUpperCase() + item.name.slice(1),
      sortable: item.sortable,
      filter: determineColumnType(item.type),
    }));
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
  return "date";
};

const LookUps = () => {
  const [selectedData, setSelectedData] = useState<string>("ProjectType");
  const [columns, setColumns] = useState<any[]>([]);
  const [fields, setFields] = useState<any>({});
  const [termValue, setTermValue] = useState<string>();
  const debouncedSearchTerm = useDebounce(termValue, 650);
  const gridRef = useRef<any>(null);

  const loadModel = async (type: string) => {
    try {
      const resources = await LookupsService.getGridModel(type.toLowerCase());
      if (!resources) {
        throw new Error("No resources found");
      }
      setColumns(generateColumns(resources));

      const newModel: any = {};
      resources
        .filter((item: any) => !excludedKeys.includes(item.name))
        .forEach((item: any) => {
          newModel[item.name] = {
            name: item.name,
            type: determineFieldType(item.type),
            label: item.name.charAt(0).toUpperCase() + item.name.slice(1),
            value: "",
            disabled: item.readOnly,
            required: item.required,
          };
        });

      setFields(newModel);
    } catch (error) {
      console.error("Error loading fields:", error);
      setFields({});
      setColumns([]);
    }
  };

  useEffect(() => {
    loadModel(selectedData);
  }, [selectedData]);

  const loadData = async (pagination: any, filter: any, sorting: any[]) => {
    try {
      const resources = await LookupsService.searchGenericGrid(
        selectedData,
        pagination.currentPage,
        pagination.pageSize,
        filter,
        sorting,
        debouncedSearchTerm
      );
      return resources;
    } catch (error) {
      console.error("Error loading data:", error);
      setColumns([]);
    }
  };

  const handleTypeChange = (type: any) => {
    const newSelectedData = type?.value?.name;
    setSelectedData(newSelectedData);
    loadModel(newSelectedData);
  };

  const handleSearchTerm = (event: any) => {
    setTermValue(event.target.value);
  };

  const handleSubmit = async (
    type: string,
    dataItem: any,
    refreshTable: any
  ): Promise<void> => {

    try {
      const { id, tenant_code, ...dataToSubmit } = dataItem;
      if (type === "create") {
        await LookupsService.createResource(selectedData, dataToSubmit);
      } else if (type === "edit") {
        await LookupsService.updateResource(selectedData, id, dataToSubmit);
      } else if (type === "delete") {
        await LookupsService.deleteResource(selectedData, dataItem);
      }

      refreshTable();
    } catch (error) {
      console.error("Error in submitting form data:", error);
    }
  };

  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.refreshTable();
    }
  }, [debouncedSearchTerm, selectedData]);

  return (
    <div>
      <GenericGrid
        ref={gridRef}
        dropListLookup={true}
        customToolBarComponent={() => (
          <>
            <InputText placeholder={"Cerca"} value={termValue} onChange={handleSearchTerm} />
            <LookUpsSelector
              placeholder={"Inserisci Tipologica"}
              onChange={(event: { id: number; name: string }) =>
                handleTypeChange(event)
              }
            />
          </>
        )}
        filterable={true}
        sortable={true}
        pageable={true}
        getData={loadData}
        columns={columns}
        resizable={true}
        writePermissions={["WRITE_LOOKUPS"]}
        actions={() => ["create", "delete", "edit", "show"]}
        formCrud={(row, type, closeModalCallback, refreshTable) => {
          const crudCondition = type === "view";

          const filteredFields = Object.values(fields)
            .filter((el: any) => (type === "create" || type === "edit") ? el.name !== "id" : true)
            .map((el: any) => ({
              ...el,
              disabled: crudCondition,
            }));
          const filteredObject = filterOutObjectKeys(row, excludedKeys);


          return (
            <>
              {type === "delete" ? (
                 <div  style={{ padding: "20px" }}>
                  <span>{"Sei sicuro di voler eliminare il record?"}</span>
                  <div style={{ paddingTop: "20px", paddingLeft:"30px" }} className="k-form-buttons">
                    <Button onClick={closeModalCallback}>Cancel</Button>
                    <Button
                      themeColor={"error"}
                      onClick={async () => {
                        await handleSubmit(type, row?.id, refreshTable);
                        closeModalCallback();
                      }}
                    >
                      {"Elimina"}
                    </Button>
                  </div>
                </div>
              ) : (
                <DynamicForm
                  submitText={crudCondition ? "Esci" : "Salva"}
                  customDisabled={crudCondition}
                  formData={filteredObject}
                  fields={filteredFields}
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
