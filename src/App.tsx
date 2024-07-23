import React, { useEffect, useState } from "react";
import Drawer from "common/Drawer";
import Theme from "common/Theme";
import AuthRoutes from 'auth/Routes';
import LookupsRoutes from 'lookups/Routes';
import initLookupFn from 'lookups/Index';
import { Route, Routes, useNavigate } from "react-router-dom";
interface DecodedToken {
  exp: number;
  [key: string]: any;
}

export const App = () => {

  const navigate = useNavigate();
  const [routes, setRoutes] = useState<Array<any>>([]);
  const [token, setToken] = useState<string | null>(null);

  const decodeToken = (token: string | null): DecodedToken | null => {
    if (!token) return null;
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const decodedToken = JSON.parse(jsonPayload) as DecodedToken;
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp < currentTime) {
        // Token has expired
        return null;
      }
      return decodedToken;
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  };

  const checkAndSetToken = () => {
    const authToken = window.localStorage.getItem("authToken");
    const validToken = decodeToken(authToken);
    if (!validToken) {
      window.localStorage.removeItem("authToken");
      setToken(null);
    } else {
      setToken(authToken);
    }
  };


  useEffect(() => {
    checkAndSetToken();

    const handleStorageChange = () => {
      checkAndSetToken();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    let r: Array<any> = [];
    const lookupConfig = initLookupFn();
    if (lookupConfig && lookupConfig.menuItems) {
      r = [...r, ...lookupConfig.menuItems];
    }
    console.log(r)
    setRoutes(r);

  }, [])
  useEffect(() => {
    if (token === null) {
      navigate('/login/');
    } else{
      navigate('/')
    }
  }, [ token, navigate]);

  return (
    <>
      {token !== null ? (
        <Theme>
          <Drawer items={routes} >
            <LookupsRoutes />
          </Drawer>
        </Theme>
      ) : (
        <AuthRoutes></AuthRoutes>
      )}
    </>


  );
};
