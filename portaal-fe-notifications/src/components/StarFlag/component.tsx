import { PropsWithRef, useCallback, useEffect, useState } from "react";
import SvgIcon from 'common/SvgIcon';
import { starOutlineIcon, starIcon } from 'common/icons';
import React from "react";
import { notificationServiceHttp } from "../../services/notificationService";

export function StarFlag(props: PropsWithRef<{
    n: any,
    className?:string,
    type: "LIST" | "DETAIL"
}>) {

    const [isFlagged, setIsFlagged] = useState<boolean>(props.n.isFlagged);

    useEffect(()=>{
        setIsFlagged(props.n.isFlagged);
    },[props.n])

    const handleClick = useCallback((e)=>{
        e.preventDefault();
        e.stopPropagation();
        notificationServiceHttp.updateFlagStar(props.n.id,!isFlagged).then((e)=>{
            setIsFlagged(!isFlagged);
        })
    },[isFlagged])


    if (props.type === 'LIST') {
        return isFlagged?
            <SvgIcon onClick={handleClick} className={props.className} size="large" themeColor="warning" icon={ starIcon } />
            :<SvgIcon onClick={handleClick} className={props.className} size="large" themeColor="warning" icon={starOutlineIcon} />
    }

    if(props.type==='DETAIL'){
        {
            return isFlagged?
                <SvgIcon onClick={handleClick} className={props.className} size="xxlarge" themeColor="warning" icon={starIcon} />
                :<SvgIcon onClick={handleClick} className={props.className} size="xxlarge" themeColor="warning" icon={starOutlineIcon} />
        }
    }

}
    
