import React, { useEffect, useState } from "react";
import Drawer from "common/Drawer";
import Theme from "common/Theme";
import authService from "common/services/AuthService";

import AuthRoutes from 'auth/Routes';
import LookupsRoutes from 'lookups/Routes';
import initLookupFn from 'lookups/Index';
import HRRoutes from 'hr/Routes';
import initHRFn from 'hr/Index';
import { Routes, useNavigate } from "react-router-dom";


export const App = () => {

  const [routes, setRoutes] = useState<Array<any>>([]);
  const [token,setToken] = useState<string>();
  const navigate = useNavigate();

  useEffect(()=>{
    try{
      setToken(authService.getToken())
    }catch{
      
    }
   
  },[])


  useEffect(() => {
    let r: Array<any> = [];
    if(token){
      
      const lookupConfig = initLookupFn();
      if (lookupConfig && lookupConfig.menuItems) {
        r = [...r, ...lookupConfig.menuItems];
      }
      const hrConfig = initHRFn();
      if (hrConfig && hrConfig.menuItems) {
        r = [...r, ...hrConfig.menuItems];
      }
      window.addEventListener("LOGOUT",()=>{setToken(undefined)},{once:true});
    }else{
      navigate('/login',{replace:true});
    }
    
    setRoutes(r);

  }, [token])


 /*  if(!token){
    return <AuthRoutes></AuthRoutes>
  }
 */
  return (
    <>
      
        <Theme>
          <Drawer items={routes} >
            <LookupsRoutes />
            <HRRoutes />
          </Drawer>
        </Theme>
      
    </>


  );
};
