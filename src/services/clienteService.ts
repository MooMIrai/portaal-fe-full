
import BaseHttpService from "common/services/BaseHTTPService";
class CS extends BaseHttpService{

  getTableName () {
    return 'customers';
  }


}
  
export const customerService = new CS();
  