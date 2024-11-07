import { Suspense } from "react";
import { menuToImport, routesToImport } from "./mfeConfig";
import React from "react";

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
{routesToImport.map((RoutingMfe,index)=><RoutingMfe key={'Routing_'+index} />)}
</Suspense>

export const GlobalRouting = ()=><Suspense>
    {routesToImport.map((RoutingMfe,index)=><RoutingMfe key={'Routing_'+index} />)}
</Suspense>