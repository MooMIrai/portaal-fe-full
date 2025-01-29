import { BaseAdapter } from 'common/gof/Adapter';
import { FormField, ReportParameter, ReportParameterType } from '../models/FormModel';


function mapReportParameterTypeToFieldType(type: ReportParameterType): string{
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
        return 'custom-autocomplete';
      case 'DECIMAL':
        return 'number';
      default:
        return 'text';
    }
};

class FormAdapter extends BaseAdapter<ReportParameter,FormField>{



    adapt(param?: ReportParameter): FormField | null {
        if(!param)
            return null;

        return {
            name: param.name,
            label: param.name,//.replace(/([A-Z])/g, ' $1').trim(), // Trasforma CamelCase in spazi
            type: mapReportParameterTypeToFieldType(param.type),
            required: param.mandatory,
            options: param.type === 'STATIC_LIST'?param.values:null,
            validator: (value: any) => {
              if (param.mandatory && !value || !value.length) {
                return `Il campo ${param.name} è obbligatorio`;
              }
              
              if (value && param.validations) {
                if (param.validations.min !== undefined && value.id < param.validations.min) {
                  return `Il valore deve essere almeno ${param.validations.min}`;
                }
                if (param.validations.max !== undefined && value.id > param.validations.max) {
                  return `Il valore non può superare ${param.validations.max}`;
                }
                if (param.validations.minLength !== undefined && value.id.length < param.validations.minLength) {
                  return `Il valore deve avere almeno ${param.validations.minLength} caratteri`;
                }
                if (param.validations.maxLength !== undefined && value.id.length > param.validations.maxLength) {
                  return `Il valore non può superare ${param.validations.maxLength} caratteri`;
                }
                if (param.validations.regex && !new RegExp(param.validations.regex).test(value.id)) {
                  return `Il valore non rispetta il formato richiesto`;
                }
                if (param.validations.minDate && new Date(value.id) < new Date(param.validations.minDate)) {
                  return `La data deve essere successiva a ${param.validations.minDate}`;
                }
                if (param.validations.maxDate && new Date(value.id) > new Date(param.validations.maxDate)) {
                  return `La data deve essere precedente a ${param.validations.maxDate}`;
                }
              }
              return '';
            },
          };
    }

    reverseAdapt(param?: FormField): ReportParameter | null {
        return null
    }


}

export const formAdapter = new FormAdapter();