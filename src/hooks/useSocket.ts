import {useEffect, useState} from 'react';
import { notificationService as notificationS } from "../services/notification";

export function useSocketConnected(){

    const [connected,setConnected] = useState<boolean>();
    const [notificationService, setnotificationService] = useState<typeof notificationService>()

    useEffect(()=>{
        notificationS.tryConnect().then(()=>{
            setConnected(true);
            setnotificationService(notificationS)
        });
        return () => {notificationS.client?.disconnect();}
    },[]);


    return {connected,notificationService}

}
