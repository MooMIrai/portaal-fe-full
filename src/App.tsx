import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NonMain from "./pages/nonMain";
import Main from "./pages/main";
import LoginComponent from "./pages/LoginGoogle/component";
import SuccessPage from "./pages/SuccessPage/component";

/*
import DrawerService, {DrawerEventService as DrawerEventServiceType,DRAWER_EVENT_TYPE as DRAWER_EVENT_TYPE_enum} from "../@mf-types/common/DrawerService";
import {DrawerEventService as DrawerEventService_value, DRAWER_EVENT_TYPE as DRAWER_EVENT_TYPE_value} from "common/DrawerService"

const DrawerEventService:typeof DrawerEventServiceType = DrawerEventService_value;
const DRAWER_EVENT_TYPE:typeof DRAWER_EVENT_TYPE_enum = DRAWER_EVENT_TYPE_value;


DrawerEventService.fire(DRAWER_EVENT_TYPE.ADD_ITEMS,{detail:{list:[
  {
    element:<Main />,
    id:11,
    text:'Lookups',
    route:'/lookups'
  },
  {
    element:<NonMain />,
    id:12,
    text:'Non Main',
    parentId:11,
    //@ts-ignore
    level: 2,
    route:'/lookups/nonmain'
  }
],isOpen:"false"}});
console.log('lookups init')
*/
const App = () => {
  return (<Routes >     
        <Route  path="/login/" element={<LoginComponent></LoginComponent>}></Route>
        <Route path="/auth-success" element={<SuccessPage></SuccessPage>}></Route>
        </Routes>
  );
};




export default App;
