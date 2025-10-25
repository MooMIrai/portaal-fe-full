import BaseHttpService from "common/services/BaseHTTPService";

class InterviewServiceC extends BaseHttpService{

    getTableName() {
        return "recruitingInterview";
      }
}

export const interviewService = new InterviewServiceC();