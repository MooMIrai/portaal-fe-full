import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DevicePage from './pages/Device/component';

export default function(){
    return <Routes>
    <Route
      path={"/device"}
      element={<DevicePage /> }
    ></Route>
    
    
  </Routes>
}