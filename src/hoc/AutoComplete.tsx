import { Error, Label } from '@progress/kendo-react-labels';
import React, { useCallback, useEffect, useState } from 'react';
import Autocomplete from '../components/AutoComplete/component';
import { useDebounce } from '@uidotdev/usehooks'
import { ComboBoxProps } from '@progress/kendo-react-dropdowns';

type AutocompleteProps = {
    value: { id: any, name: string } | null;
    onChange: (event: any) => void;
    disabled?: boolean;

} & ComboBoxProps; 

const withAutocomplete = (fetchData:(filter:string)=>Promise<Array<{id:any,name:string}>>) => {
  const WithAutocomplete = (props:AutocompleteProps) => {
    const [data, setData] = useState<Array<any>>([]);
    const [value, setValue] = useState<any>();
    const [filter, setFilter] = React.useState("");
    const debouncedSearchTerm = useDebounce(filter, 300);
    

    const onChange = ( event: any)=>{
        const value = event.target.value;
        props.onChange(event);
        setValue(value);
    }

    const getData= (filterP:string)=>{
        fetchData(filterP).then(setData);
    }

    const onFilterChange = useCallback(
        (event: any) => {
          const filter = event.filter.value;
          setFilter(filter);
        },
    []);
      
    useEffect(()=>{
        getData(debouncedSearchTerm);
    },[debouncedSearchTerm]);
    useEffect(() => {
        if (props.value) {
            if (props.value.name === " ") {
                setValue(""); 
            } else {
                setValue({
                    id: props.value.id,
                    name: props.value.name
                });
            }
        } else {
            setValue(""); 
        }
    }, [props.value]);


    return <Autocomplete 
            data={data}
            value={value}
            filterable={true}
            onFilterChange={onFilterChange}
            textField="name"
            dataItemKey={'id'}
            onChange={onChange}
            disabled={props.disabled}
        />
        
  };

  
  return WithAutocomplete;
};

export default withAutocomplete;