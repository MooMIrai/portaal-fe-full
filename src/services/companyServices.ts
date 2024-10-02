
  import client from "common/services/BEService";

  
  class CompanyServicesC {
    getCompany = async (
      pageNum: number,
      pageSize: number,
      filtering:any,
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
          `api/v1/company`,
          { filtering, sorting },
          { params }
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching resources:", error);
        throw error;
      }
    };
    

  
    createCompany = async (resourceData: any) => {
      try {
        const response = await client.post(
          `/api/v1/company/create`,
          resourceData
        );
        return response.data;
      } catch (error) {
        console.error("Error creating resource:", error);
        throw error;
      }
    };
  
  
  

    updateCompany = async (
      id: number,
      resourceData: any
    ) => {
      try {
        const response = await client.patch(
          `api/v1/company/update/${id}`,
          resourceData
        );
        return response.data;
      } catch (error) {
        console.error("Error updating resource:", error);
        throw error;
      }
    };
  
    deleteCompany = async (id: number) => {
      try {
        const response = await client.delete(`api/v1/company/delete/${id}`);
        return response.data;
      } catch (error) {
        console.error("Error deleting resource:", error);
        throw error;
      }
    };
    

  
  }
  
  export const CompanyServices= new CompanyServicesC();
  