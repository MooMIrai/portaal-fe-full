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
    
  };

  getSalFromProject = async (
    projectId: number,
    pageNum: number,
    pageSize: number,
    filtering: any,
    sorting: Array<any>,
    include?: boolean
  ) => {
    
      const params = {
        pageNum,
        pageSize,
        include,
      };

      const response = await client.post(
        `api/v1/sal/getSalFromProject/${projectId}`,
        { filtering, sorting },
        { params }
      );
      return response.data;
    
  };

  getSalRTBFromProject = async (
    projectId: number,
    pageNum: number,
    pageSize: number,
    filtering: any,
    sorting: Array<any>,
    include?: boolean
  ) => {
    
      const params = {
        pageNum,
        pageSize,
        include,
      };

      const response = await client.post(
        `api/v1/bills/getReadyToBillFromProject/${projectId}`,
        { filtering, sorting },
        { params }
      );
      return response.data;
    
  };


  getCustomersWithSal = (
    pageNum: number,
    pageSize: number,
    filtering?: any,
    sorting?: Array<any>,
    include?: boolean) =>{
      const params = {
        pageNum,
        pageSize,
        include,
      };

      return  client.post(
        `/api/v1/sal/draftsByCustomer`,
        { filtering, sorting },
        { params }
      ).then(response=>response.data);
    }
  
    getProjectsWithSal = (
      customerID:number,
      pageNum: number,
      pageSize: number,
      filtering?: any,
      sorting?: Array<any>,
      include?: boolean) =>{
        const params = {
          pageNum,
          pageSize,
          include,
        };
  
        return  client.post(
          `/api/v1/sal/draftsByProject/${customerID}`,
          { filtering, sorting },
          { params }
        ).then(response=>response.data);
    }

    getActivitiesWithSal = (
      project:number,
      pageNum: number,
      pageSize: number,
      filtering?: any,
      sorting?: Array<any>,
      include?: boolean) =>{
        const params = {
          pageNum,
          pageSize,
          include,
        };
  
        return  client.post(
          `/api/v1/sal/draftsByActivity/${project}`,
          { filtering, sorting },
          { params }
        ).then(response=>response.data);
    }

    getAllocationsWithSal = (
      activity:number,
      pageNum: number,
      pageSize: number,
      filtering?: any,
      sorting?: Array<any>,
      include?: boolean) =>{
        const params = {
          pageNum,
          pageSize,
          include,
        };
  
        return  client.post(
          `/api/v1/sal/draftsByPersonActivity/${activity}`,
          { filtering, sorting },
          { params }
        ).then(response=>response.data);
    }

    getPersonWithSal = (
      person:number,
      pageNum: number,
      pageSize: number,
      filtering?: any,
      sorting?: Array<any>,
      include?: boolean) =>{
        const params = {
          pageNum,
          pageSize,
          include,
        };
  
        return  client.post(
          `/api/v1/sal/salByPersonActivity/${person}`,
          { filtering, sorting },
          { params }
        ).then(response=>response.data);
    }

  getReadyToBillByCustomer = ( pageNum: number,
    pageSize: number,
    filtering?: any,
    sorting?: Array<any>,
    include?: boolean) =>{
      const params = {
        pageNum,
        pageSize,
        include,
      };

      return  client.post(
        `/api/v1/bills/getReadyToBillByCustomer`,
        { filtering, sorting },
        { params }
      ).then(response=>response.data);
    }

    getReadyToBillByProject = ( customerId:number,pageNum: number,
      pageSize: number,
      filtering?: any,
      sorting?: Array<any>,
      include?: boolean) =>{
        const params = {
          pageNum,
          pageSize,
          include,
        };
  
        return  client.post(
          `/api/v1/bills/getReadyToBillByProject/${customerId}`,
          { filtering, sorting },
          { params }
        ).then(response=>response.data);
    }

    getHistoryBillCustomer = async (
      pageNum: number,
      pageSize: number,
      filtering: any,
      sorting: Array<any>,
      include?: boolean
    ) => {
      
        const params = {
          pageNum,
          pageSize,
          include,
        };
  
        const response = await client.post(
          `/api/v1/bills/getBillByCustomer`,
          { filtering, sorting },
          { params }
        );
        return response.data;
      
    };

    getHistoryBillFromCustomer = async (
      customer_id: number,
      pageNum: number,
      pageSize: number,
      filtering: any,
      sorting: Array<any>,
      include?: boolean
    ) => {
      
        const params = {
          pageNum,
          pageSize,
          include,
        };
  
        const response = await client.post(
          `/api/v1/bills/getBillByProject/${customer_id}`,
          { filtering, sorting },
          { params }
        );
        return response.data;
      
    };
    
    getHistoryBillFromProject = async (
      project_id: number,
      pageNum: number,
      pageSize: number,
      filtering: any,
      sorting: Array<any>,
      include?: boolean
    ) => {
      
        const params = {
          pageNum,
          pageSize,
          include,
        };
  
        const response = await client.post(
          `/api/v1/bills/getBillFromProject/${project_id}`,
          { filtering, sorting },
          { params }
        );
        return response.data;
      
    };

    getSalWorkedDays = (projectId:number, month:number,year:number)=>{
      return client.get('api/v1/sal/getPersonalWorkedDays',{ params: { project_id:projectId,month,year } });
    }

}

export const salService = new SalService();