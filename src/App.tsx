import React, { Suspense, useEffect, useState } from "react";
import {
  BrowserRouter,
  Link,
  Outlet,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

const Drawer = React.lazy(() => import("common/Drawer"));
const Theme = React.lazy(() => import("common/Theme"));
const LookUps = React.lazy(() => import("lookups/Index"));

export const App = () => {
  const navigate = useNavigate();
  const [drawerExpanded, setDrawerExpanded] = useState(true);
  const [width, setWidth] = useState(window.innerWidth);
  const initializeItems = () => {
    const savedId = localStorage.getItem("selectedDrawerItemId");
    const expandedStates = JSON.parse(
      localStorage.getItem("drawerExpandedStates") || "{}"
    );
    const currentRoute = window.location.pathname;
    const initialItems: any = [
      {
        id: 1,
        text: "Dashboard",
        ////svgIcon: graphIcon,
        route: "/",
        selected: currentRoute === "/" || savedId === "1",
        element: <div>Dashboard</div>,
      },
      {
        id: 2,
        text: "Profilo Personale",
        dataExpanded: expandedStates[2] || false,
        ////svgIcon: calendarIcon,
        selected: false,
      },
      {
        id: 17,
        text: "Profilo Utente",
        parentId: 2,
        level: 2,
        ////svgIcon: userIcon,
        route: "/profilo-personale/profilo-utente",
        selected:
          currentRoute === "/profilo-personale/profilo-utente" ||
          savedId === "17",
        element: <div>Profilo Personale</div>,
      },
      {
        id: 16,
        text: "Rapportino",
        //svgIcon: calendarIcon,
        parentId: 2,
        level: 2,
        route: "/profilo-personale/rapportino",
        selected:
          currentRoute === "/profilo-personale/rapportino" || savedId === "16",
        element: <div>Rapportino</div>,
      },
      {
        id: 18,
        text: "Permesso",
        //svgIcon: calendarDateIcon,
        parentId: 2,
        level: 2,
        route: "/profilo-personale/permesso",
        selected:
          currentRoute === "/profilo-personale/permesso" || savedId === "18",
        element: <div>Profilo personale</div>,
      },
      {
        id: 3,
        text: "Vendita",
        dataExpanded: expandedStates[3] || false,
        //svgIcon: cartIcon,
        selected: false,
      },
      {
        id: 4,
        parentId: 3,
        text: "Cliente",
        icon: "k-icon k-font-icon k-i-tell-a-friend",
        route: "/vendita/cliente",
        selected: currentRoute === "/vendita/cliente" || savedId === "4",
        element: <div>vendita cliente</div>,
      },
      {
        id: 5,
        parentId: 3,
        text: "Offerte",
        //svgIcon: bookIcon,
        route: "/vendita/offerte",
        selected: currentRoute === "/vendita/offerte" || savedId === "5",
        element: <div>vendita offerte</div>,
      },
      {
        id: 6,
        parentId: 3,
        text: "Commesse",
        icon: "k-icon k-font-icon k-i-inbox",
        route: "/vendita/commesse",
        selected: currentRoute === "/vendita/commesse" || savedId === "6",
        element: <div>commesse</div>,
      },
      {
        id: 19,
        text: "Lookups",
        //svgIcon: gridLayoutIcon,
        route: "/lookups",
        selected: currentRoute === "/lookups" || savedId === "19",
        element: <LookUps />,
      },
    ];
    /* Assicuro che i genitori siano espansi se i figli sono selezionati se non sono selezionati li chiudo */
    initialItems.forEach((item: any) => {
      if (item.parentId) {
        const parentItem = initialItems.find(
          (parent: any) => parent.id === item.parentId
        );
        if (parentItem && (item.selected || savedId === item.id.toString())) {
          parentItem.dataExpanded = true;
        }
      }
    });

    initialItems.forEach((parent: any) => {
      if (parent.dataExpanded) {
        const childSelected = initialItems.some(
          (item: any) => item.parentId === parent.id && item.selected
        );
        if (!childSelected) {
          parent.dataExpanded = false;
        }
      }
    });

    return initialItems;
  };

  const [items, setItems] = useState<any[]>(initializeItems);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const currentRoute = window.location.pathname;
    const currentItem = items.find((item) => item.route === currentRoute);
    if (currentItem) {
      localStorage.setItem("selectedDrawerItemId", currentItem.id.toString());
    } else {
      navigate("/");
    }
  }, [items, navigate]);

  const handleClick = () => {
    if (drawerExpanded) {
      /* salvo gli stati di espansione degli elementi quando il menu viene chiuso */
      const expandedStates = {} as Record<number, boolean>;
      items.forEach((item) => {
        if (item.dataExpanded !== undefined) {
          expandedStates[item.id] = item.dataExpanded;
        }
      });
      localStorage.setItem(
        "drawerExpandedStates",
        JSON.stringify(expandedStates)
      );

      const updatedItems = items.map((item) => ({
        ...item,
        dataExpanded:
          item.dataExpanded !== undefined ? false : item.dataExpanded,
      }));
      setItems(updatedItems);
    } else {
      /* ripristino gli stati di espansione degli elementi quando il menu viene riaperto */
      const savedId = localStorage.getItem("selectedDrawerItemId");
      const updatedItems = items.map((item) => {
        if (item.parentId) {
          const parentItem = items.find(
            (parent) => parent.id === item.parentId
          );
          if (parentItem && (item.selected || savedId === item.id.toString())) {
            parentItem.dataExpanded = true;
          }
        }
        return item;
      });
      setItems(updatedItems);
    }
    setDrawerExpanded(!drawerExpanded);
  };

  const onSelect = (ev: any) => {
    const currentItem = ev.itemTarget.props as any;

    if (!currentItem) {
      console.error("Item not found");
      return;
    }
    /* se l'elemento è un padre rimane l'elemento selezionato selected */
    if (currentItem.dataExpanded !== undefined) {
      const nextExpanded = !currentItem.dataExpanded;
      const newData = items.map((item) => {
        const { dataExpanded: currentExpanded, id, parentId, ...others } = item;
        return {
          ...others,
          id,
          parentId,
          selected: item.selected,
          dataExpanded: currentItem.id === id ? nextExpanded : currentExpanded,
        };
      });
      setItems(newData);
    } else {
      const newData = items.map((item) => {
        const { dataExpanded: currentExpanded, id, parentId, ...others } = item;
        return {
          ...others,
          id,
          parentId,
          selected: currentItem.id === id,
          dataExpanded: currentExpanded,
        };
      });
      if (currentItem.route) {
        navigate(currentItem.route);
      }
      localStorage.setItem("selectedDrawerItemId", currentItem.id.toString());
      setItems(newData);
    }
  };

  return (
    <Suspense fallback={null}>
      <Theme>
        <Drawer
          items={items}
          expanded={drawerExpanded}
          handleClick={handleClick}
          onSelect={onSelect}
          mode={width > 400 ? "push" : "overlay"}
          mini={width > 400 ? true : false}
          miniWidth={40}
          titleLogo={
            <img
              style={{ marginTop: "1rem", marginLeft: "2rem" }}
              width={150}
              height={30}
              src="/image/logoTaal.png"
              alt="Logo Taal"
            />
          }
          position="start"
          animation={true}
          fillMode={"flat"}
          onOverlayClick={handleClick}
          className={"drawerStyle"}
        ></Drawer>

        {/* <Routes >
          <Route path={"/"} element={<div>dashboard</div>} />
          <Route path={"lookups/*"} element={<RemoteApp />} />
        </Routes> */}
      </Theme>
    </Suspense>
  );
};
