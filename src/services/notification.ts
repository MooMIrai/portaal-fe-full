import { io, Socket } from "socket.io-client";
import AuthService from 'common/services/AuthService';
import { notificationDebouncing } from "./notification-debouncing";

class NotificationServiceC {

    // BE_URL_SOCKET = DISTRIBUTED: => automatic
    // BE_URL_SOCKET = LOCAL HOST: http://localhost:8023

    remotePath = `${process.env.BE_URL_SOCKET}`;
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
                    token: AuthService.getToken(),
                    "x-tenant": sessionStorage.getItem("tenant") || ""
                },
                transports: ['websocket', 'polling']

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
                ko(error)
              });

        })

    }

    getCount(){
        debugger;
        return new Promise((ok,ko)=>{
            debugger;
            notificationService.client?.on("getSentNotifyCount",ok)
            notificationService.client?.emit("getSentNotifyCount");
        })
    }

    listen(event:string,callback:(...args: any[]) => void){
        this.client?.on(event,callback);
    }

}

export const notificationService = new NotificationServiceC();

