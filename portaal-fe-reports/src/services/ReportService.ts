import client from "common/services/BEService";
import BaseHttpService from "common/services/BaseHTTPService";

class ReportServiceC extends BaseHttpService{


    getTableName() {
        return "report-operativo";
      }

    getAll = (category?:string) => {
            return client.get(`/api/v1/${this.getTableName()}`,{
                params:{category}
            }).then(res=>res.data) 
    };

    getAllCategories = () => {
            return client.get(`/api/v1/${this.getTableName()}/categories`).then(res=>res.data)    
    };

    getDetail = (id:string) => {
        return client.get(`/api/v1/${this.getTableName()}/${id}`).then(res=>res.data)    
    };

    generate = (id:string,data:any) => {
        return client.post(`/api/v1/${this.getTableName()}/${id}/generate`,
        data,{
            responseType: 'blob', 
        }).then(res=>res.data)    
    };

}

export const reportService = new ReportServiceC();