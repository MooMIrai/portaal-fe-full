import BaseHttpService from "common/services/BaseHTTPService";

class OfferServiceC extends BaseHttpService{

    getTableName() {
        return "recruitingOffer";
      }
}

export const offerService = new OfferServiceC();