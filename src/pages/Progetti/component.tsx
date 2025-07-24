import React, { useState } from "react";
import GridTable from "common/Table";
import { customerService } from "../../services/clienteService";
import { CrudGenericService } from "../../services/personaleServices";
import ProjectTable from "../../component/ProgettoCrud/component";
import { columnsCustomer } from "./config";

export default function ProgettiPage() {

  const [currentFilter, setCurrentFilter] = useState<any>();

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
    setCurrentFilter(filter);

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
        render: (rowProps) => <ProjectTable customer={rowProps.dataItem.id} currentFilter={currentFilter} />,
      }}
      filterable={true}
      sortable={true}
      getData={loadData}
      columns={columnsCustomer}
      addedFilters = {[
        ...yearFilter, 
        {
          name: "person_id",
          label: "Dipendente assegnato",
          type: "filter-autocomplete",
          options: {
              getData: (term: string) => Promise.resolve(
                CrudGenericService.searchAccount(term).then(res => {
                  if(res) return res.map(r => ({id: r.person_id, name: `${r.firstName} ${r.lastName} (${r.email})`}));
                  else return [];
                })
              ),
              getValue: (v: any) => v?.id
          }
        },
        {
          name: "id",
          label: "Cliente",
          indexPosition: 1,
          type: "filter-autocomplete",
          options: {
            getData: (term: string) => Promise.resolve(
              customerService.searchCustomer(term).then(res => {
                if (res) return res.map(r => ({id: r.id, name: r.name}));
                else return [];
              })
            ),
            getValue: (v: any) => v?.id
          }
        }
      ]}
      resizableWindow={true}
      draggableWindow={true}
      initialHeightWindow={800}
      initialWidthWindow={900}
      resizable={true}
      pageable={true}
    />
  );
}
