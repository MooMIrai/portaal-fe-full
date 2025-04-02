
import BaseHttpService from "common/services/BaseHTTPService";
import client from "common/services/BEService";
class CS extends BaseHttpService {

  getTableName() {
    return 'customers';
  }

  /* getHasProject() {
    return client.post('api/v1/customers/findCustomersProjects');
  }
 */
  getHasProject = async (
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
        'api/v1/customers/findCustomersProjects',
        queryParams, 
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  };
  

}

export const customerService = new CS();
