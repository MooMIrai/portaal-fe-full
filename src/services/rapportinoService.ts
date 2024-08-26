import client from "common/services/BEService";

class TimesheetsServiceC {
  findOrCreate = async (
    employeeId: number,
    year: number,
    month: number,
    comments: string
  ) => {
    try {
      const response = await client.post(`api/v1/timesheets/findOrCreate`, {
        employee_id: employeeId,
        year,
        month,
        comments,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  };

  getSingleTimesheets = async (id: number, include: boolean) => {
    try {
      const response = await client.get(`api/v1/timesheets/${id}`, {
        params: {
          include: include,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error(
        "Error fetching resource:",
        error.response ? error.response.data : error
      );
      throw error;
    }
  };

  getActivitiesByDate = async (date: Date, timesheetId: number) => {
    console.log("date: " + date + " - timesheetId: " + timesheetId);
    try {
      const response = await client.get(`api/v1/activities/byDate`, {
        params: {
          date: date,
          timesheet_id: timesheetId,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error(
        "Error fetching resource:",
        error.response ? error.response.data : error
      );
      throw error;
    }
  };

  getActivitiesByListDates = async (dates: Date[], timesheetId: number) => {
    try {
      const response = await client.get(`api/v1/activities/byListDates`, {
        params: {
          dates: dates,
          timesheet_id: timesheetId,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error(
        "Error fetching resource:",
        error.response ? error.response.data : error
      );
      throw error;
    }
  };
}

export const TimesheetsService = new TimesheetsServiceC();
