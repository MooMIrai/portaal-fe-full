import BaseHttpService from "common/services/BaseHTTPService"
import client from "common/services/BEService";

class SalService extends BaseHttpService {

  getTableName() {
    return 'sal'
  }

  getGridModel = async () => {
    try {
      const params = {};

      const response = await client.get(
        `api/v1/sal/models`,
        {
          params,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  };

  findSal = async (
    pageNum: number,
    pageSize: number,
    filtering: any,
    sorting: Array<any>,
    include?: boolean
  ) => {
    try {
      const params = {
        pageNum,
        pageSize,
        include,
      };

      const response = await client.post(
        `api/v1/sal/findSal`,
        { filtering, sorting },
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  };

  getSal = async (
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

      const response = await client.get(`api/v1/sal/`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  };

  getSalByProject = async (
    projectId: number,
    pageNum: number,
    pageSize: number,
    filtering: any,
    sorting: Array<any>,
    include?: boolean
  ) => {
    try {
      const params = {
        pageNum,
        pageSize,
        include,
      };

      const response = await client.post(
        `api/v1/sal/getSalByProject/${projectId}`,
        { filtering, sorting },
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  };
}

export const salService = new SalService();