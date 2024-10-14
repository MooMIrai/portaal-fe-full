import buildingBlocksIcon from "common/SvgIcon"

export default function () {
  return {
    menuItems: [
      {
        id: 6,
        text: "Vendite",
        level: 0,
        route: "/Vendite",
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
        text: "Progetti",
        route: "/progetti",
        iconKey: "inboxIcon",
      },
    ],
  };
}
