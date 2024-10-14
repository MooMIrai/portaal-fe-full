import BaseHttpService from "common/services/BaseHTTPService";
import client from "common/services/BEService";

class AttivitaService extends BaseHttpService {
  getTableName() {
    return "projects";
  }

  getGridModel = async () => {
    try {
      const params = {};

      const response = await client.get(
        `api/v1/activities/models`,
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

  getActivitiesByProject = async (
    projectId: number,
    pageNum?: number,
    pageSize?: number,
    include?: boolean,
    filtering?: any,
    sorting?: any,
  ) => {
    try {
      const params = {
        pageNum,
        pageSize,
        include,
      };

      const response = await client.post(
        `api/v1/activities/getByProject/${projectId}`,
        { filtering, sorting },
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  };

  deleteActivity = async (
    id: number
  ) => {
    try {
      const response = await client.delete(
        `api/v1/activities/delete/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  };
}

export const attivitaService = new AttivitaService();