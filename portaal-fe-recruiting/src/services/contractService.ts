import client from "common/services/BEService";
import BaseHttpService from "common/services/BaseHTTPService";

class ContractServiceC extends BaseHttpService {


    getTableName() {
        return "contractType";
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

export const contractService = new ContractServiceC();