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

  login = (email:string,password:string)=>{
    return  client.post(`/auth/basic`,{email,password}).then((res:any)=>{
      if(res.data){
        window.location.href='/auth-success?token='+res.data.token;
      }
    });
  }

  changePassword = (data:any)=>{
    return client.post('/api/v1/accounts/editPassword',data).then((res:any)=>{res.data})
  }
}

export const ProfileService = new ProfileServiceC();
