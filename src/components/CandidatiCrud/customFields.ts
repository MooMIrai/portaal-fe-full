import profileService from "../../services/profileService"


const getDataProfile= ()=>{
    return profileService.getAll().then((res)=>{
        if(res ){
            return res.map(r=>({id:r.id,code:r.code,description:r.description}));
        }
        return []
    });
}

export const formFields = {
    "profile-selector": AutoCompleteProfile,
    
};