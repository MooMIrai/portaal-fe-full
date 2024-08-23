import { Error, Label } from '@progress/kendo-react-labels';
import React, { useCallback, useEffect, useState } from 'react';
import Autocomplete from '../components/AutoComplete/component';
import { useDebounce } from '@uidotdev/usehooks'

const withAutocomplete = (fetchData:(filter:string)=>Promise<Array<{id:any,name:string}>>) => {
  const WithAutocomplete = (props:any) => {
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

    useEffect(()=>{
       if(props.value){
            setValue({
                id:props.value.id,
                name:props.value.name
            });
       }
    },[])


    return <Autocomplete 
            data={data}
            value={value}
            filterable={true}
            onFilterChange={onFilterChange}
            textField="name"
            dataItemKey={'id'}
            onChange={onChange}
        />
        
  };

  
  return WithAutocomplete;
};

export default withAutocomplete;