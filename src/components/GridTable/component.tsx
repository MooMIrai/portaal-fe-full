import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Grid,
  GridColumn,
  GridToolbar,
  GridCellProps,
  GridPageChangeEvent,
  GridFilterChangeEvent,
  GridSortChangeEvent,
} from "@progress/kendo-react-grid";
import { Button } from "@progress/kendo-react-buttons";
import { FORM_TYPE } from "../../models/formModel";
import Modal from "../Modal/component";
import { TableToFormTypeAdapter } from "../../adapters/tableToFormTypeAdapter";
import { Pager, PagerProps } from "@progress/kendo-react-data-tools";
import { PaginationModel } from "../../models/gridModel";
import {
  CompositeFilterDescriptor,
  SortDescriptor,
} from "@progress/kendo-data-query";
import { Input } from "@progress/kendo-react-inputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import styles from "./styles.module.scss";
import { plusIcon } from "@progress/kendo-svg-icons";
import { TableColumn, TABLE_ACTION_TYPE } from "../../models/tableModel";
import CustomWindow from "../Window/component";

type TablePaginatedProps = {
  pageSizeOptions?: number[];
  getData: (
    pagination: PaginationModel,
    filter: CompositeFilterDescriptor,
    sorting: SortDescriptor[],
    term?: string
  ) => Promise<{ data: Array<Record<string, any>>; meta: { total: number } }>;
  columns: TableColumn[];
  actions?: TABLE_ACTION_TYPE[];
  //filter
  filterable?: boolean;
  filter: CompositeFilterDescriptor;
  setFilter: (filter: CompositeFilterDescriptor) => void;
  //style
  className?: string;
  customIcon?: string;
  customHeader?: string;
  resizable?: boolean;
  dropListLookup?:boolean;

  //generic crud search
  inputSearchConfig?: {
    inputSearch: string;
    debouncedSearchTerm: string;
    handleInputSearch: (e: any) => void;
  };

  //sort
  sortable?: boolean;
  sorting: SortDescriptor[];
  setSorting: (sorting: SortDescriptor[]) => void;

  //generic crud table config
  typological?: {
    type: string;
    setType: Dispatch<SetStateAction<string>>;
    getModel: (type: string) => Promise<void>;
  };

  //form for crud actions
  formCrud?: (
    row: Record<string, any> | undefined,
    type: FORM_TYPE,
    closeModalCallback: () => void,
    refreshTable: () => void
  ) => JSX.Element;
  initialPagination: PaginationModel;

  //props for window Modal
  resizableWindow?:boolean,
  draggableWindow?:boolean,
  minHeightWindow?:number,
  minWidthWindow?:number,
  initialHeightWindow?:number,
  initialWidthWindow?:number

};

const MyPager = (props: PagerProps) => (
  <div style={{ overflow: "hidden" }}>
    <Pager
      responsive={true}
      skip={props.skip}
      take={props.take}
      total={props.total}
      onPageChange={props.onPageChange}
      buttonCount={5}
      info={true}
      previousNext={true}
      type="numeric"
      pageSizes={props.pageSizes}
    />
  </div>
);

