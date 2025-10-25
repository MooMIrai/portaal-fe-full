import BaseHttpService from "common/services/BaseHTTPService";

class ContactServiceC extends BaseHttpService{

    getTableName() {
        return "recruitingContact";
      }
}

export const contactService = new ContactServiceC();