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

  getProjectExpensesCreateDtoModel = async () => {
    try {
      const response = await client.get(
        `api/v1/projectExpenses/dtoModels/create`,
        {}
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  }

  getCreateDTOModel = async () => {
    try {
      const response = await client.get(
        `api/v1/projects/dtoModels/create`,
        {}
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  }

  getUpdateDTOModel = async () => {
    try {
      const response = await client.get(
        `api/v1/projects/dtoModels/update`,
        {}
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  }

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

  getExpensesByProjectId = async (
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
        `/api/v1/projectExpenses/find/${projectId}`,
        { filtering, sorting },
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  };

  getProjectExpensesTypes = (text: string) => {
    return client.get(`api/v1/projectExpenses/getExpenseTypes?term=${text}`).then(res => res.data);
  }

  createProjectExpense = async (
    project_id: number,
    description: string,
    amount: number,
    payment_date: string,
    projectExpensesType_id: number,
    files: any[],
  ) => {
    try {
      const params = [{
        project_id,
        description,
        amount,
        payment_date,
        projectExpensesType_id,
        Attachment: files
      }];

      const response = await client.post(
        `api/v1/projectExpenses/create/${project_id}`,
        params,
        {}
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  };

  updateProjectExpense = async (
    id: number,
    description: string,
    amount: number,
    payment_date: string,
    projectExpensesType_id: number,
    files: any[],
  ) => {
    try {
      const params = [{
        id,
        description,
        amount,
        payment_date,
        projectExpensesType_id,
        Attachment: files
      }];

      const response = await client.patch(
        `api/v1/projectExpenses/update`,
        params,
        {}
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  };

  deleteProjectExpense = async (
    id: number
  ) => {
    try {
      const response = await client.delete(
        `/api/v1/projectExpenses/delete/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  };
}

export const progettoService = new ProgettoService();
