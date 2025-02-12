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

  getMySent(pageSize:number,pageNum:number,idUser?:number){
    return client.get('/api/v1/notificationDetail/getMyNotifyManager',{
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

  updateResponse(id:number,response:string){
    return client.patch(`/api/v1/notificationDetail/updateResponse/${id}`, {"response":response} ).then(res=>res.data)
  }

  updateFlagStar(id:number,isFlagged:boolean){
    return client.patch(`/api/v1/notificationDetail/updateFlag/${id}`,{isFlagged:isFlagged}).then(res=>res.data)
  }

  searchAccount (text: string) {
    return client.get(`api/v1/accounts/findByName?search=${text}`).then(res => res.data);
  }

  getTemplate(){
    return client.get(`api/v1/crud/EmailDefault`).then(res => res.data);
  }

  getResponseTypeList(){
    return client.get(`api/v1/crud/NotifyResponseType`).then(res => res.data);
  }

  moveToTrash(id:number){
    return client.patch(`/api/v1/notificationDetail/updateDelete/${id}`,{isDeleted:true}).then(res=>res.data);
  }

}

export const notificationServiceHttp = new NotificationServiceC();