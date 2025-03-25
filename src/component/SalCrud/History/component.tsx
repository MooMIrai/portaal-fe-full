import React, { useCallback, useContext } from "react";
import { salService } from "../../../services/salService";
import GridTable from "common/Table";
import { SalHistoryProject } from "./HistoryProject";
import { SalContext } from "../../../pages/Sal/provider";

const columns = [
  { key: "name", label: "Ragione sociale", type: "string", sortable: true },
  { key: "totalAmount", label: "Totale Importo Progetti", type: "number", sortable: true },
  { key: "totalBill", label: "Totale SAL Fatturato", type: "number", sortable: true }
];

export const SalHistoryCustomer = React.memo(() => {

  const { filters } = useContext(SalContext);

  const loadData = useCallback(async (pagination, filter, sorting) => {
    const include = true;
    const tableResponse = await salService.getHistoryBillCustomer(
      pagination.currentPage,
      pagination.pageSize,
      filters,
      sorting,
      include,
    );

    return {
      data: tableResponse.data,
      meta: tableResponse.meta
    };
  }, [filters]);

  const renderExpand = useCallback((rowProps) => (
    <SalHistoryProject customer={rowProps.dataItem} />
  ), []);

  return (
    <GridTable
    writePermissions={["WRITE_SALES_SAL"]}
      expand={{
        enabled: true,
        render: renderExpand,
      }}
      filterable={true}
      pageable={true}
      sortable={true}
      getData={loadData}
      columns={columns}
      resizableWindow={true}
      initialHeightWindow={800}
      draggableWindow={true}
      initialWidthWindow={900}
      resizable={true}
    />
  );
});

