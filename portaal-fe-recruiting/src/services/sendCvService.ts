import BaseHttpService from "common/services/BaseHTTPService";

class SendCvServiceC extends BaseHttpService{

    getTableName() {
        return "recruitingSendCv";
      }

}

export const sendCvService = new SendCvServiceC();