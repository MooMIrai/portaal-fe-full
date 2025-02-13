import { BaseAdapter } from 'common/gof/Adapter';
import { FormField, NotificationParameter, NotificationParameterType } from '../models/FormModel';


function mapReportParameterTypeToFieldType(type: NotificationParameterType,name:string): string{
    switch (type) {
      case 'STRING':
        return 'text';
      case 'NUMBER':
        return 'number';
      case 'DATE':
      case 'DATETIME':
        return 'date';
      case 'BOOLEAN':
        return 'checkbox';
      case 'STATIC_LIST':
      case 'DYNAMIC_LIST':
        return 'custom-autocomplete__'+type+'__'+name;
      case 'DECIMAL':
        return 'number';
      default:
        return 'text';
    }
};

class FormAdapter extends BaseAdapter<NotificationParameter,FormField>{



    adapt(param?: NotificationParameter): FormField | null {
        if(!param)
            return null;

        return {
            name: param.name,
            label: param.label,//.replace(/([A-Z])/g, ' $1').trim(), // Trasforma CamelCase in spazi
            type: mapReportParameterTypeToFieldType(param.type,param.name),
            required: param.mandatory,
            showLabel:param.type !="BOOLEAN",
            options: param.type === 'STATIC_LIST'?param.values:param.type === 'DYNAMIC_LIST'?JSON.parse(param.values):null,
            validator: (value: any) => {

              if (param.mandatory ) {
                if((param.type==='STATIC_LIST' || param.type==='DYNAMIC_LIST')){
                  if( !value || !value.id)
                    return `Il campo ${param.name} è obbligatorio`;
                }else if(param.type==='BOOLEAN'){
                  if(value===undefined) return `Il campo ${param.name} è obbligatorio`;
                }
                else if(param.type==='DATE' || param.type==='DATETIME'){
                  if(value===undefined || value===null) return `Il campo ${param.name} è obbligatorio`;
                }
                else if(!value || !value.length){
                  return `Il campo ${param.name} è obbligatorio`;
                }
              }
              
              if (value && param.validations) {
                if (param.validations.min !== undefined && value < param.validations.min) {
                  return `Il valore deve essere almeno ${param.validations.min}`;
                }
                if (param.validations.max !== undefined && value > param.validations.max) {
                  return `Il valore non può superare ${param.validations.max}`;
                }
                if (param.validations.minLength !== undefined && value  && value.length < param.validations.minLength) {
                  return `Il valore deve avere almeno ${param.validations.minLength} caratteri`;
                }
                if (param.validations.maxLength !== undefined && value  && value.length > param.validations.maxLength) {
                  return `Il valore non può superare ${param.validations.maxLength} caratteri`;
                }
                if (param.validations.regex && !new RegExp(param.validations.regex).test(value)) {
                  return `Il valore non rispetta il formato richiesto`;
                }
                if (param.validations.minDate && new Date(value) < new Date(param.validations.minDate)) {
                  return `La data deve essere successiva o uguale a ${new Date(param.validations.minDate).toLocaleDateString()}`;
                }
                if (param.validations.maxDate && new Date(value) > new Date(param.validations.maxDate)) {
                  return `La data deve essere precedente o uguale a ${new Date(param.validations.maxDate).toLocaleDateString()}`;
                }
              }
              return '';
            },
          };
    }

    reverseAdapt(param?: FormField): NotificationParameter | null {
        return null
    }


}

export const formAdapter = new FormAdapter();