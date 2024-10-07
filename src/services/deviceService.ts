import client from "common/services/BEService";
import BaseHttpService from "common/services/BaseHTTPService";
class DeviceService extends BaseHttpService {

    getTableName () {
        return 'stock';
      }

    

}

export const deviceService = new DeviceService()