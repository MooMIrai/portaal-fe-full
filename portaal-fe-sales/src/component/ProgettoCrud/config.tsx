import * as React from "react";

function formatNumber(num) {
  if(typeof num != 'number') return num;
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(num);
}

export const columns = [
  {
    key: "AccountManager",
    label: "Commerciale",
    type: "string",
    sortable: true,
    filter: "text",
  },
  {
    key: "offer_name",
    label: "Titolo offerta",
    type: "string",
    sortable: true,
    filter: "text",
  },
  {
    key: "start_date",
    label: "Data inizio",
    type: "date",
    sortable: true,
    filter: "date",
  },
  {
    key: "end_date",
    label: "Data fine",
    type: "date",
    sortable: true,
    filter: "date",
  },
  {
    key: "amount",
    label: "Importo",
    type: "custom",
    sortable: true,
    filter: "text",
    render:(dataItem)=>{
      return <td>{formatNumber(dataItem.amount)}</td>
    }
  },
  {
    key: "sal_total",
    label: "Sal",
    type: "custom",
    sortable: true,
    filter: "text",
    render:(dataItem)=>{
      return <td>{formatNumber(dataItem.sal_total)}</td>
    }
  },
  {
    key: "bill_total",
    label: "Sal Fatturato",
    type: "custom",
    sortable: true,
    filter: "text",
    render:(dataItem)=>{
      return <td>{formatNumber(dataItem.bill_total)}</td>
    }
  },
];

export const SalColumns = [
  {
    key: "month",
    label: "Mese",
    type: "string",
    sortable: true,
    filter: "text",
  },
  {
    key: "year",
    label: "Anno",
    type: "string",
    sortable: true,
    filter: "text",
  },
  {
    key: "activity_id",
    label: "ID Attività",
    type: "string",
    sortable: false,
    filter: "text",
  },
  {
    key: "amount",
    label: "Importo",
    type: "string",
    sortable: true,
    filter: "text",
  },
  {
    key: "Bill",
    label: "Fatturazione",
    type: "string",
    sortable: true,
    filter: "text",
  },
  {
    key: "SalState",
    label: "Stato SAL",
    type: "string",
    sortable: true,
    filter: "text",
  },
  {
    key: "notes",
    label: "Note",
    type: "string",
    sortable: false,
    filter: "text",
  },
  {
    key: "rate",
    label: "Tariffa",
    type: "int",
    sortable: true,
    filter: "numeric",
  },
];

export const attivitaColumns = [
  {
    key: "description",
    label: "Descrizione",
    type: "string",
    sortable: false,
    filter: "text",
  },
  {
    key: "start_date",
    label: "Data inizio",
    type: "date",
    sortable: true,
    filter: "date",
  },
  {
    key: "end_date",
    label: "Data fine",
    type: "date",
    sortable: true,
    filter: "date",
  },
  {
    key: "ActivityType.description",
    label: "Tipo",
    type: "string",
    sortable: false,
    filter: "text",
  },
];

export const attivitaAssegnazioneColumns = [
  {
    key: "Person.firstName",
    label: "Nome",
    type: "string",
    sortable: false,
    filter: "text",
  },
  {
    key: "Person.lastName",
    label: "Cognome",
    type: "string",
    sortable: false,
    filter: "text",
  },
  {
    key: "start_date",
    label: "Data inizio",
    type: "date",
    sortable: true,
    filter: "date",
  },
  {
    key: "end_date",
    label: "Data fine",
    type: "date",
    sortable: true,
    filter: "date",
  },
  {
    key: "expectedDays",
    label: "Giorni previsti",
    type: "int",
    sortable: true,
    filter: "numeric",
  },
]

export const costiCommessaColumns = [
  {
    key: "description",
    label: "Descrizione",
    type: "string",
    sortable: false,
    filter: "text",
  },
  {
    key: "amount",
    label: "Importo",
    type: "string",
    sortable: true,
    filter: "text",
  },
  {
    key: "payment_date",
    label: "Data pagamento",
    type: "date",
    sortable: true,
    filter: "date",
  },
  {
    key: "ProjectExpensesType.description",
    label: "Tipo",
    type: "string",
    sortable: false,
    filter: "text",
  }
]