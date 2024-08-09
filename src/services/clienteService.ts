
  import client from "common/services/BEService";
  
  class CS {
    getCustomers = async (
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
          `api/v1/customers`,
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
  
        const response = await client.get(`api/v1/customers/models`);
        return response.data;
      } catch (error) {
        console.error("Error fetching resources:", error);
        throw error;
      }
    };
  
  
    createResource = async (resourceData: any) => {
      try {
        const response = await client.post(
          `/api/v1/customers/create`,
          resourceData
        );
        return response.data;
      } catch (error) {
        console.error("Error creating resource:", error);
        throw error;
      }
    };
  
    fetchResource = async (resourceType: string, id: number) => {
      try {
        const response = await client.get(`crud/${resourceType}/${id}`);
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
          `api/v1/customers/update/${id}`,
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
        const response = await client.delete(`api/v1/customers/delete/${id}`);
        return response.data;
      } catch (error) {
        console.error("Error deleting resource:", error);
        throw error;
      }
    };
  }
  
  export const customerService = new CS();
  