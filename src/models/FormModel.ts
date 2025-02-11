export type NotificationParameterType = 
  | 'STRING'
  | 'NUMBER'
  | 'DATE'
  | 'DATETIME'
  | 'BOOLEAN'
  | 'STATIC_LIST'
  | 'DYNAMIC_LIST'
  | 'DECIMAL';

  export interface NotificationParameter {
    id: string;
    NotificationId: string;
    label:string;
    name: string;
    type: NotificationParameterType;
    mandatory: boolean;
    values?: any; // Può essere migliorato con un tipo più specifico
    validations?: {
      min?: number;
      max?: number;
      minLength?: number;
      maxLength?: number;
      regex?: string;
      minDate?: string;
      maxDate?: string;
    };
    // Altri campi...
  }

export interface FormField {
    name: string;
    label: string;
    type: string;
    required: boolean;
    showLabel:boolean;
    options:any;
    validator?: (value: any) => string;
  }
  