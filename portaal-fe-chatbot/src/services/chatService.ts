import client from "common/services/BEService";
import AuthService from "common/services/AuthService";

class ChatService {
    sendMessage(text:string){
        return client.post(process.env.CHAT_API_URL+'/chat',{
            session_id:localStorage.getItem("chat_session") ?? "1",
            message:text,
            permissions:AuthService.readPermissions()
        }).then(res=>{
            if(res.data){
                localStorage.setItem("chat_session",res.data.session_id)
            }
            return res.data;
        });
    }
}

export const chatService = new ChatService();