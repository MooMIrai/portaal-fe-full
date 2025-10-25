import { Suspense } from "react";
import { menuToImport, routesToImport, routesLoginToImport } from "./mfeConfig";
import React from "react";
import { Route, Routes } from "react-router-dom";

export const mfeInitMenu=()=>{
    return Promise.allSettled(menuToImport).then(menuFunctions=>{
        let menuItems:any[]=[];
        menuFunctions.forEach((mf)=>{
            
            if(mf && mf.status==='fulfilled' && mf.value.default){
                const menuMfe = mf.value.default();
                if(menuMfe){
                    menuItems=menuItems.concat(menuMfe.menuItems);
                }
            }
        });
        return menuItems;
    })
}

export const LoginRouting = ()=><Suspense>
{routesLoginToImport.map((RoutingMfe,index)=><RoutingMfe key={'Routing_'+index} />)}
</Suspense>

export const GlobalRouting = ()=><Suspense>
    {routesToImport.map((RoutingMfe,index)=><RoutingMfe key={'Routing_'+index} />)}
    <Routes>
        <Route path="/unauthorized" element={<div>Accesso negato</div>} />
    </Routes>
    
</Suspense>