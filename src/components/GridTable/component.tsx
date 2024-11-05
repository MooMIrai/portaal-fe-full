import React, {
  Dispatch,
  forwardRef,
  SetStateAction,
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
} from "react";
import {
  Grid,
  GridColumn,
  GridToolbar,
  GridCellProps,
  GridPageChangeEvent,
  GridSortChangeEvent,
  GridExpandChangeEvent,
  GridDetailRowProps,
  GridProps,
  GridNoRecords,
} from "@progress/kendo-react-grid";
import { Button } from "@progress/kendo-react-buttons";
import { FORM_TYPE } from "../../models/formModel";
import { TableToFormTypeAdapter } from "../../adapters/tableToFormTypeAdapter";
import { Pager, PagerProps } from "@progress/kendo-react-data-tools";
import { PaginationModel } from "../../models/gridModel";
import {
  CompositeFilterDescriptor,
  SortDescriptor,
} from "@progress/kendo-data-query";
import styles from "./styles.module.scss";
import {
  plusIcon,
  pencilIcon,
  trashIcon,
  eyeIcon,
} from "@progress/kendo-svg-icons";
import {
  TableColumn,
  TABLE_ACTION_TYPE,
  TABLE_COLUMN_TYPE,
} from "../../models/tableModel";
import CustomWindow from "../Window/component";
import { useDebounce } from "@uidotdev/usehooks";
import { WindowActionsEvent } from "@progress/kendo-react-dialogs";
import { Loader } from "@progress/kendo-react-indicators";
import CellAction from "./CellAction/component";

interface CustomRowAction {
  icon: any;
  themeColor?: "base" | "info" | "primary" | "secondary" | "tertiary" | "success" | "warning" | "error" | "dark" | "light" | "inverse" | null | undefined;
  modalContent?: (
    dataItem: any,
    closeModal: () => void,
    refreshTable: () => void
  ) => JSX.Element;
  tooltip?: string;
}

interface TablePaginatedProps extends GridProps {
  ref?: any;
  pageSizeOptions?: number[];
  getData: (
    pagination: PaginationModel,
    filter?: CompositeFilterDescriptor,
    sorting?: SortDescriptor[]
  ) => Promise<{ data: Array<Record<string, any>>; meta: { total: number } }>;
  columns: TableColumn[];
  actions: (row?: Record<string, any> | undefined) => TABLE_ACTION_TYPE[];

  // Filter
  filterable?: boolean;

  // Style
  className?: string;
  customIcon?: string;
  customHeader?: string;
  resizable?: boolean;
  dropListLookup?: boolean;

  // Sort
  sortable?: boolean;
  sorting: SortDescriptor[];
  setSorting: (sorting: SortDescriptor[]) => void;

  // Generic CRUD table config
  typological?: {
    type: string;
    setType: Dispatch<SetStateAction<string>>;
    getModel: (type: string) => Promise<void>;
  };

  // Form for CRUD actions
  formCrud?: (
    row: Record<string, any> | undefined,
    type: FORM_TYPE,
    closeModalCallback: () => void,
    refreshTable: () => void
  ) => JSX.Element;
  initialPagination: PaginationModel;

  expand?: {
    enabled: boolean;
    render: (props: GridDetailRowProps) => JSX.Element;
  };

  customToolBarComponent?: (refreshTable: () => void) => JSX.Element;

  // Pagination
  pageable?: boolean;

  // Actions
  actionMode?: "row" | "cell";

  // Props for Window Modal
  widthWindow?: number;
  heightWindow?: number;
  leftWindow?: number;
  topWindow?: number;
  resizableWindow?: boolean;
  draggableWindow?: boolean;
  minHeightWindow?: number;
  minWidthWindow?: number;
  initialHeightWindow?: number;
  initialWidthWindow?: number;
  stageWindow?: string;
  onStageChangeWindow?: (event: WindowActionsEvent) => void;
  classNameWindow?: string;
  classNameWindowDelete?: string;

  // Custom Row Actions
  customRowActions?: CustomRowAction[];

  forceRefresh?: number;
}

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

