import client from "common/services/BEService";
import BaseHttpService from "common/services/BaseHTTPService";
class DeviceService extends BaseHttpService {

    getTableName () {
        return 'stock';
      }

    getDeviceTypes(term:string){
      return client.get('/api/v1/crud/deviceType?term='+term)
    }



}

export const deviceService = new DeviceService()