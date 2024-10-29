import client from "common/services/BEService";

class PFMServiceC {
  getRequests = async (
    leaveType: "new" | "archived",
    pageNum: number,
    pageSize: number,
    filtering?: any,
    sorting?: any,
    include?: boolean,
  ) => {
    try {
      const params = {
        pageNum,
        pageSize,
        include,
      };

      const response = await client.post(
        `api/v1/leave_requests/type/${leaveType}`,
        { filtering, sorting },
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  };
  
  approveRejectRequest = async (
    requestId: number,
    approve: boolean,
  ) => {
    try {
      const response = await client.post(`api/v1/leave_requests/archive/${requestId}?approved=${approve}`, {});
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  };

  undoApproveReject = async (
    requestId: number,
  ) => {
    try {
      const response = await client.post(`api/v1/leave_requests/reset/${requestId}`, {});
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  }
}

export const PFMService = new PFMServiceC();