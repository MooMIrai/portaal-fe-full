import React, { useEffect, useState } from "react";
import Drawer from "common/Drawer";
import Theme from "common/Theme";
import authService from "common/services/AuthService";

import AuthRoutes from "auth/Routes";
import AuthVisibleRoutes from "auth/VisibleRoutes";
import LookupsRoutes from "lookups/Routes";
import initLookupFn from "lookups/Index";
import SalesRoutes from "sales/Routes";
import initSalesFn from "sales/Index";
import initProfileFn from "auth/Index";
import initHrFn from "hr/Index";
import HrRoutes from "hr/Routes";
import initStockFn from "stock/Index";
import StockRoutes from "stock/Routes";
import "./index.scss";
import { Routes, useNavigate } from "react-router-dom";

export const App = () => {
  const [routes, setRoutes] = useState<Array<any>>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [token, setToken] = useState<string>();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      if (!loaded) {
        setToken(authService.getToken());
      }

    }catch(e){
      
    }finally{
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    let r: Array<any> = [];
    if (loaded) {
      if (token) {
        if(location.pathname == '/login'){
          location.href = "/";
        }else{
        const lookupConfig = initLookupFn();
        if (lookupConfig && lookupConfig.menuItems) {
          r = [...r, ...lookupConfig.menuItems];
        }
        const salesConfig = initSalesFn();
        if (salesConfig && salesConfig.menuItems) {
          r = [...r, ...salesConfig.menuItems];
        }

        const hrConfig = initHrFn();
        if (hrConfig && hrConfig.menuItems) {
          r = [...r, ...hrConfig.menuItems];
        }

        const profileConfig = initProfileFn();
        if (profileConfig && profileConfig.menuItems) {
          r = [...r, ...profileConfig.menuItems];
        }

        const stockConfig = initStockFn();
        if (stockConfig && stockConfig.menuItems) {
          r = [...r, ...stockConfig.menuItems];
        }

        /* import("stock/Index").then(module => {
          debugger;
        }) */

        window.addEventListener(
          "LOGOUT",
          () => {
            setToken(undefined);
          },
          { once: true }
        );
      }
      } else if(location.pathname != '/login'){
        
        //navigate("/login", { replace: true });
        location.href = "/login";
      }

      setRoutes(r);
    }
  }, [token, loaded]);



 if(!loaded){
  return <div>Loading Auth data...</div>
 }

if (!token) {
  return <AuthRoutes />;
}


return (
  <Theme>
    <Drawer items={routes}>
      <LookupsRoutes />
      <SalesRoutes />
      <HrRoutes />
      <AuthVisibleRoutes />
      <StockRoutes />
    </Drawer>
  </Theme>
);

  
};
