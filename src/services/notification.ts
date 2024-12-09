import { io, Socket } from "socket.io-client";
import AuthService from 'common/services/AuthService';
import { notificationDebouncing } from "./notification-debouncing";

class NotificationServiceC {

    remotePath = process.env.REMOTE_PATH?.replace("3003", process.env.BE_SOCKET_PORT?? "8023");

    serverPath = `${this.remotePath}`;
    client: Socket | undefined;


    tryConnect() {


        console.log("Notification: enter");

        return new Promise((ok, ko) => {

            console.log("Notification: promise");

            this.client = io(this.serverPath, {
                extraHeaders: {
                    "x-tenant": sessionStorage.getItem("tenant") || ""
                },
                query: {
                    token: AuthService.getToken()
                }

            });

            console.log("Server Path:", this.serverPath);

            this.client.connect()
            // client-side
            this.client.on("connect", () => {

                if (this.client?.id) {
                    console.log("Notification: connected");
                    ok(this.client?.id);
                }
            });

            this.client.on("error", (error) => {
                console.log(`Notification error: ${error}`);
                ko(error)
            });

            
            this.client.on("connect_error", (error) => {
                console.log(`Notification connect error: ${error}`);
              });

            this.client.on('newNotification', function(data) {
                console.log('Dati ricevuti dal client:', data);

                const notificationSpan = document.getElementById("span_notification");
                if (notificationSpan) {
                    notificationSpan.innerText = data.message || JSON.stringify(data);
                }

                // Restituisce la funzione debounced
                const debouncedLog = notificationDebouncing.setDebouncing(2000);
                
                // Chiama la funzione debounced con il messaggio
                debouncedLog(data.message || JSON.stringify(data));
                
            });

        })

    }

}

export const notificationService = new NotificationServiceC();
(window as any).notificationService = notificationService;

