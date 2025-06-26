import React from "react";
import GridTable from "common/Table";
import { customerService } from "../../services/clienteService";
import ProjectTable from "../../component/ProgettoCrud/component";
import { columnsCustomer } from "./config";

export default function ProgettiPage() {

  const loadData = async (pagination: any, filter: any, sorting: any[]) => {
    const tableResponse = await customerService.getHasProject(pagination.currentPage,pagination.pageSize,filter,sorting,undefined,true);
    
    return {
      data: tableResponse?.data,
      meta: {
        total: tableResponse?.meta?.total,
      },
    };
  };

  const yearFilter = [
    {
      name: "fromYear",
      label: "Anno da",
      type: "number"
    },
    {
      name: "toYear",
      label: "Anno a",
      type: "number"
    }
  ];

  return (
    <GridTable
      writePermissions={["WRITE_SALES_PROJECT"]}
      expand={{
        enabled: true,
        render: (rowProps) => <ProjectTable customer={rowProps.dataItem.id} />,
      }}
      filterable={true}
      sortable={true}
      getData={loadData}
      columns={columnsCustomer}
      addedFilters = {[...yearFilter]}
      resizableWindow={true}
      draggableWindow={true}
      initialHeightWindow={800}
      initialWidthWindow={900}
      resizable={true}
      pageable={true}
    />
  );
}
