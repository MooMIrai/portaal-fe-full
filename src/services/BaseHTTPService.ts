import client from './BEService';

export default abstract class BaseHTTPService{
    
    abstract getTableName():string;

    search = async (
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
          `/api/v1/${this.getTableName()}`,
          queryParams, 
          { params }
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching resources:", error);
        throw error;
      }
    };
    
    
    fetchModel = async (
    ) => {
      try {
  
        const response = await client.get(`/api/v1/${this.getTableName()}/models`);
        return response.data;
      } catch (error) {
        console.error("Error fetching resources:", error);
        throw error;
      }
    };
  
  
    createResource = (resourceData: any) => {
      return client.post(
        `/api/v1/${this.getTableName()}/create`,
        resourceData
      ).then(res=>res.data)
      
    };
  
    fetchResource = async ( id: number) => {
      try {
        const response = await client.get(`/api/v1/${this.getTableName()}/${id}`);
        return response.data;
      } catch (error) {
        console.error("Error fetching resource:", error);
        throw error;
      }
    };
  
    updateResource = async (
      id: number,
      resourceData: any
    ) => {
      try {
        const response = await client.patch(
          `/api/v1/${this.getTableName()}/update/${id}`,
          resourceData
        );
        return response.data;
      } catch (error) {
        console.error("Error updating resource:", error);
        throw error;
      }
    };
  
    deleteResource = async (id: number) => {
      try {
        const response = await client.delete(`/api/v1/${this.getTableName()}/delete/${id}`);
        return response.data;
      } catch (error) {
        console.error("Error deleting resource:", error);
        throw error;
      }
    };
  
  
}