import client from "common/services/BEService";
import BaseHttpService from "common/services/BaseHTTPService";

class ProfileServiceC extends BaseHttpService{


    getTableName() {
        return "candidateProfile";
      }

    getAll = async (
        ) => {
        try {
    
            const response = await client.get(`/api/v1/crud/${this.getTableName()}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching resources:", error);
            throw error;
        }
    };

}

export const profileService = new ProfileServiceC();