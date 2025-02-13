import { io, Socket } from "socket.io-client";
import AuthService from 'common/services/AuthService';
import { notificationServiceHttp } from "./notificationService";
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
            this.onNewNotification((args)=>{
                if(Notification.permission==='granted'){//::151,Allora questo è il titolo"
                    const data = args.split('::')[1];
                    const id=data.split('%%')[0];
                    const title=data.split('%%')[1];
                    new Notification("Nuova notifica", {
                        body: title || "Apri portaal per maggiori dettagli."
                      }).onclick = function () {
                       
                        window.open("/notifications/inbox/"+id, "Dettaglio richiesta", "width=700,height=500" );
                    };
                }
                
            });

            this.onCountNotification((args)=>{
                notificationServiceHttp.getMyUnreadCount()
            });

            this.client.on("error", (error) => {
                
                console.log(`Notification error: ${error}`);
                return error;
            });
        }).catch((error)=>{
            console.error(error)
        })

    }

    getCount(){

        return new Promise((ok,ko)=>{
            notificationService.client.on("getSentNotifyCount",ok)
            notificationService.client.emit("getSentNotifyCount");
        })
    }

    onNewNotification(callback:(...args: any[]) => void){
        this.listen('newNotification',callback);
        return ()=>this.offNewNotification(callback);
    }

    offNewNotification(callback:(...args: any[]) => void){
        this.client.off('newNotification',callback);
    }

    onCountNotification(callback:(...args: any[]) => void){
        this.listen('updateCountNotification',callback);
        return ()=>this.offNewNotification(callback);
    }

    offCountNotification(callback:(...args: any[]) => void){
        this.client.off('updateCountNotification',callback);
    }

    listen(event:string,callback:(...args: any[]) => void){
        this.client.on(event,callback);
    }

}

export const notificationService = new NotificationServiceC();

