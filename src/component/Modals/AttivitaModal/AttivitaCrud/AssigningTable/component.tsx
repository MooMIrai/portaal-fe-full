import React, { useEffect, useState } from "react";
import DynamicForm from "common/Form";
import GridTable from "common/Table";
import Button from "common/Button";
import RapportinoCalendar from "hr/RapportinoCalendar";
import NotificationProviderActions from "common/providers/NotificationProvider";
import {
  detailSectionIcon,
  calendarIcon,
  trashIcon
} from "common/icons";
import { formFields } from "./customFields";
import styles from "./styles.module.scss";
import { attivitaService } from "../../../../../services/attivitaService";
import { attivitaAssegnazioneColumns } from "../../../../ProgettoCrud/config";
import AssignCrud from "./AssignCrud/component";

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
  if (value.toLocaleLowerCase() === "boolean") return "checkbox";
  if (value.toLocaleLowerCase() === "number" || value.toLocaleLowerCase() === "float" || value.toLocaleLowerCase() === "int") return "number";
  if (value.toLocaleLowerCase() === "string") {
    if (value.toLocaleLowerCase().includes("@")) return "email";
    return "text";
  }
  if (value.toLocaleLowerCase() === "date" || value.toLocaleLowerCase() === "datetime") return "date";
  if (value.toLocaleLowerCase() === "projectstate") return "select";
  return "text";
};

const AssigningTable = (props: { activity_id: number }) => {
  const [innerCRUDFields, setInnerCRUDFields] = useState<any>({});

  const loadData = async (pagination: any, filter: any, sorting: any[]) => {
    const include = true;
    let correctFilters = JSON.parse(JSON.stringify(filter));

    const tableResponse = await attivitaService.getRelatedPersonActivities(
      props.activity_id,
      pagination.currentPage,
      pagination.pageSize,
      include,
      filter,
      sorting
    );

    console.log("resp: ", tableResponse);

    const mappedResponse = tableResponse?.data.map(d => {
      return {
        ...d,
        fullName: d.Person.firstName + " " + d.Person.lastName
      }
    });

    return {
      data: mappedResponse,
      meta: { total: tableResponse?.meta?.total },
    };
  };

  const loadModel = async () => {
    try {
      const resources = await attivitaService.getAssignGridModel();
      if (!resources) {
        throw new Error("No resources found");
      }

      const newModel: any = {};
      resources
        /* .filter((item: any) => !excludedKeys.includes(item.name)) */
        .forEach((item: any) => {
          const name = item.name === "person_id" ? 'account-selector' : item.name;
          newModel[name] = {
            name: item.name,
            type: item.name === "person_id" ? 'account-selector' : determineFieldType(item.type),
            label: item.name === "person_id" ? "Impiegato" : item.name.charAt(0).toUpperCase() + item.name.slice(1),
            value: item.name === "activity_id" ? props.activity_id : "",
            disabled: item.readOnly || item.name === "activity_id",
            required: item.required,
            options: [],
            showLabel: true
          };
        });

      setInnerCRUDFields(newModel);
    } catch (error) {
      console.error("Error loading fields:", error);
      setInnerCRUDFields({});
    }
  };

  useEffect(() => {
    loadModel();
  }, []);

  const handleFormSubmit = (
    formData: any,
    refreshTable: any,
    closeModal: () => void,
    isCreate?: boolean,
  ) => {
    let promise: Promise<any> | undefined = undefined;
    if (!isCreate) {
      promise = attivitaService.updateEmployee(
        formData.person_id.id,
        formData.activity_id,
        formData.start_date.toISOString ? formData.start_date.toISOString() : formData.start_date,
        formData.end_date.toISOString ? formData.end_date.toISOString() : formData.end_date,
        parseInt(formData.expectedDays)
      );
    } else {
      promise = attivitaService.addEmployee(
        formData.person_id.id,
        formData.activity_id,
        formData.start_date.toISOString ? formData.start_date.toISOString() : formData.start_date,
        formData.end_date.toISOString ? formData.end_date.toISOString() : formData.end_date,
        parseInt(formData.expectedDays)
      );
    }

    if (promise) {
      promise.then(() => {
        NotificationProviderActions.openModal(
          { icon: true, style: "success" },
          "Operazione avvenuta con successo"
        );
        refreshTable();
        closeModal();
      });
    }
  };

  return (
    <GridTable
      filterable={true}
      pageable={false}
      sortable={true}
      getData={loadData}
      columns={attivitaAssegnazioneColumns}
      resizableWindow={true}
      initialHeightWindow={800}
      draggableWindow={true}
      initialWidthWindow={900}
      resizable={true}
      actions={() => ["create"]}
      formCrud={(row, type, closeModalCallback, refreshTable) => {
        return (
          <div>
            <DynamicForm
              submitText={"Salva"}
              customDisabled={false}
              formData={{ activity_id: props.activity_id }}
              fields={Object.values(innerCRUDFields).filter((e: any) => {
                return e.name !== "id"
              }).map((e: any) => {
                return {
                  ...e,
                  disabled: e.disabled
                }
              })}
              addedFields={formFields}
              showSubmit={true}
              extraButton={true}
              extraBtnAction={closeModalCallback}
              onSubmit={(dataItem: { [name: string]: any }) => {
                handleFormSubmit(dataItem, refreshTable, closeModalCallback, true);
              }}
            />
          </div>
        );
      }}
      customRowActions={[
        {
          icon: calendarIcon,
          tooltip: "Rapportino",
          modalContent: (dataItem, closeModal, refreshTable) => {
            return <RapportinoCalendar forcePerson={{ id: dataItem.person_id, name: "" }} />
          },
        },
        {
          icon: detailSectionIcon,
          tooltip: "Modifica",
          modalContent: (dataItem, closeModal, refreshTable) => {
            return <AssignCrud
              dataItem={dataItem}
              closeModal={closeModal}
              refreshTable={refreshTable}
              addedFields={formFields}
              fields={innerCRUDFields}
              handleFormSubmit={(dataItem, refreshTable, closeModal) => handleFormSubmit(dataItem, refreshTable, closeModal, false)}
            />
          },
        },
        {
          icon: trashIcon,
          tooltip: "Elimina",
          modalContent: (dataItem, closeModal, refreshTable) => (
            <div>
              L'operazione è irreversibile.
              <div className={styles.buttonsContainer}>
                <Button onClick={() => closeModal()}>Annulla</Button>
                <Button themeColor={"error"} onClick={async () => {
                  await attivitaService.removeEmployee(dataItem.person_id, dataItem.activity_id);
                  refreshTable();
                  closeModal();
                }}>
                  Elimina
                </Button>
              </div>
            </div>
          ),
        },
      ]}
    />
  );
};

export default AssigningTable;
