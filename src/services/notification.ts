import { io, Socket } from "socket.io-client";
import AuthService from 'common/services/AuthService';
class NotificationServiceC {

    // BE_URL_SOCKET = DISTRIBUTED: => automatic
    // BE_URL_SOCKET = LOCAL HOST: http://localhost:8023

    remotePath = `${process.env.BE_URL_SOCKET}`;
    serverPath = `${this.remotePath}`;
    client: Socket  = io(this.serverPath, {
        extraHeaders: {
            "x-tenant": sessionStorage.getItem("tenant") || ""
        },
        query: {
            token: AuthService.getToken(),
            "x-tenant": sessionStorage.getItem("tenant") || ""
        },
        transports: ['websocket', 'polling']

    });

    isConnecting=false;

    tryConnect() {
        this.isConnecting = true; // Blocca nuove connessioni in corso
        return new Promise((ok, ko) => {
            this.client.connect()
            // client-side
            this.client.on("connect", () => {

                if (this.client.id) {
                    console.log("Notification: connected");
                    this.isConnecting=false;
                    ok(this.client.id);

                }
            });

            
            this.client.on("connect_error", (error) => {
                console.log(`Notification connect error: ${error}`);
                ko(error)
                this.isConnecting=false;
            });
            

        }).then(()=>{
            //global listener
            this.onNewNotification(()=>{
                if(Notification.permission==='granted'){
                    new Notification("Nuova notifica", {
                        body: "Apri portaal per maggiori dettagli."
                      }).onclick = function () {
                        window.open("/notification/inbox", "_blank");
                    };
                }
                
            });

            this.client.on("error", (error) => {
                
                console.log(`Notification error: ${error}`);
                return error;
            });
        })

    }

    getCount(){

        return new Promise((ok,ko)=>{
            notificationService.client.on("getSentNotifyCount",ok)
            notificationService.client.emit("getSentNotifyCount");
        })
    }

    onNewNotification(callback:(...args: any[]) => void){
        this.listen('newNotification',(arg)=>{
            if(AuthService.getData().sub.toString()===arg.split('::')[1]){
                callback(arg);
            }   
        })
    }

    listen(event:string,callback:(...args: any[]) => void){
        this.client.on(event,callback);
    }

}

export const notificationService = new NotificationServiceC();

