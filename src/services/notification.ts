import { io, Socket } from "socket.io-client";
import AuthService from 'common/services/AuthService';

class NotificationServiceC {

    serverPath = `${process.env.BE_PATH}:${process.env.BE_PORT}`;
    client: Socket | undefined;


    tryConnect() {
        return new Promise((ok, ko) => {
            this.client = io(this.serverPath, {
                extraHeaders: {
                    "x-tenant": sessionStorage.getItem("tenant") || ""
                },
                query: {
                    token: AuthService.getToken()
                }

            });
            this.client.connect()
            // client-side
            this.client.on("connect", () => {
                if (this.client?.id) {
                    ok(this.client?.id);
                }
            });
            this.client.on("error", (error) => {
                ko(error)
            });
        })



    }

}

export const notificationService = new NotificationServiceC();

