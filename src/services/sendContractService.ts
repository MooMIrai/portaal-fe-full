import BaseHttpService from "common/services/BaseHTTPService";

class SendContractServiceC extends BaseHttpService{

    getTableName() {
        return "recruitingSendContract";
      }
}

export const sendContractService = new SendContractServiceC();