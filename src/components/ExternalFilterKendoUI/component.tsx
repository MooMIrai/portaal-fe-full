import * as React from 'react';
import { BooleanFilter, DateFilter, Filter, FilterChangeEvent, FilterOperator, NumericFilter, Operators, TextFilter } from '@progress/kendo-react-data-tools';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';


export interface FilterField {
    name: string; 
    label: string; 
    filter: "text" | "numeric" | "date" | "boolean";
    operators: "text" | "numeric" | "date" | "boolean";
  }

interface CustomFilterProps {
  filter: CompositeFilterDescriptor; 
  onFilterExternalChange: (event: FilterChangeEvent) => void;
  fields: FilterField[]; 
}

const CustomFilter: React.FC<CustomFilterProps> = ({ filter, onFilterExternalChange, fields }) => {
    const handleFilterChange = (event: FilterChangeEvent) => {
        if (onFilterExternalChange) {
          onFilterExternalChange(event); 
        }
      };
      const mappedFields = fields.map((field) => {
        let fieldFilterComponent: React.ComponentType<any>;
        let fieldOperators: FilterOperator[];
    
        switch (field.filter) {
          case "text":
            fieldFilterComponent = TextFilter;
            fieldOperators = Operators.text;
            break;
          case "numeric":
            fieldFilterComponent = NumericFilter;
            fieldOperators = Operators.numeric;
            break;
          case "date":
            fieldFilterComponent = DateFilter;
            fieldOperators = Operators.date;
            break;
          case "boolean":
            fieldFilterComponent = BooleanFilter;
            fieldOperators = Operators.boolean;
            break;
          default:
            throw new Error(`Unknown filter type: ${field.filter}`);
        }
    
        return {
          ...field,
          filter: fieldFilterComponent, 
          operators: fieldOperators,
        };
      });
    

  console.log("CustomFilter - fields:", fields);
  console.log("CustomFilter - filter value:", filter);
  console.log("CustomFilter - onFilterExternalChange:", onFilterExternalChange);
  return (
    <Filter
      value={filter}
      onChange={handleFilterChange}
      fields={mappedFields}
    />
  );
};

export default CustomFilter;

//TO DO DOPO AVER INTRODOTTO IL COMPONENTE KENDO ui FUNZIONANTE FARE ANCHE QUELLO CUSTOMN