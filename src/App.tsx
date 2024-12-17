import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RequestPage from './pages/Request/component';
import CandidatePage from './pages/Candidates/component';

export default function(){
    return <>
    
    <Routes>
    <Route path={"/richieste"} element={<RequestPage />}></Route>
    <Route path={"/candidati"} element={<CandidatePage />}></Route>
    
  </Routes>
  </>
}