import BaseHttpService from "common/services/BaseHTTPService";
import client from "common/services/BEService";

class NotificationServiceC extends BaseHttpService {


  getTableName() {
    return "notificationDetail";
  }

  getMy(pageSize:number,pageNum:number,idUser?:number){

    return client.get('/api/v1/notificationDetail/getMyNotify',{
        params: { 
          id_account: idUser,
          pageSize:pageSize,
          pageNum:pageNum
        },
    }).then(r=>r.data);

  }

  getMyUnreadCount(){
    return client.patch(`/api/v1/notificationDetail/getSentNotifyCount`).then(res=>res.data)
  }

  updateStatus(id:number,status:"RESPONDED" | "SENT" | "VIEWED" | "RESPONDED" | "COMPLETED"){
    return client.patch(`/api/v1/notificationDetail/updateStatus/${id}`, {"notificationStatus_value":status} ).then(res=>res.data)
  }

  updateFlagStar(id:number,isFlagged:boolean){
    return client.patch(`/api/v1/notificationDetail/updateFlag/${id}`,{isFlagged:isFlagged}).then(res=>res.data)
  }

}

export const notificationServiceHttp = new NotificationServiceC();