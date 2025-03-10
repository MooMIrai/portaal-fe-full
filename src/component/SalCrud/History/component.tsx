import React, { useCallback } from "react";
import { salService } from "../../../services/salService";
import GridTable from "common/Table";
import { SalHistoryProject } from "./HistoryProject";

const columns = [
  { key: "customer_code", label: "Codice", type: "string", sortable: true, filter: "text" },
  { key: "name", label: "Ragione sociale", type: "string", sortable: true, filter: "text" },
  { key: "vatNumber", label: "P.IVA", type: "string", sortable: true, filter: "numeric" },
  { key: "lastSal", label: "Ultimo SAL", type: "date", sortable: true, filter: "date" },
  { key: "totalSal", label: "Totale SAL", type: "number", sortable: true, filter: "number" },
];

export const SalHistoryCustomer = React.memo(() => {
  const loadData = useCallback(async (pagination, filter, sorting) => {
    const include = true;
    const tableResponse = await salService.getHistoryBillCustomer(
      pagination.currentPage,
      pagination.pageSize,
      filter,
      sorting,
      include,
    );

    return {
      data: tableResponse.data,
      meta: { total: tableResponse.meta.model },
    };
  }, []);

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

