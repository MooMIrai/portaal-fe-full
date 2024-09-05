import beService from "common/services/BEService";
  
  class CrudGenericServiceC  {
    token: string | null = null;
  
    fetchResources = async (
      resourceType: string,
      pageNum: number,
      pageSize: number,
      include?: boolean
    ) => {
      try {
        const params = {
          pageNum,
          pageSize,
          include,
        };
  
        const response = await beService.get(`api/v1/crud/${resourceType}/`, {
          params,
        });
        return response?.data;
      } catch (error) {
        console.error("Error fetching resources:", error);
        throw error;
      }
    };
  
    searchGenericGrid = async (
      resourceType: string,
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
        const response = await beService.post(
          `api/v1/crud/${resourceType}`,
          { filtering, sorting },
          { params }
        );
        return response?.data;
      } catch (error) {
        console.error("Error filtering resources:", error);
        throw error;
      }
    };
  
    getGridModel = async (resourceType: string) => {
      try {
        const response = await beService.get(`api/v1/crud/${resourceType}/models`);
        return response?.data;
      } catch (error) {
        console.error("Error fetching resources:", error);
        throw error;
      }
    };
  
    createResource = async (resourceType: string, resourceData: any) => {
      try {
        const response = await beService.post(
          `api/v1/crud/${resourceType}/create`,
          resourceData
        );
        return response?.data;
      } catch (error) {
        console.error("Error creating resource:", error);
        throw error;
      }
    };
  
    fetchResource = async (resourceType: string, id: number) => {
      try {
        const response = await beService.get(`api/v1/crud/${resourceType}/${id}`);
        return response?.data;
      } catch (error) {
        console.error("Error fetching resource:", error);
        throw error;
      }
    };
  
    updateResource = async (
      resourceType: string,
      id: number,
      resourceData: any
    ) => {
      try {
        const response = await beService.patch(
          `api/v1/crud/${resourceType}/update/${id}`,
          resourceData
        );
        return response?.data;
      } catch (error) {
        console.error("Error updating resource:", error);
        throw error;
      }
    };
  
    deleteResource = async (resourceType: string, id: number) => {
      try {
        const response = await beService.delete(
          `api/v1/crud/${resourceType}/delete/${id}`
        );
        return response?.data;
      } catch (error) {
        console.error("Error deleting resource:", error);
        throw error;
      }
    };
  }
  export const LookupsService = new CrudGenericServiceC();