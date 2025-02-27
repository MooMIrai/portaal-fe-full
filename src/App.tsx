import React from 'react';
import RequestPage from './pages/Request/component';
import CandidatePage from './pages/Candidates/component';
import Routes from 'common/Routes';

export default function(){
    return <Routes data={[
      {
        path:"/richieste",
        element:<RequestPage />,
        permissions:["READ_RECRUITING_REQUEST"]
      },
      {
        path:"/richieste/:id/:candidateId",
        element:<RequestPage />,
        permissions:["READ_HR_REREAD_RECRUITING_REQUEST"]
      },
      {
        path:"/candidati",
        element:<CandidatePage />,
        permissions:["READ_RECRUITING_CANDIDATE"]
      }
    ]}>

    {/* <Routes>
      <Route element={<ProtectedRoute permissions={["test"]} />}>
        <Route path={"/richieste"} element={<RequestPage />}></Route>
      </Route>
      <Route path={"/richieste/:id/:candidateId"} element={<RequestPage />}></Route>
      <Route path={"/candidati"} element={<CandidatePage />}></Route>
      
    </Routes> */}
  </Routes>
}