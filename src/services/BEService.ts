import axios from "axios";
import AuthService from "./AuthService";
import NotificationProviderActions from "../components/Notification/provider";

const client = axios.create({
  //baseURL:'http://localhost:3001'
  baseURL: process.env.BE_PATH,
  //baseURL: "https://portaaldev2-h9ach7bscvcpg8a5.eastus-01.azurewebsites.net/",
});

client.interceptors.request.use((config) => {
  try {
    if (config.url && config.url.indexOf("/ai/upload_cv_ts") <= 0)
      NotificationProviderActions.openLoader();
    config.headers.Authorization = "Bearer " + AuthService.getToken();
    config.headers["x-tenant"] = sessionStorage.getItem("tenant");
  } catch {}

  return config;
});

const askConfirmation = (message: string) => {
  return new Promise((ok, ko) => {
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
            ...originalRequest.params, // Mantiene i parametri esistenti
            [readBody.field]: val, // Aggiungi un parametro "retry" alla query string
          };
        } else if (readBody.location === "body") {
          originalRequest.data = {
            ...originalRequest.data, // Mantiene i parametri esistenti
            [readBody.field]: val, // Aggiungi un parametro "retry" alla query string
          };
        }
        return await client(originalRequest);
      }
    }

    if (error.response && error.response.status === 401) {
      window.dispatchEvent(new CustomEvent("LOGOUT"));
      window.location.href = "/";
    } else if (error.response && error.response.status === 409) {
      const errorResponse = error.response?.data;
      const modelName = errorResponse?.message?.modelName;
      const targetFields =
        errorResponse?.message?.target?.join(", ") ||
        "Nessun campo specificato";

      const errorMessage = `Errore durante l'operazione sul modello "${modelName}". Problemi con i campi: ${targetFields}.`;

      NotificationProviderActions.openModal(
        { icon: true, style: "error" },
        errorMessage
      );

      const customError = new Error(errorMessage);
      (customError as any).details = error.response.data;
      return Promise.reject(customError);
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
