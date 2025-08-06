// Module Federation initialization
export default function () {
  return {
    menuItems: [
      {
        id: 150,
        text: "Dashboard Editor",
        level: 0,
        // Nessuna route - questo è solo un menu parent per i sottomenu
        iconKey: "chartLineIcon",
        permissions: []
      },
      {
        id: 151,
        text: "Widget Templates",
        level: 1,
        parentId: 150,
        route: "/dashboard-editor/templates",
        iconKey: "chartPieIcon",
        permissions: []
      },
      {
        id: 152,
        text: "Preview Mode",
        level: 1,
        parentId: 150,
        route: "/dashboard-editor/preview",
        iconKey: "eyeIcon",
        permissions: []
      }
    ]
  };
}