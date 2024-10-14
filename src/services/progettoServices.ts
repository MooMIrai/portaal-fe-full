import BaseHttpService from "common/services/BaseHTTPService";
import client from "common/services/BEService";

class ProgettoService extends BaseHttpService {
  getTableName() {
    return "projects";
  }

  getProjectByCustomer = async (
    customerId: number,
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

      const response = await client.post(
        `api/v1/projects/findByCustomer/${customerId}`,
        {},
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  };

  getProjectWorkedDays = async (
    projectId: number,
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

      const response = await client.get(
        `api/v1/projects/getWorkedDays/${projectId}`,
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

  getProjectById = async (
    projectId: number,
    include?: boolean
  ) => {
    try {
      const params = {
        include,
      };

      const response = await client.get(
        `api/v1/projects/${projectId}`,
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

  getGridModel = async () => {
    try {
      const params = {};

      const response = await client.get(
        `api/v1/projects/models`,
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

  deleteProject = async (
    id: number
  ) => {
    try {
      const response = await client.delete(
        `api/v1/projects/delete/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  };
}

export const progettoService = new ProgettoService();
