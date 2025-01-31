
export default function () {
  return {
    menuItems: [
      {
        id: 6,
        text: "Vendite",
        level: 0,
        route: "#",
        iconKey: "cartIcon",
      },
      {
        parentId: 6,
        id: 62,
        level: 2,
        text: "Clienti",
        route: "/clienti",
        iconKey: "myspaceIcon",
      },
      {
        parentId: 6,
        id: 63,
        level: 2,
        text: "Offerte",
        route: "/offerte",
        iconKey: "fileFooterIcon",
      },
      {
        parentId: 6,
        id: 64,
        level: 2,
        text: "Commessa",
        route: "/progetti",
        iconKey: "inboxIcon",
      },
      {
        parentId: 6,
        id: 65,
        level: 2,
        text: "Sal",
        route: "/sal",
        iconKey: "dollarIcon",
      },
    ],
  };
}
