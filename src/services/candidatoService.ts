import client from "common/services/BEService";
import BaseHttpService from "common/services/BaseHTTPService";
class CandidatoServiceC extends BaseHttpService{


    getTableName() {
        return "recruitingCandidate";
      }

   /*  search =  (
        pageNum: number,
        pageSize: number,
        filtering:any,
        sorting: any,
        include?: boolean
      ) => {
        
          const params = {
            pageNum,
            pageSize,
            include,
          };
    


          return client.post(
            `api/v1/recruitingCandidate`,
            { filtering, sorting },
            { params }
          ).then(res=>res.data)
          
        
      }; */
}

export const candidatoService = new CandidatoServiceC();