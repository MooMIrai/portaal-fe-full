export default function () {
  return {
    menuItems: [
      {
        id: 6,
        text: "Vendite",
        level: 0,
        route: "/Vendite",
        iconKey: "globeOutlineIcon",
      },
      {
        parentId: 6,
        id: 52,
        level: 2,
        text: "Clienti",
        route: "/clienti",
        iconKey: "",
      },
      {
        parentId: 6,
        id: 53,
        level: 2,
        text: "Offerte",
        route: "/offerte",
        iconKey: "",
      },
      {
        parentId: 6,
        id: 54,
        level: 2,
        text: "Progetti",
        route: "/progetti",
        iconKey: "",
      },
    ],
  };
}
