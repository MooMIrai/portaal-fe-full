import axios from "axios";
import { setupCache } from 'axios-cache-interceptor';
import AuthService from "./AuthService";
import NotificationProviderActions from "../components/Notification/provider";



// Configura axios con la cache


const client = setupCache(axios.create({
  baseURL: process.env.BE_PATH
}),{
  ttl:1000 * 1,
  methods:["get","post"],
  generateKey:(cc)=>{
    return cc.url?.split('?')[0]+'_'+cc.method;
  },
  cachePredicate:{
    responseMatch:(res)=>{
      return !!(res.config.method==='get' || (res.config.method==='post' && res.config.url && res.config.url.indexOf('pageNum')>=0))
    }
  }
});




client.interceptors.request.use((config) => {

  try {
    if (config.url && config.url.indexOf("/ai/upload_cv_ts") <= 0) {
      NotificationProviderActions.openLoader();
    }
    config.headers.Authorization = "Bearer " + AuthService.getToken();
    
    config.headers["x-tenant"] = AuthService.getTenant(0);
  } catch (err) {
    console.error("Error in request interceptor:", err);
  }
  return config;
});

const askConfirmation = (message: string) => {
  return new Promise((ok) => {
    NotificationProviderActions.openConfirm(
      message,
      () => ok(true),
      "Conferma la tua azione",
      () => ok(false)
    );
  });
};

client.interceptors.response.use(
  (response) => {
    console.log(response.id)
    NotificationProviderActions.closeLoader();
    return response;
  },
  async (error) => {
    NotificationProviderActions.closeLoader();
    if (error.response && error.response.status === 452) {

      if (error.response.data && error.response.data.message) {
        const readBody = JSON.parse(error.response.data.message);
        const val = await askConfirmation(readBody.message);
        const originalRequest = error.config;
        if (readBody.location === "query") {
          originalRequest.params = {
            ...originalRequest.params,
            [readBody.field]: val,
          };
        } else if (readBody.location === "body") {
          originalRequest.data = JSON.stringify({
            ...JSON.parse(originalRequest.data),
            [readBody.field]: val,
          });
        }
        return await client(originalRequest);
      }
    }

    if (error.response && error.response.status === 401 && error.config.url!="/auth/basic") {
      window.dispatchEvent(new CustomEvent("LOGOUT"));
      window.location.href = "/";
    } else if (error.response && error.response.status === 409) {
      
      const errorResponse = error.response?.data;
      if(errorResponse){
      if(errorResponse.message?.modelName){
        const modelName = errorResponse?.message?.modelName;
        const targetFields = errorResponse?.message?.target?.length
          ? errorResponse?.message?.target.join(", ")
          : "Nessun campo specificato";
        console.log("error.response?.data;", error.response?.data);
        const errorMessage = `Errore durante l'operazione sul modello "${modelName}". Problemi con i campi: ${targetFields}.`;

        NotificationProviderActions.openModal(
          { icon: true, style: "error" },
          errorMessage
        );

        const customError = new Error(errorMessage);
        (customError as any).details = error.response.data;
        return Promise.reject(customError);
      }else if(errorResponse.message){
        NotificationProviderActions.openModal(
          { icon: true, style: "error" },
          errorResponse.message
        );
        return Promise.reject(errorResponse.message);
      }
    }
      
    } else {
      NotificationProviderActions.openModal(
        { icon: true, style: "error" },
        "SERVER ERROR"
      );
      return Promise.reject(new Error("SERVER ERROR"));
    }
  }
);

export default client;
