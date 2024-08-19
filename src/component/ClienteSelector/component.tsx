import AutoComplete from 'common/AutoComplete';
import React, { useCallback, useEffect, useState } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import { customerService } from '../../services/clienteService';

export type ClienteSelectorProps={
    onChange:(value:any)=>void;
    value:any
}


export default function(props:ClienteSelectorProps){

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
        customerService.search(1,20,
            {"logic":"or","filters":[{"field":"name","operator":"contains","value":filterP}]
        }).then((res)=>{
            if(res ){
                setData(res.data)
            }
        });
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


    return <AutoComplete 
            data={data}
            value={value}
            filterable={true}
            onFilterChange={onFilterChange}
            textField="name"
            dataItemKey={'id'}
            onChange={onChange}
        />
        

}