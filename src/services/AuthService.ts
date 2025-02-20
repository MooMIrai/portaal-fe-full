import CookieRepo from "../repositories/CookieRepo";
import tokenService from "./tokenService";

class AuthService {
  protected removeToken() {
    CookieRepo.delete("accessToken");
  }

  protected setToken(token: string) {
    const tokenData = tokenService.decodeToken(token);
    if (!tokenData) {
      throw new Error("Token not valid");
    }
    CookieRepo.write("accessToken", token, new Date(tokenData.exp * 1000));
    window.addEventListener("LOGOUT", this.removeToken, { once: true });
  }


  hasPermission(permission:string){

    return true;
  }
  
  
  getImage(){
    const token = this.getToken();
    const tokenData = tokenService.decodeToken(token);
    if (!tokenData) {
      throw new Error("Token not valid");
    }
    return tokenData.image_url;
  }


  getUserName(){
    const token = this.getToken();
    const tokenData = tokenService.decodeToken(token);
    if (!tokenData) {
      throw new Error("Token not valid");
    }
    return tokenData.username;
  }

  login(token: string) {
    this.setToken(token);
  }

  logout() {
    //window.dispatchEvent(new CustomEvent("LOGOUT"));
    this.removeToken()
  }

  getToken() {
    const token = CookieRepo.read("accessToken");
    if (!token) {
      // return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjksImVtcGxveWVlX2lkIjoiOSIsImVtYWlsIjoibXZlcmRlQHRhYWwuaXQiLCJ1c2VybmFtZSI6Im12ZXJkZUB0YWFsLml0Iiwicm9sZXMiOlt7ImlkIjoxLCJyb2xlIjoiQURNIiwiZGVzY3JpcHRpb24iOiJBZG1pbiIsImRhdGVfY3JlYXRlZCI6IjIwMjQtMDgtMDVUMTg6MDc6MzkuNzQyWiIsImRhdGVfbW9kaWZpZWQiOiIyMDI0LTA4LTA2VDA4OjUwOjQxLjI2M1oiLCJ1c2VyX2NyZWF0ZWQiOiJTZWVkIEF1dG9tYXRpYyIsInVzZXJfbW9kaWZpZWQiOiJTZWVkIEF1dG9tYXRpYyJ9LHsiaWQiOjIsInJvbGUiOiJBTU1JIiwiZGVzY3JpcHRpb24iOiJBbW1pbmlzdHJhemlvbmUiLCJkYXRlX2NyZWF0ZWQiOiIyMDI0LTA4LTA1VDE4OjA3OjQwLjY3NloiLCJkYXRlX21vZGlmaWVkIjoiMjAyNC0wOC0wNlQwODo1MDo0Mi4wOThaIiwidXNlcl9jcmVhdGVkIjoiU2VlZCBBdXRvbWF0aWMiLCJ1c2VyX21vZGlmaWVkIjoiU2VlZCBBdXRvbWF0aWMifV0sImlhdCI6MTcyMzAxOTk4MSwiZXhwIjoxNzIzNjI0NzgxfQ.DSNYTk2_magD7WbLDe2b4s7DsU6VM9k5J55kDKBYjhk';
      throw "Token expired";
    }
    return token;
  }

  getData() {
    const token = this.getToken();
    const tokenData = tokenService.decodeToken(token);
    return { ...tokenData };
  }

  getTenants(filter: string): Promise<{ id: any; name: string }[]> {
    const token = this.getToken();
    const tenantsData = tokenService.getTenantsFromJwt(token);

    // Filtro i tenants in base al parametro `filter`, se necessario
    const filteredTenants = Object.values({ ...tenantsData })
      .filter((el) => {
        const name = typeof el === "string" ? el : "";
        return name.toLowerCase().includes(filter.toLowerCase());
      })
      .map((el) => {
        return { id: Math.random(), name: String(el) }; // Assicura che `el` sia una stringa
      });

    // Restituisco i tenant filtrati in una Promise
    return Promise.resolve(filteredTenants);
  }
}

export default new AuthService();
