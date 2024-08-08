
import axios from 'axios';
import AuthService from './AuthService';
import NotificationProviderActions from '../components/Notification/provider';

const client = axios.create({
    //baseURL:'http://localhost:3001'
    baseURL:'https://portaaldev.azurewebsites.net'
});

client.interceptors.request.use((config)=>{
    config.headers.Authorization='Bearer '+ AuthService.getToken();

    return config;
});
client.interceptors.response.use((response)=>{

    return response;
},(error)=>{
    if(error.response.status===401){
        window.dispatchEvent(new CustomEvent("LOGOUT"));
        window.location.href='/';
    } else if (error.response.status === 409){
        
        NotificationProviderActions.openModal({icon:true,style:'error'},error.response.data.message);
        throw new Error(error.response.data.message);
    }
    return error;
})

export default client;