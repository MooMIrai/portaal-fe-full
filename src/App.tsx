import React, { useEffect, useState } from "react";


import Drawer from "common/Drawer";
import Theme from "common/Theme";

import AuthRoutes from 'auth/Routes';
import LookupsRoutes from 'lookups/Routes';

import initLookupFn from 'lookups/Index';


export const App = () => {

  const [routes,setRoutes] = useState<Array<any>>([]);

  useEffect(()=>{
    let r:Array<any>=[];
    const lookupConfig=initLookupFn();
    if(lookupConfig && lookupConfig.menuItems){
      r=[...r,...lookupConfig.menuItems];
    }
    console.log(r)
    setRoutes(r);
    
  },[])

  return (
    <Theme>
      <h1>ciao</h1>
      <Drawer items={routes} >
        <AuthRoutes />
        <LookupsRoutes />
      </Drawer>
      
    </Theme>
  );
};
