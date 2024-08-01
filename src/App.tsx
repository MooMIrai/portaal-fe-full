import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";

/* import AuthService from './services/AuthService'

AuthService.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsImVtYWlsIjoiYWV0bmFAdGFhbC5pdCIsInVzZXJuYW1lIjoiYWV0bmFAdGFhbC5pdCIsInJvbGVzIjpbeyJpZCI6Mywicm9sZSI6IkNPTSIsImRlc2NyaXB0aW9uIjoiQ29tbWVyY2lhbGUiLCJkYXRlX2NyZWF0ZWQiOiIyMDI0LTA3LTIzVDEwOjMwOjAzLjA5NloiLCJkYXRlX21vZGlmaWVkIjoiMjAyNC0wNy0yM1QxMDozMDowMy4wOTZaIiwidXNlcl9jcmVhdGVkIjoiU2VlZCBBdXRvbWF0aWMiLCJ1c2VyX21vZGlmaWVkIjoiU2VlZCBBdXRvbWF0aWMifV0sImlhdCI6MTcyMjMyODg2NiwiZXhwIjoxNzIyOTMzNjY2fQ.TRse6DtVuWYwy656j4rECEx-tXd9-zVzRyGjoi7Cn3')
console.log(AuthService.getToken()); */

const App = () => {
  return <div>app</div>;
};

const rootElement = document.getElementById("app");
if (!rootElement) throw new Error("Failed to find the root element");

const root = ReactDOM.createRoot(rootElement as HTMLElement);

root.render(<App />);
