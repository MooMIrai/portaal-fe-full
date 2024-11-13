import withAutoComplete from "common/hoc/AutoComplete";

const getLookups = () =>
  Promise.resolve([
    { id: 1, name: "Role" },
    { id: 2, name: "ProjectType" },
    { id: 3, name: "ActivityType" },
    { id: 4, name: "AccountStatus" },
    { id: 5, name: "WorkScope" },
    { id: 6, name: "ContractType" },
    { id: 7, name: "ProjectExpenses"}
  ]);

export const LookUpsSelector = withAutoComplete(getLookups);
