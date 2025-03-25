import withAutoComplete from "common/hoc/AutoComplete";

const getLookups = () =>
  Promise.resolve([
  
    { id: 2, name: "ProjectType" },
    { id: 3, name: "ActivityType" },
    { id: 4, name: "AccountStatus" },
    { id: 5, name: "WorkScope" },
    { id: 6, name: "ContractType" },
    { id: 7, name: "ProjectExpenses"},
    { id: 8, name: "NotificationStatus"},
    { id: 9, name: "NotifyResponseType"},
    { id: 10, name: "EmailDefault"}
  ]);

export const LookUpsSelector = withAutoComplete(getLookups);
