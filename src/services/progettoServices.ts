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
    include?: boolean,
    filtering?:any,
    sorting?:any
  ) => {
    try {
      const params = {
        pageNum,
        pageSize,
        include,
      };

      const response = await client.post(
        `api/v1/projects/findByCustomer/${customerId}`,
        {filtering,sorting},
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
    
  };

  getProjectById = async (
    projectId: number,
    include?: boolean
  ) => {
    
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
   
  };

  getGridModel = async () => {
    
      const params = {};

      const response = await client.get(
        `api/v1/projects/models`,
        {
          params,
        }
      );
      return response.data;
   
  };

  getProjectExpensesCreateDtoModel = async () => {
    
      const response = await client.get(
        `api/v1/projectExpenses/dtoModels/create`,
        {}
      );
      return response.data;
    
  }

  getCreateDTOModel = async () => {
    
      const response = await client.get(
        `api/v1/projects/dtoModels/create`,
        {}
      );
      return response.data;
    
  }

  getUpdateDTOModel = async () => {
   
      const response = await client.get(
        `api/v1/projects/dtoModels/update`,
        {}
      );
      return response.data;
    
  }

  deleteProject = async (
    id: number
  ) => {
    
      const response = await client.delete(
        `api/v1/projects/delete/${id}`
      );
      return response.data;
   
  };

  getExpensesByProjectId = async (
    projectId: number,
    pageNum?: number,
    pageSize?: number,
    include?: boolean,
    filtering?: any,
    sorting?: any,
  ) => {
    
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
   
  };

  updateProjectExpense = async (
    id: number,
    description: string,
    amount: number,
    payment_date: string,
    projectExpensesType_id: number,
    files: any[],
  ) => {
   
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
    
  };

  deleteProjectExpense = async (
    id: number
  ) => {
   
      const response = await client.delete(
        `/api/v1/projectExpenses/delete/${id}`
      );
      return response.data;
   
  };
}

export const progettoService = new ProgettoService();
