
import axios from 'axios';
import AuthService from './AuthService';
import NotificationProviderActions from '../components/Notification/provider';

const client = axios.create({
    baseURL:'http://localhost:3001'
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

/* import axios from 'axios';

const client = axios.create({
    baseURL: 'https://portaaldev.azurewebsites.net/'
});

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjksImVtcGxveWVlX2lkIjoiOSIsImVtYWlsIjoibXZlcmRlQHRhYWwuaXQiLCJ1c2VybmFtZSI6Im12ZXJkZUB0YWFsLml0Iiwicm9sZXMiOlt7ImlkIjoxLCJyb2xlIjoiQURNIiwiZGVzY3JpcHRpb24iOiJBZG1pbiIsImRhdGVfY3JlYXRlZCI6IjIwMjQtMDgtMDVUMTg6MDc6MzkuNzQyWiIsImRhdGVfbW9kaWZpZWQiOiIyMDI0LTA4LTA2VDA4OjUwOjQxLjI2M1oiLCJ1c2VyX2NyZWF0ZWQiOiJTZWVkIEF1dG9tYXRpYyIsInVzZXJfbW9kaWZpZWQiOiJTZWVkIEF1dG9tYXRpYyJ9LHsiaWQiOjIsInJvbGUiOiJBTU1JIiwiZGVzY3JpcHRpb24iOiJBbW1pbmlzdHJhemlvbmUiLCJkYXRlX2NyZWF0ZWQiOiIyMDI0LTA4LTA1VDE4OjA3OjQwLjY3NloiLCJkYXRlX21vZGlmaWVkIjoiMjAyNC0wOC0wNlQwODo1MDo0Mi4wOThaIiwidXNlcl9jcmVhdGVkIjoiU2VlZCBBdXRvbWF0aWMiLCJ1c2VyX21vZGlmaWVkIjoiU2VlZCBBdXRvbWF0aWMifV0sImlhdCI6MTcyMzAxOTk4MSwiZXhwIjoxNzIzNjI0NzgxfQ.DSNYTk2_magD7WbLDe2b4s7DsU6VM9k5J55kDKBYjhk';

client.interceptors.request.use((config) => {
    config.headers.Authorization = 'Bearer ' + token;

    return config;
});

client.interceptors.response.use((response) => {
    if (response.status === 401) {
        window.dispatchEvent(new CustomEvent("LOGOUT"));
        window.location.href = '/';
    }
    return response;
});

export default client; */
