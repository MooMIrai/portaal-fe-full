

export default function () {
  return {
    menuItems: [
      {
        id: 5,
        text: "HR",
        level: 0,
        route: "#",
        iconKey: "globeOutlineIcon",
        permissions:["READ_HR_EMPLOYEE" ,"READ_HR_COMPANY", "READ_HR_TIMESHEET", "READ_HR_HOLIDAY" ]
      },
      {
        parentId: 5,
        id: 50,
        level: 2,
        text: "Personale",
        route: "/personale",
        iconKey: "accessibilityIcon",
        permissions:["READ_HR_EMPLOYEE"]
      },
      {
        parentId: 5,
        id: 52,
        level: 2,
        text: "Società",
        route: "/societa",
        iconKey: "buildingBlocksIcon",
        permissions:["READ_HR_COMPANY"]
      },
      {
        parentId: 5,
        id: 51,
        level: 2,
        text: "Rapportino",
        route: "/rapportino",
        iconKey: "calendarIcon",
        permissions:["READ_HR_TIMESHEET"]
      },
      {
        parentId: 5,
        id: 53,
        level: 2,
        text: "Gestione Ferie Permessi",
        route: "/gestioneFeriePermessi",
        iconKey: "calendarIcon",
        permissions:["READ_HR_HOLIDAY"]
      },//attesaprogetto
      {
        parentId: 5,
        id: 55,
        level: 2,
        text: "Attesa progetto",
        route: "/attesaprogetto",
        iconKey: "clockIcon",
        permissions:["READ_RESOURCE_ALIGNMENT"]
      },
      {
        parentId: 5,
        id: 56,
        level: 2,
        text: "Gestione Rapportino",
        route: "/gestionerapportino",
        iconKey: "calendarIcon",
        permissions:["READ_HR_TIMESHEET_DEAUTH"]
      }
    ],
  };
}
