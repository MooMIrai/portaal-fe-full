import client from "common/services/BEService";

class TimesheetsServiceC {
  findOrCreate = async (
    year: number,
    month: number,
    comments: string,
    employeeId?: number
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

  //nn si usa
  syncDay = async (
    timesheet_id: number,
    day: number,
    TimeSheetDetails: {
      hours: number,
      minutes: number,
      activity_id: number,
      leaverequest_id?: number
    }[],
    accept_holidays?: boolean,
  ) => {
    try {
      const response = await client.post(`api/v1/timesheets/syncDetail?accept_holidays=${accept_holidays || true}`, {
        timesheet_id,
        day,
        TimeSheetDetails
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  };

  //nn si usa
  syncMultipleDays = async (
    data: {
      timesheet_id: number,
      day: number,
      TimeSheetDetails: {
        hours: number,
        minutes: number,
        activity_id: number,
        leaverequest_id?: number
      }[]
    }[],
    accept_holidays?: boolean,
  ) => {
    try {
      const response = await client.post(`api/v1/timesheets/syncMassiveDetail?accept_holidays=${accept_holidays || true}`, data);
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  };

  saveActivities = (timesheet_id: number, startdate: string, enddate: string, details: { activity_id: number, minutes: number, hours: number }[], accept_holidays: boolean) => {
    return client.post('api/v1/timesheets/syncDetails?accept_holidays=' + accept_holidays, {
      timesheet_id: timesheet_id,
      start_date: startdate,
      end_date: enddate,
      TimeSheetDetails: details
    });
  }

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

  deleteLeaveRequest(id: number) {
    return client.delete('api/v1/leave_requests/delete/' + id);
  }

  finalizeTimesheet = async (
    id: number,
  ) => {
    try {
      const response = await client.patch(
        `api/v1/timesheets/finalize/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error finalizing timesheet:", error);
      throw error;
    }
  };

  deconsolidateTimesheet = async (
    id: number,
  ) => {
    try {
      const response = await client.patch(
        `api/v1/timesheets/deconsolidate/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deconsolidating timesheet:", error);
      throw error;
    }
  };
}

export const TimesheetsService = new TimesheetsServiceC();
