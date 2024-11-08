import React, { useEffect, useState } from "react";
import Drawer from "common/Drawer";
import Theme from "common/Theme";
import authService from "common/services/AuthService";
import { GlobalRouting, LoginRouting, mfeInitMenu } from "./mfeInit";

import "./index.scss";

export const App = () => {
  const [routes, setRoutes] = useState<Array<any>>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [token, setToken] = useState<string>();


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
        

        mfeInitMenu().then((menus)=>{
          setRoutes(menus)
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
  }, [token, loaded]);



 if(!loaded){
  return <div>Loading Auth data...</div>
 }

if (!token) {
  return <LoginRouting />;
}


return (
  <Theme>
    <Drawer items={routes}>
     <GlobalRouting />
    </Drawer>
  </Theme>
);

  
};
