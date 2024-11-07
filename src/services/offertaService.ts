import BaseHttpService from "common/services/BaseHTTPService"
import client from "common/services/BEService";
import { mapBillingTypeName, mapOutcomeTypeName } from "../adapters/offertaAdapters";
class OffertaService extends BaseHttpService {

  getTableName() {
    return 'offers'
  }


  getProjectType(term: string) {
    return client.get('/api/v1/crud/projecttype?term=' + term)
  }

  getBillingType(term: string) {

    return client.get('/api/v1/offers/billingTypes').then(res => {
      return res.data.map(p => ({ id: p, name: mapBillingTypeName(p) })).filter(p => !term || !term.length || p.name.toLowerCase().indexOf(term.toLocaleLowerCase()) >= 0);
    })
  }

  getOutcomeType(term: string) {

    return client.get('/api/v1/offers/outcomeTypes').then(res => {
      return res.data.map(p => ({ id: p, name: mapOutcomeTypeName(p) })).filter(p => !term || !term.length || p.name.toLowerCase().indexOf(term.toLocaleLowerCase()) >= 0);
    })
  }

  fetchResources = async (
    resourceType: string,
    pageNum?: number,
    pageSize?: number,
    include?: boolean
  ) => {
    try {
      const params = {
        pageNum,
        pageSize,
        include,
      };

      const response = await client.get(`api/v1/crud/${resourceType}`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  };
  getDownloadFile = async (
    id: string
  ) => {
    try {

      const response = await client.get(
        `api/v1/files/stream/${id}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  };
  async getFilesByIds(uniqueIdentifiers: string) {
    const response = await client.get(`api/v1/files/get/${uniqueIdentifiers}`);
    return response.data;
  } catch(error) {
    console.error("Error fetching resources:", error);
    throw error;
  }

  searchOfferte = (text: string) => {
    return client.get(`api/v1/offers/?term=${text}`).then(res => res.data);
  }
};

export const offertaService = new OffertaService();

class CS extends BaseHttpService {

  getTableName() {
    return 'offers';
  }
}

export const offersService = new CS();