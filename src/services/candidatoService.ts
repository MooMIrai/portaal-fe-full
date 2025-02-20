import BaseHttpService from "common/services/BaseHTTPService";
import client from "common/services/BEService";
class CandidatoServiceC extends BaseHttpService {


  getTableName() {
    return "recruitingCandidate";
  }

  searchDip = async (
    pageNum: number,
    pageSize: number,
    filtering: any,
    sorting: Array<any>,
    term?: string,
    include?: boolean
  ) => {
    try {
      const params:any = {
        pageNum,
        pageSize,
        include,
      };
      if (typeof term === "string" && term.trim() !== "") {
        params.term = term;
      }

      const queryParams:any = {};
      if(filtering){
        queryParams.filtering=filtering
      }
      if(sorting){
        queryParams.sorting=sorting
      }
      if(include){
        queryParams.include=true
      }
  
      const response = await client.post(
        `/api/v1/crud/Person`,
        queryParams, 
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  };

  getCVDataAI = (file) =>
    client
      .post("/api/v1/ai/upload_cv", { Attachment: file })
      .then((res) => res.data);

  getSkillAI = (file) =>
    client
      .post("/api/v1/ai/upload_cv_ts", { Attachment: file })
      .then((res) => res.data);

  getGenders() {
    return client.get(`api/v1/crud/Gender`).then(res => res.data)
  };
}

export const candidatoService = new CandidatoServiceC();