export default function () {
  return {
    menuItems: [
      {
        id: 10,
        text: "Profile",
        level: 0,
        route: "/profile",
        iconKey:"userOutlineIcon"
      },
      {
        id: 11,
        text: "Gestione Ruoli",
        level: 0,
        route: "/role",
        iconKey:"lockIcon"
      },
    ],
  };
}
