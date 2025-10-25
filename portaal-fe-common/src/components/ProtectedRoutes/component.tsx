import React from "react";
import { Navigate, Route, RouteProps, Routes } from "react-router-dom";
import AuthService from "../../services/AuthService";

type PRoutesProps  = RouteProps & {
    permissions?:string[]
};


const ProtectedRouteS: React.FC<{data:PRoutesProps[]}> = (props) => {

    return <Routes>
            {
               props.data.map(route=>{
                const granted = !route.permissions|| route.permissions.length === 0 || route.permissions.some(AuthService.hasPermission);
                    let element = route.element;    
                    if(!granted){
                        element= <Navigate to="/unauthorized" replace />;
                    }
                    return <Route key={route.path} path={route.path} element={element} />
                })
            }
        </Routes>
}

export default ProtectedRouteS;