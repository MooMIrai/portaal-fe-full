import BaseHttpService from "common/services/BaseHTTPService";
import client from "common/services/BEService";

class RichiestaServiceC extends BaseHttpService{


    getTableName() {
        return "recruitingRequest";
    }

    searchAccount (text: string) {
      return client.get(`api/v1/accounts/findByName?search=${text}`).then(res => res.data);
    }

    searchCustomer  =  (
      pageNum: number,
      pageSize: number,
      filtering: any,
      sorting: Array<any>,
      term?: string,
      include?: boolean
    ) => {
      
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
    
        return client.post(
          `/api/v1/customers`,
          queryParams, 
          { params }
        ).then(res => res.data);
        
      }
        
    searchLocation (text:string) {
       return client.get(`api/v1/crud/Location?term=${text}`).then(res => res.data.data)
    };

    searchProfile (text:string) {
      return client.get(`api/v1/crud/CandidateProfile?term=${text}`).then(res => res.data.data)
   };

   // Da testare  valutare di splittare la chimata ?
   getDataSkillTextAI = (text:string) =>
    client
      .post("/api/v1/ai/upload_request_ts", { text: text })
      .then((res) => res.data);

      
   getDataSkillFileAI = (file) =>
    client
      .post("/api/v1/ai/upload_request_ts", { Attachment: file })
      .then((res) => res.data);

    getPossibleCandidates = (requestId:number,pageNum:number,pageSize:number)=> client.post('/api/v1/recruitingCandidate/findAllListByRequest',{
        "recruitingRequestId": requestId,
        "pageNum": pageNum,
        "pageSize": pageSize
      })
      .then((res) => res.data);

    getDetails = (requestId:number)=>client.get('/api/v1/recruitingRequest/getAssignmentsDetails/'+requestId).then(res=>res.data)

    associateCandidate = (candidateId:number,requestid:number) => client.post('/api/v1/recruitingAssignment/create',{
      candidate_id:candidateId,
      request_id:requestid
    }).then(res=>res.data)

    getByCandidate= (candidateId:number,pageNum:number,pageSize:number)=> client.post('/api/v1/recruitingRequest/findAllListByCandidate',{
      "recruitingCandidateId": candidateId,
      "pageNum": pageNum,
      "pageSize": pageSize
    })

  }

export const richiestaService = new RichiestaServiceC();