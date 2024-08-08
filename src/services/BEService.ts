
import axios from 'axios';
import AuthService from './AuthService';

const client = axios.create({
    //baseURL:'http://localhost:3001'
    baseURL:'https://portaaldev.azurewebsites.net'
});

client.interceptors.request.use((config)=>{
    config.headers.Authorization='Bearer '+ AuthService.getToken();

    return config;
});
client.interceptors.response.use((response)=>{
    if(response.status===401){
        window.dispatchEvent(new CustomEvent("LOGOUT"));
        window.location.href='/';
    }
    return response;
})

export default client;