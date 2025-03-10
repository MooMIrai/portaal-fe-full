import React, {
  Dispatch,
  forwardRef,
  SetStateAction,
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  useCallback,
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
  GridRowProps,
} from "@progress/kendo-react-grid";
import { Button } from "@progress/kendo-react-buttons";
import { FieldConfig, FORM_TYPE } from "../../models/formModel";
import { TableToFormTypeAdapter } from "../../adapters/tableToFormTypeAdapter";
import { FilterChangeEvent, Pager, PagerProps } from "@progress/kendo-react-data-tools";
import { PaginationModel } from "../../models/gridModel";
import {
  CompositeFilterDescriptor,
  SortDescriptor,
  //@ts-ignore
} from "@progress/kendo-data-query";
import styles from "./styles.module.scss";
import {
  plusIcon,
  pencilIcon,
  trashIcon,
  eyeIcon,
  fileExcelIcon,
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
import CustomFilter, { FilterField } from "../ExternalFilterKendoUI/component";
import * as XLSX from 'xlsx';
import ReactDOM from "react-dom";
import { FiltersForm } from "./FiltersForm/component";
import AuthService from "../../services/AuthService";

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
  externalFilter?: boolean;
  onFilterChangeExternalFilter?: (filter: CompositeFilterDescriptor) => void;
  filter?: CompositeFilterDescriptor;
  filterFields?: FilterField[];

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
    onExpandChange?: (rowData: any, expanded: boolean) => void
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

  rowStyle?: (row: any) => Record<string, any>,

  addedFilters?: FieldConfig[],
  writePermissions?:string[]
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

  const [actions,setActions] = useState<TABLE_ACTION_TYPE[]>([]);

  const debouncedFilterColumn = useDebounce(filter, 650);
  const actionMode = props.actionMode ?? "row";

  const expandChange = (event: GridExpandChangeEvent) => {
    if (data) {
      let newData = data.map((item: any, indexP) => {
        const correctIndex = (pagination.currentPage-1)===0?0:((pagination.currentPage-1)*pagination.pageSize);
        
        if ((correctIndex +indexP) === event.dataIndex) {
          item.gridtable_expanded = !event.dataItem.gridtable_expanded;
          if (props.expand && props.expand.onExpandChange) {
            props.expand.onExpandChange(item, item.gridtable_expanded);
          }
        }
        return item;
      });
      setData(newData);
    }
  };

  const refreshTable = async () => {
    const hasValidFilters = filter.filters.every((f: any) => {
      if ("filters" in f) {
          // Controlla ricorsivamente i filtri figli (CompositeFilterDescriptor)
          return f.filters.every((nestedFilter: any) => nestedFilter.value !== null);
      } else {
          // Controlla il valore del filtro (FilterDescriptor)
          return f.value !== null;
      }
  });

  // Se non ci sono filtri validi, esci senza effettuare la chiamata
  if (!hasValidFilters) {
      console.log("Nessun filtro valido, chiamata API non effettuata.");
      return;
  }
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

  useEffect(()=>{
    let actionsToSet:TABLE_ACTION_TYPE[]=[];
    if(props.actions){
      actionsToSet=props.actions();
        actionsToSet= actionsToSet.filter(a=>{
          return a===TABLE_ACTION_TYPE.show || !props.writePermissions || props.writePermissions.some(AuthService.hasPermission)
        })
    }
    setActions(actionsToSet)
  },[props.actions,props.writePermissions])

  const hasActionInColumn = useCallback(() =>
    actions.some((p: string) => p !== TABLE_ACTION_TYPE.create)
  ,[actions]);

  const hasActionCreate = useCallback(() =>
    actions.some((p: string) => p === TABLE_ACTION_TYPE.create)
  ,[actions]);

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


  const rowRender = (trElement: any, propsR: GridRowProps) => {

    const trProps: any = {};

    if (props.rowStyle && propsR.dataItem) {
      trProps.style = props.rowStyle(propsR.dataItem);
    }
  
    if(props.onRowClick){
      trProps.onClick=()=>{
        if(props.onRowClick)
          props.onRowClick(propsR.dataItem)

      }
    }

    return React.cloneElement(
      trElement,
      {
        ...trProps
      },
      trElement.props.children
    );
  };
  const onFilterChangeExternal = (event: FilterChangeEvent) => {
    setFilter(event.filter);
};



//excel export CM 
  //const _export = React.useRef<ExcelExport | null>(null);

  const getProperty=( propertyName:string, object:any )=> {
    var parts = propertyName.split( "." ),
      length = parts.length,
      i,
      property = object || this;
  
    for ( i = 0; i < length; i++ ) {
      property = property[parts[i]];
    }
  
    return property;
  }
  const readInnerTextFromElement=(element:any)=> {
    // Creare un container nascosto
    const container = document.createElement('div');
    container.style.display = 'none'; // Nascondere il container
    document.body.appendChild(container);
  
    // Renderizzare il componente React nel container
    ReactDOM.render(element, container);
  
    // Leggere l'innerText del container
    const innerText = container.innerText;
  
    // Rimuovere il container dopo aver letto il contenuto
    document.body.removeChild(container);
  
    return innerText;
  }

  const excelExport = () => {
    if(data){
      const workbook = XLSX.utils.book_new();
      
      const newArr = data.map((row,rowIndex)=>{
        let objRow:any={};
        props.columns.forEach(column=>{
          
          try{
            if(column.render){
              objRow[column.label]=readInnerTextFromElement(column.render(row));
            }else{
              objRow[column.label]=getProperty(column.key,row)
            }
            
          }catch(ex){
            console.log('excel error on row ' + rowIndex+ ' column '+ column.label )
          }
            
          
        });
        return objRow;
      });
      // Convert JSON data to a worksheet
      const worksheet = XLSX.utils.json_to_sheet(newArr);

      // Append the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      // Export the workbook as an Excel file
      XLSX.writeFile(workbook, "data.xlsx");
    }
    
  };

  return (
    <div className={styles.gridContainer}>
      
      <Grid
        ref={gridRef}
        rowRender={rowRender}
        {...expandedProps}
        filterable={false}
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
        pageable={props.pageable===undefined || props.pageable}
        onPageChange={handlePageChange}
        pager={(pagerProps) => (
          <MyPager
            {...pagerProps}
            pageSizes={props.pageSizeOptions || [5, 10, 15, 20, 30, "ALL"]}
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

        {props.customToolBarComponent || hasActionCreate() || props.filterable ? <GridToolbar className={styles.toolBarContainer}>
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
          
            <Button
              svgIcon={fileExcelIcon}
              themeColor={"success"}
              onClick={excelExport}
            >
              Esporta
            </Button>
            {props.columns && props.filterable && (
              <FiltersForm columns={props.columns} onSubmit={setFilter} addedFilters={props.addedFilters}/>
            )}
        </GridToolbar> : null}

        {props.columns.map((column: TableColumn, idx: number) => {

          let cell: React.ComponentType<GridCellProps> | undefined;
          if (column.type === TABLE_COLUMN_TYPE.date) {
            cell = (cellGrid: GridCellProps) => {
              let dateString = 'Nessuna data';
              if (cellGrid.dataItem[column.key]) {
                const date = new Date(cellGrid.dataItem[column.key]);
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const year = date.getFullYear();
                dateString = `${day}/${month}/${year}`;
              }

              return (
                <td>
                  <strong>
                    <i>{dateString}</i>
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
            locked={true}
            
            cell={(cellGrid: GridCellProps) => {
              
              
              return (
                <td 
                style={{
                  position: "sticky",
                  right: 0,
                  //background: "white", // Evita sovrapposizioni visive
                  //zIndex: 1, // Assicura che sia sopra le altre celle
                }}
                >
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
  //@ts-ignore
  return <GenericGridC {...props} ref={ref} />;
});

export default GenericGrid;
