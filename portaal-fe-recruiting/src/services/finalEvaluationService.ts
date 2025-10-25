import BaseHttpService from "common/services/BaseHTTPService";

class FinalEvaluationServiceC extends BaseHttpService{

    getTableName() {
        return "recruitingFinalEvaluation";
      }
}

export const finalEvaluationService = new FinalEvaluationServiceC();