const GenericGridC = forwardRef<any, TablePaginatedProps>((props, ref) => {
  const gridRef = useRef<any>(null);
  const [modal, setModal] = useState<{
    open: boolean;
    data?: Record<string, any>;
    type?: TABLE_ACTION_TYPE;
  }>({ open: false });

  const [cellModal, setCellModal] = useState<{
    open: boolean;
    dataItem: any;
    field: string | null;
    content: ((dataItem: any) => JSX.Element) | null;
    title: string | null;
  }>({
    open: false,
    dataItem: null,
    field: null,
    content: null,
    title: null,
  });

  const [customActionModal, setCustomActionModal] = useState<{
    open: boolean;
    dataItem: any;
    actionIndex: number | null;
  }>({
    open: false,
    dataItem: null,
    actionIndex: null,
  });

  const openCustomActionModal = (dataItem: any, actionIndex: number) => {
    setCustomActionModal({
      open: true,
      dataItem,
      actionIndex,
    });
  };

  const closeCustomActionModal = () => {
    setCustomActionModal({
      open: false,
      dataItem: null,
      actionIndex: null,
    });
  };

  const [total, setTotal] = useState<number>(0);
  const [pagination, setPagination] = useState<PaginationModel>(
    props.initialPagination || {
      currentPage: 1,
      pageSize: 10,
    }
  );
  const [data, setData] = useState<Array<Record<string, any>>>();
  const [row, setRow] = useState<Record<string, any> | undefined>(undefined);
  const [filter, setFilter] = useState<any>({ logic: "or", filters: [] });
  const [sorting, setSorting] = useState<any[]>(props.sorting || []);
  const [loading, setLoading] = useState(false);
  const debouncedFilterColumn = useDebounce(filter, 650);
  const actionMode = props.actionMode ?? "row";

  const expandChange = (event: GridExpandChangeEvent) => {
    if (data) {
      let newData = data.map((item: any, indexP) => {
        if (indexP === event.dataIndex) {
          item.gridtable_expanded = !event.dataItem.gridtable_expanded;
        }
        return item;
      });
      setData(newData);
    }
  };

  const refreshTable = async () => {
    setLoading(true);
    const res = await props.getData(pagination, filter, sorting);
    setData(res?.data);
    setTotal(res?.meta.total);
    setLoading(false);
  };

  useEffect(() => {
    refreshTable();
  }, [pagination, debouncedFilterColumn, sorting]);

  useEffect(() => {
    if (props.forceRefresh) {
      refreshTable();
    }
  }, [props.forceRefresh])


  useImperativeHandle(ref, () => ({
    refreshTable,
    grid: gridRef.current,
  }));

  const hasActionInColumn = () =>
    props.actions?.()?.some((p: string) => p !== TABLE_ACTION_TYPE.create);

  const hasActionCreate = () =>
    props.actions?.()?.some((p: string) => p === TABLE_ACTION_TYPE.create);

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

  const openCellModal = (
    dataItem: any,
    field: string,
    content: ((dataItem: any) => JSX.Element) | null,
    title: string
  ) => {
    setCellModal({
      open: true,
      dataItem,
      field,
      content,
      title,
    });
  };

  const closeCellModal = () => {
    setCellModal({
      open: false,
      dataItem: null,
      field: null,
      content: null,
      title: null,
    });
  };

  const handlePageChange = (event: GridPageChangeEvent) => {
    const newPagination = {
      ...pagination,
      currentPage: event.page.skip / event.page.take + 1,
      pageSize: event.page.take,
    };
    setPagination(newPagination);
    /*  refreshTable(); */
  };

  const handleSortChange = (e: GridSortChangeEvent) => {
    setSorting(e.sort);
    props.setSorting?.(e.sort);
  };

  const modalConfig: Record<
    TABLE_ACTION_TYPE,
    { title: string; callToAction: string }
  > = {
    [TABLE_ACTION_TYPE.create]: {
      title: "Aggiungi",
      callToAction: "Salva",
    },
    [TABLE_ACTION_TYPE.show]: {
      title: "Visualizza",
      callToAction: "Esci",
    },
    [TABLE_ACTION_TYPE.delete]: {
      title: "Elimina",
      callToAction: "Elimina",
    },
    [TABLE_ACTION_TYPE.edit]: {
      title: "Modifica",
      callToAction: "Salva modifica",
    },
    [TABLE_ACTION_TYPE.custom]: {
      title: "Personalizzato",
      callToAction: "Conferma",
    },
  };

  const title = modal.open && modal.type ? modalConfig[modal.type]?.title : "";
  const callToAction =
    modal.open && modal.type ? modalConfig[modal.type]?.callToAction : "";

  let expandedProps = {};
  if (props.expand?.enabled) {
    expandedProps = {
      expandField: "gridtable_expanded",
      onExpandChange: expandChange,
      detail: props.expand.render,
    };
  }

  const handleFilterColumnChange = (e: any) => {
    setFilter(e.filter);
  };
  const windowClassName =
    modal.open && modal.type === TABLE_ACTION_TYPE.delete
      ? props.classNameWindowDelete
      : props.classNameWindow;

  return (
    <div className={styles.gridContainer}>
      <Grid
        ref={gridRef}
        {...expandedProps}
        filterable={props.filterable}
        resizable={props.resizable}
        sortable={props.sortable}
        onSortChange={handleSortChange}
        sort={sorting}
        filter={filter}
        onFilterChange={handleFilterColumnChange}
        style={{ height: "100%", borderRadius: "5px" }}
        data={loading ? [] : data}
        total={total}
        skip={
          pagination.currentPage
            ? (pagination.currentPage - 1) * pagination.pageSize
            : 0
        }
        take={pagination.pageSize}
        pageable={props.pageable}
        onPageChange={handlePageChange}
        pager={(pagerProps) => (
          <MyPager
            {...pagerProps}
            pageSizes={props.pageSizeOptions || [5, 10, 15, 20, 30]}
          />
        )}
      >
        <GridNoRecords>
          {loading ? (
            <div className={styles.loaderContainer}>
              <Loader size="medium" type="pulsing" />
            </div>
          ) : (
            "Nessun record disponibile."
          )}
        </GridNoRecords>

        {props.customToolBarComponent || hasActionCreate() ?<GridToolbar className={styles.toolBarContainer}>
          {props.customToolBarComponent?.(refreshTable)}

          {hasActionCreate() && (
            <div>
              <Button
                svgIcon={plusIcon}
                themeColor={"primary"}
                onClick={() => openModal(TABLE_ACTION_TYPE.create)}
              >
                Nuovo
              </Button>
            </div>
          )}
        </GridToolbar>:null}

        {props.columns.map((column: TableColumn, idx: number) => {
          let cell: React.ComponentType<GridCellProps> | undefined;
          if (column.type === TABLE_COLUMN_TYPE.date) {
            cell = (cellGrid: GridCellProps) => {
              const date = new Date(cellGrid.dataItem[column.key]);
              const day = String(date.getDate()).padStart(2, "0");
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const year = date.getFullYear();
              return (
                <td>
                  <strong>
                    <i>{`${day}/${month}/${year}`}</i>
                  </strong>
                </td>
              );
            };
          }
          if (column.type === TABLE_COLUMN_TYPE.datetime) {
            cell = (cellGrid: GridCellProps) => {
              const date = new Date(cellGrid.dataItem[column.key]);
              const time = date.toLocaleTimeString().substring(0, 5);
              return (
                <td>
                  <strong>
                    <i>{date.toLocaleDateString() + " - " + time}</i>
                  </strong>
                </td>
              );
            };
          } else if (
            actionMode === "cell" &&
            column.hasCellAction &&
            column.cellActionIcon !== undefined
          ) {
            cell = (cellGrid: GridCellProps) => (
              <CellAction
                {...cellGrid}
                field={column.key}
                openCellModal={openCellModal}
                icon={column.cellActionIcon!}
                cellModalContent={column.cellModalContent}
                columnLabel={column.label}
              />
            );
          } else if (column.type === TABLE_COLUMN_TYPE.custom) {
            cell = (cellGrid: GridCellProps) => <>{column.render ? column.render(cellGrid.dataItem, refreshTable) : null}</>
          }
          return (
            <GridColumn
              key={idx}
              field={column.key}
              title={column.label}
              filter={column.filter}
              filterCell={column.filterCell}
              filterable={!!column.filter}
              sortable={column.sortable}
              width={column.width}
              cell={cell}
            />
          );
        })}

        {actionMode === "row" && hasActionInColumn() && (
          <GridColumn
            filterable={false}
            sortable={false}
            field="action"
            title="Azioni"
            cell={(cellGrid: GridCellProps) => {
              const actions = props.actions?.(cellGrid.dataItem);

              return (
                <td>
                  <div className={styles.commandButtons}>
                    {actions?.includes(TABLE_ACTION_TYPE.show) && (
                      <Button
                        svgIcon={eyeIcon}
                        fillMode={"link"}
                        themeColor={"info"}
                        onClick={() =>
                          openModal(TABLE_ACTION_TYPE.show, cellGrid.dataItem)
                        }
                      ></Button>
                    )}
                    {actions?.includes(TABLE_ACTION_TYPE.edit) && (
                      <Button
                        svgIcon={pencilIcon}
                        fillMode={"link"}
                        themeColor={"warning"}
                        onClick={() =>
                          openModal(TABLE_ACTION_TYPE.edit, cellGrid.dataItem)
                        }
                      ></Button>
                    )}
                    {actions?.includes(TABLE_ACTION_TYPE.delete) && (
                      <Button
                        svgIcon={trashIcon}
                        fillMode={"link"}
                        themeColor={"error"}
                        onClick={() =>
                          openModal(TABLE_ACTION_TYPE.delete, cellGrid.dataItem)
                        }
                      ></Button>
                    )}
                  </div>
                </td>
              );
            }}
          />
        )}

        {/* Colonna delle azioni personalizzate */}
        {props.customRowActions && (
          <GridColumn
            field="customActions"
            filterable={false}
            sortable={false}
            title="Azioni Personalizzate"
            cell={(cellGrid: GridCellProps) => (
              <td>
                <div className={styles.commandCustomButtons}>
                  {props.customRowActions!.map((action, index) => (
                    <Button
                      key={index}
                      themeColor={action.themeColor}
                      svgIcon={action.icon}
                      fillMode="link"
                      onClick={() =>
                        openCustomActionModal(cellGrid.dataItem, index)
                      }
                      title={action.tooltip}
                    />
                  ))}
                </div>
              </td>
            )}
          />
        )}
      </Grid>

      <CustomWindow
        showModalFooter={false}
        onClose={
          modal.open
            ? handleCloseModal
            : customActionModal.open
              ? closeCustomActionModal
              : cellModal.open
                ? closeCellModal
                : () => { }
        }
        title={
          modal.open
            ? title
            : customActionModal.open && customActionModal.actionIndex !== null
              ? props.customRowActions?.[customActionModal.actionIndex]
                ?.tooltip || ""
              : cellModal.open && cellModal.title
                ? `Azione su ${cellModal.title}`
                : ""
        }
        show={modal.open || customActionModal.open || cellModal.open}
        resizable={props.resizableWindow}
        draggable={props.draggableWindow}
        initialHeight={props.initialHeightWindow}
        initialWidth={props.initialWidthWindow}
        left={props.leftWindow}
        top={props.topWindow}
        height={props.heightWindow}
        width={props.widthWindow}
        stage={props.stageWindow}
        onStageChange={props.onStageChangeWindow}
        className={windowClassName}
      >
        {modal.open && props.formCrud && modal.type
          ? props.formCrud(
            row,
            new TableToFormTypeAdapter().adapt(modal.type),
            handleCloseModal,
            refreshTable
          )
          : customActionModal.open &&
            customActionModal.actionIndex !== null &&
            props.customRowActions?.[customActionModal.actionIndex]
              ?.modalContent
            ? props.customRowActions[customActionModal.actionIndex!]
              .modalContent!(
                customActionModal.dataItem,
                closeCustomActionModal,
                refreshTable
              )
            : cellModal.open && cellModal.content
              ? cellModal.content(cellModal.dataItem)
              : null}
      </CustomWindow>
    </div>
  );
});

const GenericGrid = forwardRef<TablePaginatedProps, any>((props, ref) => {
  return <GenericGridC {...props} ref={ref} />;
});

export default GenericGrid;
