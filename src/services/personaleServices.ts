import client from "common/services/BEService";
import BaseHttpService from "common/services/BaseHTTPService";

class CrudGenericServiceC {
  getAccounts = async (
    pageNum: number,
    pageSize: number,
    filtering: any,
    sorting: any,
    include?: boolean
  ) => {
    try {
      const params = {
        pageNum,
        pageSize,
        include,
      };

      const response = await client.post(
        `api/v1/accounts`,
        { filtering, sorting },
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  };

  getSkillArea = async (include?: boolean) => {
    try {
      const params = {
        include,
      };

      const response = await client.post(`api/v1/skillArea`, { params });
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

  fetchmodel = async () => {
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
  getCV = async (id: number) => {
    try {
      const response = await client.get(`api/v1/files/stream/${id}`, {
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  };

  getCVaI = (file) =>
    client
      .post("/api/v1/ai/upload_cv", { Attachment: file })
      .then((res) => res.data);

  getSkillAI = (file) =>
    client
      .post("/api/v1/ai/upload_cv_ts", { Attachment: file })
      .then((res) => res.data);

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


  searchCommerciale = (text: string) => {
    return client
      .get(`api/v1/accounts/findCOM?search=${text}`)
      .then((res) => res.data);
  };

  searchAccount = (text: string) => {
    return client
      .get(`api/v1/accounts/findByName?search=${text}`)
      .then((res) => res.data);
  };

  searchRoles = () => {
    return client
      .get(`api/v1/crud/Role`)
      .then((res) => res.data);
  };

  getPermissions = async (
    pageNum: number,
    pageSize: number,
    filtering: any,
    sorting: any,
    include?: boolean
  ) => {
    try {
      const params = {
        pageNum,
        pageSize,
        include,
      };

      const response = await client.post(
        `api/v1/crud/activitytype`,
        { filtering, sorting },
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  };


  async getFilesByIds(uniqueIdentifiers: string) {
    const response = await client.get(`api/v1/files/get/${uniqueIdentifiers}`);
    return response.data;
  }
  catch(error) {
    console.error("Error fetching resources:", error);
    throw error;
  }

  getResourceAlignment=(
    pageNum: number,
    pageSize: number,
    filtering: any,
    sorting: any,
    include?: boolean
  ) => {

    const params = {
      pageNum,
      pageSize,
      include,
    };

    return client.post(
      `api/v1/resourceAlignment/getAll`,
      { filtering, sorting },
      { params }
    ).then(res=>res.data);
      
  }

  upadateResourceAlignment=(
    id:number,
    data:any
  ) => {

    

    return client.patch(
      `api/v1/resourceAlignment/update/${id}`,
      data
    ).then(res=>res.data);
      
  }
 
}

export const CrudGenericService = new CrudGenericServiceC();


class CS extends BaseHttpService {

  getTableName() {
    return 'accounts';
  }

  createPassword(id:number){
    return client.post(`/api/v1/accounts/createPassword/${id}`).then(res=>res.data)
  }

}

export const accountsService = new CS();