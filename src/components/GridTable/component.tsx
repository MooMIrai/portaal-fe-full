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

  //filter
  filterable?: boolean;

  //style
  className?: string;
  customIcon?: string;
  customHeader?: string;
  resizable?: boolean;
  dropListLookup?: boolean;

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

  expand?: {
    enabled: boolean;
    render: (props: GridDetailRowProps) => JSX.Element;
  };

  //
  customToolBarComponent?: (refreshTable: () => void) => JSX.Element;

  //props for window Modal
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
  onStageChangeWindow?: (event: WindowActionsEvent) => void
  classNameWindow?: string
  classNameWindowDelete?: string
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

const GenericGridC = forwardRef<any, any>((props, ref) => {
  const gridRef = useRef<any>(null); // Reference per il componente Kendo Grid

  const [modal, setModal] = useState<{
    open: boolean;
    data?: Record<string, any>;
    type?: TABLE_ACTION_TYPE;
  }>({ open: false });

  const [total, setTotal] = useState<number>(0);
  const [pagination, setPagination] = useState<PaginationModel>({
    currentPage: 1,
    pageSize: 10,
  });
  const [data, setData] = useState<Array<Record<string, any>>>();
  const [row, setRow] = useState<Record<string, any> | undefined>(undefined);
  const [filter, setFilter] = useState<any>({ logic: "or", filters: [] });
  const [sorting, setSorting] = useState<any[]>([]);
  const [loading, setLoading] = useState(false)
  const debouncedFilterColumn = useDebounce(filter, 650);

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
    setLoading(true)
    const res = await props.getData(pagination, filter, sorting);
    setData(res?.data);
    setTotal(res?.meta.total);
    setLoading(false)
  };

  useEffect(() => {
    refreshTable();
  }, [pagination, debouncedFilterColumn, sorting]);

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

  const handlePageChange = (event: GridPageChangeEvent) => {
    const newPagination = {
      ...pagination,
      currentPage: event.page.skip / event.page.take + 1,
      pageSize: event.page.take,
    };
    setPagination(newPagination);
    refreshTable();
  };

  const handleSortChange = (e: GridSortChangeEvent) => {
    setSorting(e.sort);
  };

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

  let expandedProps = {};
  if (props.expand && props.expand.enabled) {
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
    modal.type === TABLE_ACTION_TYPE.delete
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
      pageable={true}
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

      <GridToolbar className={styles.toolBarContainer}>
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
      </GridToolbar>

    
      {props.columns.map((column: any, idx: number) => {
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
        return (
          <GridColumn
            key={idx}
            field={column.key}
            title={column.label}
            filter={column.filter}
            sortable={column.sortable}
            cell={cell}
          />
        );
      })}

    
      {hasActionInColumn() && (
        <GridColumn
          filterable={false}
          field="action"
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
    </Grid>
    <CustomWindow
      showModalFooter={false}
      onClose={handleCloseModal}
      title={title}
      show={modal.open}
      resizable={props.resizableWindow}
      draggable={props.draggableWindow}
      initialHeight={props.initialHeightWindow}
      initialWidth={props.initialWidthWindow}
      left={props.leftWindow}
      top={props.topWindow}
      height={props.heightWindow}
      width={props.widthWindow}
      callToAction={callToAction}
      stage={props.stageWindow}
      onStageChange={props.onStageChangeWindow}
      className={windowClassName}
    >
      {props.formCrud && modal.open
        ? props.formCrud(
            row,
            new TableToFormTypeAdapter().adapt(modal.type),
            handleCloseModal,
            () => refreshTable()
          )
        : null}
    </CustomWindow>
  </div>
);
});

const GenericGrid = forwardRef<TablePaginatedProps, any>((props, ref) => {
  return <GenericGridC {...props} ref={ref} />;
});

export default GenericGrid;
