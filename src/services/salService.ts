import BaseHttpService from "common/services/BaseHTTPService"
import client from "common/services/BEService";
import { remove } from "lodash";

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
        `api/v1/sal/getSalFromProject/${projectId}`,
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
        { filtering: { other_filters: filtering }, sorting },
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
        { filtering: { other_filters: filtering }, sorting },
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
        { filtering:this.transformFilters(filtering), sorting },
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
          { filtering: { other_filters: filtering }, sorting },
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
          { filtering:this.transformFilters(filtering), sorting },
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
        { filtering:this.transformFilters(filtering),
           sorting },
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
          { filtering: { other_filters: filtering }, sorting },
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
          { filtering:this.transformFilters(filtering), sorting },
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
      
        const params = {pageNum, pageSize, include};

        const mainFilters = ["baf_number"];
        const filters = remove(filtering.filters, record => mainFilters.includes(record.field));
        const mainFiltering = Object.fromEntries(filters.map(filter => [filter.field, filter.value]));

        const response = await client.post(
          `/api/v1/bills/getBillByProject/${customer_id}`,
          { filtering: {other_filters: filtering, ...mainFiltering}, sorting },
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

        filtering.filters = filtering?.filters?.filter(filter => filter.value !== "");

        const response = await client.post(
          `/api/v1/bills/getBillFromProject/${project_id}`,
          { filtering: { other_filters: filtering }, sorting },
          { params }
        );
        return response.data;
      
    };

    getSalWorkedDays = (projectId:number, month:number,year:number)=>{
      return client.get('api/v1/sal/getPersonalWorkedDays',{ params: { project_id:projectId,month,year } });
    }

    createBill =  (resourceData: any) => {
      return client.post(
        `/api/v1/bills/create`,
        resourceData
      ).then(res=>res.data)
      
    };

    updateBill = async (
      id: number,
      resourceData: any
    ) => {
      return client.patch(
          `/api/v1/bills/update/${id}`,
          resourceData
        ).then(res=>res.data)
    };

    deleteBill = async (
      id: number
    ) => {
      return client.delete(
          `/api/v1/bills/delete/${id}`,
        ).then(res=>res.data)
    };

    searchCustomer (text:string) {
      return client.get(`api/v1/customers?term=${text}`).then(res => res.data.data)
   };

   transformFilters(obj: any): Record<string, any> | null {
    if (!obj || !obj.filters || !Array.isArray(obj.filters)) {
      return null;
    }
  
    return obj.filters.reduce((acc, filter) => {
      if (filter.field && filter.value !== undefined) {
        if(filter.id==='year' && typeof filter.value === 'string'){
          acc[filter.field] = parseInt(filter.value);
        }else{
          acc[filter.field] = filter.value;
        }
        
      }
      return acc;
    }, {} as Record<string, any>);
  }
}

export const salService = new SalService();