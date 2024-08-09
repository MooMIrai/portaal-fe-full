import { CustomerBEModel, CustomerModel } from "../component/ClienteCrud/model";


export function adaptToCustomerModel(customer: CustomerBEModel): CustomerModel {
    return {
      id:customer.id,
      customer_code: customer.customer_code, // Mappiamo 'customer_code' a 'code'
       name: customer.name,
      vatNumber: customer.vatNumber || customer.taxCode, // Mappiamo 'taxCode' a 'vatNumber' se 'vatNumber' è assente
      website: customer.web_site,
      email: customer.email,
      phone: customer.phoneNumber,
      fax: customer.fax,
      address: customer.address,
      zipCode: customer.zipCode,
      city: customer.city || 0, // Se 'city' è assente, utilizziamo un valore di default (esempio: 0)
      discountPerc: 0  // Non c'è un campo corrispondente per 'discountPerc' in 'Customer'
    };
  }
  
 export function convertToCustomerBE(customerModel: CustomerModel): CustomerBEModel {
    return {
      id:customerModel.id,
      customer_code: customerModel.customer_code, // Mappiamo 'code' a 'customer_code'
      name: customerModel.name,
      phoneNumber: customerModel.phone,
      web_site: customerModel.website,
      fax: customerModel.fax,
      email: customerModel.email,
      address: customerModel.address,
      zipCode: customerModel.zipCode,
      city: typeof customerModel.city === 'number' ? customerModel.city.toString() : customerModel.city, // Convertiamo 'city' a stringa se è un numero
      vatNumber: customerModel.vatNumber,
      taxCode: customerModel.vatNumber, // Mappiamo 'vatNumber' a 'taxCode'
      data: {} // Lasciamo 'data' vuoto, puoi adattarlo se necessario
    };
  }