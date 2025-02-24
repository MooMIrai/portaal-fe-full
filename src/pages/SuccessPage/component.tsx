import React, { useEffect } from 'react'
import authService from 'common/services/AuthService';

function SuccessPage() {


useEffect(()=>{
     const queryParams = new URLSearchParams(window.location.search);
     const token = queryParams.get('token');
 
     if (token) {
      authService.login(token);
      authService.getPermissions().then(()=>{
        window.location.href = "/";
      })
      
     } else {
       console.error('Token not found in the URL');
     }
},[])
  return (
    <div>SucessPage</div>
  )
}

export default SuccessPage