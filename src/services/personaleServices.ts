import {
  CompositeFilterDescriptor,
  SortDescriptor,
} from "@progress/kendo-data-query";
import client from "common/services/BEService";

class CrudGenericServiceC {
  getAccounts = async (
    pageNum: number,
    pageSize: number,
    filtering: CompositeFilterDescriptor,
    sorting: Array<SortDescriptor>,
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
        `api/v1/crud/account`,
        { filtering, sorting },
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  };
  
  fetchResources = async (
    resourceType: string,
    pageNum?: number,
    pageSize?: number,
    include?: boolean
  ) => {
    try {
      const params = {
        pageNum,
        pageSize,
        include,
      };

      const response = await client.get(`api/v1/crud/${resourceType}`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  };

    
  fetchmodel = async (
  ) => {
    try {

      const response = await client.get(`api/v1/accounts/models`);
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  };


  createResource = async (resourceData: any) => {
    try {
      const response = await client.post(
        `/api/v1/accounts/create`,
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
        `api/v1/accounts/update/${id}`,
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
      const response = await client.delete(`api/v1/accounts/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting resource:", error);
      throw error;
    }
  };
}

export const CrudGenericService = new CrudGenericServiceC();
