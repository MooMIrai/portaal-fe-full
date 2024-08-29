
import BaseHttpService from "common/services/BaseHTTPService";
import client from "common/services/BEService";
class CS extends BaseHttpService{

  getTableName () {
    return 'customers';
  }

  getHasProject(){
    return client.get('api/v1/customers/findCustomersProjects');
  }

}
  
export const customerService = new CS();
  