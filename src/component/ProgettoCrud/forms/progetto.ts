export const progettoForm = {
    "Offer":{
        "name":"Offer",
        "type":"offerta-form",
        noContainer:true
    },
    "workedDays": {
      "name": "workedDays",
      "type": "number",
      "label": "Giorni lavorati",
      "value": "",
      "required": false,
      "options": [],
      "showLabel": true,
      disabled:true
    },
    /* "offerte-selector": {
      "name": "offer_id",
      "type": "offerte-selector",
      "label": "Offerta",
      "value": "",
      "required": true,
      "options": [],
      "showLabel": true
    }, */
    "ProjectState": {
      "name": "ProjectState",
      "type": "select",
      "label": "Stato",
      "value": "",
      "required": true,
      "options": [
        "OPEN",
        "CLOSED",
        "INPROGRESS"
      ],
      "showLabel": false
    },
    "start_date": {
      "name": "start_date",
      "type": "date",
      "label": "Data inizio",
      "value": "",
      "required": true,
      "options": [],
      "showLabel": true
    },
    "end_date": {
      "name": "end_date",
      "type": "date",
      "label": "Data fine",
      "value": "",
      "required": false,
      "options": [],
      "showLabel": true
    },
    "rate": {
      "name": "rate",
      "type": "number",
      "label": "Tariffa",
      "value": "",
      "required": false,
      "options": [],
      "showLabel": true,
    },
    "amount": {
      "name": "amount",
      "type": "number",
      "label": "Importo",
      "value": "",
      "required": false,
      "options": [],
      "showLabel": true
    },
    "orderNum": {
      "name": "orderNum",
      "type": "text",
      "label": "Numero Ordine",
      "value": "",
      "required": false,
      "options": [],
      "showLabel": true
    },
    "waitingForOrder": {
      "name": "waitingForOrder",
      "type": "checkbox",
      "label": "In attesa dell'ordine",
      "value": "",
      "required": false,
      "options": [],
      "showLabel": false
    }
  }