export default function GenericGrid(props: TablePaginatedProps) {
  const [modal, setModal] = useState<{
    open: boolean;
    data?: Record<string, any>;
    type?: TABLE_ACTION_TYPE;
  }>({ open: false });
  const [total, setTotal] = useState<number>(0);
  const [pagination, setPagination] = useState<PaginationModel>(
    props.initialPagination
  );
  const [data, setData] = useState<Array<Record<string, any>>>();
  const [row, setRow] = useState<Record<string, any> | undefined>(undefined);

  const refreshTable = async (
    pagination: PaginationModel,
    filter: CompositeFilterDescriptor,
    sorting: SortDescriptor[],
    term?: string
  ) => {
    const res = await props.getData(
      pagination,
      filter,
      sorting,
      props.inputSearchConfig?.debouncedSearchTerm
    );
    setData(res?.data);
    setTotal(res?.meta.total);
  };

  useEffect(() => {
    refreshTable(pagination, props.filter, props.sorting);
    props.typological?.getModel(props.typological.type);
  }, [
    props.typological?.type,
    pagination,
    props.filter,
    props.sorting,
    props.inputSearchConfig?.debouncedSearchTerm,
  ]);

  const hasActionInColumn = () =>
    props.actions?.some((p) => p !== TABLE_ACTION_TYPE.create);

  const hasActionCreate = () =>
    props.actions?.some((p) => p === TABLE_ACTION_TYPE.create);

  const openModal = (
    type: TABLE_ACTION_TYPE,
    currentData?: Record<string, any>
  ) => {
    setRow(currentData || {});
    setModal({
      open: true,
      data: currentData,
      type: type,
    });
  };

  const handleCloseModal = () => {
    setModal((prevState) => ({
      ...prevState,
      open: false,
    }));
  };

  const handlePageChange = (event: GridPageChangeEvent) => {
    const newPagination = {
      ...pagination,
      currentPage: event.page.skip / event.page.take + 1,
      pageSize: event.page.take,
    };
    setPagination(newPagination);
    refreshTable(
      newPagination,
      props.filter,
      props.sorting,
      props.inputSearchConfig?.inputSearch
    );
  };

  const handleSortChange = (e: GridSortChangeEvent) => {
    props.setSorting(e.sort);
  };

  return (
    <div className={styles.gridContainer}>
      <Grid
        filterable={props.filterable}
        resizable={props.resizable}
        sortable={props.sortable}
        onSortChange={handleSortChange}
        sort={props.sorting}
        filter={props.filter}
        onFilterChange={(e: GridFilterChangeEvent) => props.setFilter(e.filter)}
        style={{ height: "100%" }}
        data={data}
        total={total}
        skip={
          pagination.currentPage
            ? (pagination.currentPage - 1) * pagination.pageSize
            : 0
        }
        take={pagination.pageSize}
        pageable={true}
        onPageChange={handlePageChange}
        pager={(pagerProps) => (
          <MyPager
            {...pagerProps}
            pageSizes={props.pageSizeOptions || [5, 10, 15, 20, 30]}
          />
        )}
      >
        <GridToolbar className={styles.toolBarContainer}>
          {props.dropListLookup && (
             <DropDownList
             style={{ height: "38px" }}
             data={[
               "Role",
               "ProjectType",
               "ActivityType",
               "AccountStatus",
               "WorkScope",
               "ContractType",
             ]}
             required={false}
             disabled={false}
             onChange={(e) => {
               props.typological?.setType(e.target.value);
             }}
             value={props.typological?.type}
           />
          )}
         

          <Input
            placeholder="Cerca"
            value={props.inputSearchConfig?.inputSearch}
            onChange={props.inputSearchConfig?.handleInputSearch}
          />

          {hasActionCreate() && (
            <div>
              <Button
                svgIcon={plusIcon}
                themeColor={"primary"}
                onClick={() => {
                  openModal(TABLE_ACTION_TYPE.create);
                }}
              >
                Nuovo
              </Button>
            </div>
          )}
        </GridToolbar>

        {props.columns.map((column, idx) => (
          <GridColumn
            key={idx}
            field={column.key}
            title={column.label}
            filter={column.filter}
          />
        ))}

        {hasActionInColumn() && (
          <GridColumn
            filterable={false}
            field="action"
            cell={(cellGrid: GridCellProps) => {
              let title =
                modal.type === TABLE_ACTION_TYPE.create
                  ? "Aggiungi"
                  : modal.type === TABLE_ACTION_TYPE.show
                  ? "Visualizza"
                  : modal.type === TABLE_ACTION_TYPE.delete
                  ? "Elimina"
                  : modal.type === TABLE_ACTION_TYPE.edit
                  ? "Modifica"
                  : "";

              let callToAction =
                modal.type === TABLE_ACTION_TYPE.create
                  ? "Salva"
                  : modal.type === TABLE_ACTION_TYPE.show
                  ? "Esci"
                  : modal.type === TABLE_ACTION_TYPE.delete
                  ? "Elimina"
                  : modal.type === TABLE_ACTION_TYPE.edit
                  ? "Salva modifica"
                  : "";

              return (
                <td>
                  <div className={styles.commandButtons}>
                    {props.actions &&
                      props.actions.includes(TABLE_ACTION_TYPE.show) && (
                        <Button
                          themeColor={"primary"}
                          onClick={() =>
                            openModal(TABLE_ACTION_TYPE.show, cellGrid.dataItem)
                          }
                        >
                          <span className="k-icon k-font-icon k-i-preview"></span>
                        </Button>
                      )}
                    {props.actions &&
                      props.actions.includes(TABLE_ACTION_TYPE.edit) && (
                        <Button
                          themeColor={"primary"}
                          onClick={() =>
                            openModal(TABLE_ACTION_TYPE.edit, cellGrid.dataItem)
                          }
                        >
                          <span className="k-icon k-font-icon k-i-edit" />
                        </Button>
                      )}
                    {props.actions &&
                      props.actions.includes(TABLE_ACTION_TYPE.delete) && (
                        <Button
                          themeColor={"primary"}
                          onClick={() =>
                            openModal(
                              TABLE_ACTION_TYPE.delete,
                              cellGrid.dataItem
                            )
                          }
                        >
                          <span className="k-icon k-font-icon k-i-delete"></span>
                        </Button>
                      )}
                  </div>
                  {modal.open && (
                    <CustomWindow
                      onClose={handleCloseModal}
                      title={title}
                      show={modal.open}
                      resizable={props.resizableWindow}
                      draggable={props.draggableWindow}
                      initialHeight={props.initialHeightWindow}
                      initialWidth={props.initialWidthWindow}
                      callToAction={callToAction}
                    >
                      {props.formCrud && modal.open
                        ? props.formCrud(
                            row,
                            new TableToFormTypeAdapter().adapt(modal.type),
                            handleCloseModal,
                            () =>
                              refreshTable(
                                pagination,
                                props.filter,
                                props.sorting,
                                props.inputSearchConfig?.inputSearch
                              )
                          )
                        : null}
                    </CustomWindow>
                  )}
                </td>
              );
            }}
          />
        )}
      </Grid>
    </div>
  );
}
