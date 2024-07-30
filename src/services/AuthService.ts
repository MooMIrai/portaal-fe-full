import CookieRepo from "../repositories/CookieRepo";
import tokenService from "./TokenService";


class AuthService {


    protected removeToken(){
        CookieRepo.delete("accessToken");
    }

    protected setToken(token:string){
        const tokenData=tokenService.decodeToken(token);
        if(!tokenData){
            
            throw new Error("Token not valid");
        }
        CookieRepo.write("accessToken",token,new Date( tokenData.exp * 1000 ));
        window.addEventListener("LOGOUT",this.removeToken,{once:true});
    }

    
    login(token:string){
        this.setToken(token);
    }

    logout(){
        window.dispatchEvent(new CustomEvent("LOGOUT"));
    }

    getToken(){
        const token =  CookieRepo.read('accessToken');
        if(!token){
            throw ("Token expired")
        }
        return token;
    }

    getData(){
        const token = this.getToken();
        const tokenData = tokenService.decodeToken(token);
        return {...tokenData}
    }
}

export default new AuthService();