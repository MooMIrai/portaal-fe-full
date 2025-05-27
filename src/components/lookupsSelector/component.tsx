import withAutoComplete from "common/hoc/AutoComplete";

export const getLookups = [    
  { id: 2, name: "ProjectType" },
  { id: 3, name: "ActivityType" },
  { id: 4, name: "AccountStatus" },
  { id: 5, name: "WorkScope" },
  { id: 6, name: "ContractType" },
  { id: 7, name: "ProjectExpenses"},
  { id: 8, name: "NotificationStatus"},
  { id: 9, name: "NotifyResponseType"},
  { id: 10, name: "EmailDefault"}
];

const getLookupsPromise = () => Promise.resolve(getLookups);

export const LookUpsSelector = withAutoComplete(getLookupsPromise);
