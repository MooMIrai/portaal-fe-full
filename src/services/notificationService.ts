import BaseHttpService from "common/services/BaseHTTPService";
import client from "common/services/BEService";

class NotificationServiceC extends BaseHttpService {


  getTableName() {
    return "notificationDetail";
  }

  getDetail(id:number){
    return client.get('/api/v1/notificationDetail/'+id+'?include=true&canceled=true').then(res=>res.data)
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

  getMyBin(pageSize:number,pageNum:number,idUser?:number){

    return client.get('/api/v1/notificationDetail/getMyNotificationBin',{
        params: { 
          id_account: idUser,
          pageSize:pageSize,
          pageNum:pageNum
        },
    }).then(r=>r.data);

  }

  
  getMySentBin(pageSize:number,pageNum:number,idUser?:number){
    return client.get('/api/v1/notificationDetail/getMyNotificationBinManager',{
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
    return client.get(`/api/v1/notificationDetail/getSentNotifyCount`).then(res=>res.data).then(res=>{
      const managerEvent = new CustomEvent("AddBadgeMenu", { detail: {id:122,value:res.managerList ||0}});
      const inboxEvent = new CustomEvent("AddBadgeMenu", { detail: {id:121,value:res.myList ||0}});
      const notificationEvent = new CustomEvent("AddBadgeMenu", { detail: {id:12,value:(res.myList ||0) + (res.managerList ||0)}});
      window.dispatchEvent(managerEvent);
      window.dispatchEvent(inboxEvent);
      window.dispatchEvent(notificationEvent);
      return res;
    });
  }

  updateResponseStatus(id:number,confirm:boolean){
    return client.patch(`/api/v1/notificationDetail/processManagerResponse/${id}?confirm=${confirm}`, {"confirm":confirm} ).then(res=>res.data)
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

  moveSentToTrash(id:number){
    return client.patch(`/api/v1/notificationDetail/updateDeleteManager/${id}`,{isDeleted:true}).then(res=>res.data);
  }

  deleteSent(id:number){
    return client.delete(`/api/v1/notificationDetail/cancelNotificationManager/${id}`).then(res=>res.data);
  }

  deleteInbox(id:number){
    return client.delete(`/api/v1/notificationDetail/cancelNotification/${id}`).then(res=>res.data);
  }

  deleteAllInbox(){
    return client.delete(`/api/v1/notificationDetail/cleanBin`).then(res=>res.data)
  }

  deleteAllSent(){
    return client.delete(`/api/v1/notificationDetail/cleanBinManager`).then(res=>res.data)
  }

}

export const notificationServiceHttp = new NotificationServiceC();