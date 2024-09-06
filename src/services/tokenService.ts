// src/services/tokenService.ts
interface DecodedToken {
  exp: number;
  [key: string]: any;
}

class TService {
  decodeToken(token: string | null): DecodedToken | null {
    if (!token) return null;
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      const decodedToken = JSON.parse(jsonPayload) as DecodedToken;
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp < currentTime) {
        // Token has expired
        return null;
      }
      return decodedToken;
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  }

  getTenantsFromJwt(token: string | null): string[] | null {
    const decodedToken = this.decodeToken(token);

    if (decodedToken && decodedToken.tenants) {
      return decodedToken.tenants;
    }

    return null;
  }
}

export default new TService();
