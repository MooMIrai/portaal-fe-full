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
        const params = {
          pageNum,
          pageSize,
          term,
          include,
        };
  
        const response = await client.post(
          `/api/v1/${this.getTableName()}`,
          (!filtering || filtering.length===0) && (!sorting ||sorting.length==0)?undefined:{ filtering, sorting }, 
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