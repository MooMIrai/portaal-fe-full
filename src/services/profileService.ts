import client from "common/services/BEService";

class ProfileServiceC {
  getProfileInfo = async () => {
    try {
      const response = await client.get(`/api/v1/accounts/getOwnProfile`);
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  };
}

export const ProfileService = new ProfileServiceC();
