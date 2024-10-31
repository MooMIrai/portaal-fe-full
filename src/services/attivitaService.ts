import BaseHttpService from "common/services/BaseHTTPService";
import client from "common/services/BEService";

class AttivitaService extends BaseHttpService {
  getTableName() {
    return "activities";
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

  getAssignGridModel = async () => {
    try {
      const params = {};

      const response = await client.get(
        `api/v1/crud/personactivity/models`,
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

  getActivityById = async (
    id: number,
    include?: boolean
  ) => {
    try {
      const response = await client.get(
        `api/v1/activities/${id}?include=true`,
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

  getRelatedPersonActivities = async (
    activity_id: number,
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
        `api/v1/activities/getRelatedPersonActivities/${activity_id}`,
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

  getActivityTypes = async () => {
    try {
      const response = await client.get(
        `api/v1/activities/getActivityTypes`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  };

  addEmployee = async (
    person_id: number,
    activity_id: number,
    start_date: string,
    end_date: string,
    expectedDays: number,
  ) => {
    try {
      const params = {
        person_id,
        activity_id,
        start_date,
        end_date,
        expectedDays,
      };

      const response = await client.post(
        `api/v1/activities/addEmployee`,
        params,
        {}
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  };

  updateEmployee = async (
    person_id: number,
    activity_id: number,
    start_date: string,
    end_date: string,
    expectedDays: number,
  ) => {
    const resourceData = {
      person_id,
      activity_id,
      start_date,
      end_date,
      expectedDays,
    }
    try {
      const response = await client.patch(
        `api/v1/activities/updateEmployee`,
        resourceData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating resource:", error);
      throw error;
    }
  };

  removeEmployee = async (
    person_id: number,
    activity_id: number,
  ) => {

    const params = {
      person_id,
      activity_id,
    }

    try {
      const response = await client.delete(
        `api/v1/activities/removeEmployee`,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  };
}

export const attivitaService = new AttivitaService();