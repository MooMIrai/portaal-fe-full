import BaseHttpService from "common/services/BaseHTTPService";
import client from "common/services/BEService";
class CandidatoServiceC extends BaseHttpService {


  getTableName() {
    return "recruitingCandidate";
  }

  getCVDataAI = (file) =>
    client
      .post("/api/v1/ai/upload_cv", { Attachment: file })
      .then((res) => res.data);

  getSkillAI = (file) =>
    client
      .post("/api/v1/ai/upload_cv_ts", { Attachment: file })
      .then((res) => res.data);

}

export const candidatoService = new CandidatoServiceC();