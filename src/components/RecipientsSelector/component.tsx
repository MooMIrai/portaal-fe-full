import React, { useCallback, useEffect, useState } from 'react'
import MultiSelect from 'common/MultiSelect';
import Typography from 'common/Typography';
import { notificationServiceHttp } from '../../services/notificationService';
import AvatarIcon from 'common/AvatarIcon';

export function RecipientsSelector(props:{
    onChange:(values:any[])=>void,
    label:string,
    disabled?:boolean
}){

    const [data,setData] = useState<any[]>([]);
    const [value,setValue] = useState<any>();

    const search = useCallback((prop)=>{
        notificationServiceHttp.searchAccount(prop.filter.value).then(res=>{
            setData(res.map(p=>({...p,nominativo:p.firstName + ' ' + p.lastName})));
            
        })
    },[])

    useEffect(()=>{
        search({filter:{value:''}});
    },[])

    const itemRender = (li: React.ReactElement<HTMLLIElement>, itemProps: any) => {
       
        const itemChildren = (
            <div style={{ display: 'flex', justifyContent:'flex-start', gap:15, alignItems:'center', paddingTop:5,paddingBottom:5 }}>
                <AvatarIcon initials={
                    itemProps.dataItem.firstName[0].toUpperCase()
                    +itemProps.dataItem.lastName[0].toUpperCase()
                    } />
                    <div style={{display:'flex',flexDirection:'column', gap:0}}>
                        <Typography.h6>{itemProps.dataItem.nominativo}</Typography.h6>
                        <Typography.p>{itemProps.dataItem.email}</Typography.p>
                    </div>
            </div>
        );

        return React.cloneElement(li, li.props, itemChildren);
    };

    return <div>
            <Typography.p>{props.label}</Typography.p>
            <MultiSelect
                disabled={props.disabled}
                data={data}
                value={value}
                itemRender={itemRender}
                onChange={(u)=>{
                    setValue(u.value);
                    props.onChange(u.value);
                }}
                dataItemKey={'account_id'}
                textField={'nominativo'}
                filterable={true}
                onFilterChange={search}
                style={{ width: '100%' }}
            />
            
        </div>
}