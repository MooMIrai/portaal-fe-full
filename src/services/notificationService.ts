import BaseHttpService from "common/services/BaseHTTPService";
import client from "common/services/BEService";

class NotificationServiceC extends BaseHttpService {


  getTableName() {
    return "notificationDetail";
  }

  getMy(idUser?:number){

    return client.get('/api/v1/notificationDetail/getMyNotify?id_account',{
        params: { id_account: idUser},
    }).then(r=>r.data);

  }

}

export const notificationServiceHttp = new NotificationServiceC();