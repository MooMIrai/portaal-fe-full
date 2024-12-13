import BaseHttpService from "common/services/BaseHTTPService";
class CandidatoServiceC extends BaseHttpService {


  getTableName() {
    return "recruitingCandidate";
  }

}

export const candidatoService = new CandidatoServiceC();