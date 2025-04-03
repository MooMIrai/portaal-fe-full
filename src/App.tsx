import React, { Fragment, Suspense, useEffect, useState } from "react";
import Drawer from "common/Drawer";
import Theme from "common/Theme";
import authService from "common/services/AuthService";
import { GlobalRouting, LoginRouting, mfeInitMenu } from "./mfeInit";
import { Route, Routes } from "react-router-dom";

//import "./index.css";

export const App = () => {
  const [routes, setRoutes] = useState<Array<any>>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [token, setToken] = useState<string>();

  const [addedRoutes,setAddedRoutes] = useState<Array<any>>([]);

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
    const handleAddMenuItems = (ev: any) => {
      if (ev?.detail) {
        setAddedRoutes((prevRoutes) => [...prevRoutes, ...ev.detail]);
      }
    };

    window.addEventListener("AddMenuItems", handleAddMenuItems);

    return () => {
      window.removeEventListener("AddMenuItems", handleAddMenuItems);
    };
  }, []);

  useEffect(() => {
    
    if (loaded) {
      if (token) {
        if(location.pathname == '/login'){
          location.href = "/";
        }else{
        

        mfeInitMenu().then((menus) => {
          
          setRoutes([...menus, ...addedRoutes.map(ar=>ar.menu)]);
        });


        window.addEventListener(
          "LOGOUT",
          () => {
            setToken(undefined);
          },
          { once: true }
        );
      }
      } else if(location.pathname != '/login' && location.pathname!='/auth-success'){
        
        //navigate("/login", { replace: true });
        location.href = "/login";
      }

      
    }
  }, [token, loaded,addedRoutes]);



 if(!loaded){
  return <div>Loading Auth data...</div>
 }

if (!token) {
  return <Theme><LoginRouting /></Theme>;
}



return (
  <Theme>
    {
      window.opener?<>
        <GlobalRouting />
        {
          addedRoutes && addedRoutes.length ?<Routes>{addedRoutes.map((ar,index)=><Fragment key={'addedR_'+index}>{ar.route}</Fragment>)}</Routes> :null
        }
      </>:
      <Drawer items={routes}>
        <GlobalRouting />
        {
          addedRoutes && addedRoutes.length ?<Routes>{addedRoutes.map((ar,index)=><Fragment key={'addedR_'+index}>{ar.route}</Fragment>)}</Routes> :null
        }
      </Drawer>
    }
    
  </Theme>
);

  
};
