import React from "react";
import GridTable from "common/Table";
import { customerService } from "../../services/clienteService";
import ProjectTable from "../../component/ProgettoCrud/component";
import { columnsCustomer } from "./config";

export default function ProgettiPage() {

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

  const loadData = async (pagination: any, filter: any, sorting: any[]) => {

    const yearFilterNames = yearFilter.map(filter => filter.name);
    const currentFilters = (filter?.filters || []).map(filter => filter.field);

    if (!yearFilterNames.some(name => currentFilters.includes(name))) {

      const currentDate = new Date();

      const dateFilters = [
        {
          field: "fromYear",
          operator: "eq",
          value: currentDate.getFullYear() - 1
        },
        {
          field: "toYear",
          operator: "eq",
          value: currentDate.getFullYear()
        }
      ];

      if (!filter) filter = {};
      filter.logic = "AND";
      filter.filters = [...(filter.filters || []), ...dateFilters];
    }

    const tableResponse = await customerService.getHasProject(pagination.currentPage,pagination.pageSize,filter,sorting,undefined,true);
    
    return {
      data: tableResponse?.data,
      meta: {
        total: tableResponse?.meta?.total,
      },
    };
  };


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
