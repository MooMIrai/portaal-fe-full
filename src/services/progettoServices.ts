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

      const response = await client.get(
        `api/v1/projects/findByCustomer/${customerId}`,
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
}

export const progettoService = new ProgettoService();
