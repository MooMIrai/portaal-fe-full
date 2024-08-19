import AutoComplete from 'common/AutoComplete';
import React, { useCallback, useEffect, useState } from 'react';
import { CrudGenericService } from '../../services/personaleServices';
import { useDebounce } from '@uidotdev/usehooks';

export type OfferTypeSelectorProps={
    onChange:(value:any)=>void;
    value:any
}


export default function(props:OfferTypeSelectorProps){

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
        /*CrudGenericService.searchCommerciale(filterP).then((res)=>{
            if(res){
                setData(res.map(d=>({
                    id:d.id,
                    name:d.Person.firstName + ' ' + d.Person.lastName
                })))
            }
        });*/
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