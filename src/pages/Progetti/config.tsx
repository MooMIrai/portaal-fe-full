import * as React from "react";

function formatNumber(num) {
  if(typeof num != 'number') return num;
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(num);
}

export const columnsCustomer = [
  {
    key: "name",
    label: "Cliente",
    type: "custom",
    sortable: true,
    filter: "text",
    render: (dataItem) => {
      return <td>{dataItem.name}</td>
    }
  },
  {
    key: "amount_total",
    label: "Totale importo",
    type: "custom",
    sortable: true,
    filter: "text",
    render:(dataItem)=>{
      return <td>{formatNumber(dataItem.amount_total)}</td>
    }
  },
  {
    key: "sal_total",
    label: "Totale Sal",
    type: "custom",
    sortable: true,
    filter: "text",
    render:(dataItem)=>{
      return <td>{formatNumber(dataItem.sal_total)}</td>
    }
  },
  {
    key: "bill_total",
    label: "Totale Sal Fatturato",
    type: "custom",
    sortable: true,
    filter: "text",
    render:(dataItem)=>{
      return <td>{formatNumber(dataItem.bill_total)}</td>
    }
  },
];
