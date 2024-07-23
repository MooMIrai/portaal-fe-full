import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function SuccessPage() {

  const navigate= useNavigate()

useEffect(()=>{
     const queryParams = new URLSearchParams(window.location.search);
     const token = queryParams.get('token');
 
     if (token) {
       localStorage.setItem('authToken', token);
       navigate('/');
     } else {
       console.error('Token not found in the URL');
     }
},[])
  return (
    <div>SucessPage</div>
  )
}

export default SuccessPage