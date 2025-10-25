import { useEffect, useState } from "react";
import { notificationService as notificationS } from "../services/notification";

export function useSocketConnected() {
  const [connected, setConnected] = useState(notificationS.client.connected);

  useEffect(() => {
    let isMounted = true; // Previene update di stato dopo l’unmount

    if (!notificationS.client.connected &&  !notificationS.isConnecting) {
      notificationS.tryConnect().then(() => {
        if (isMounted) {
          setConnected(true);
        }
      });
    }

    return () => {
      isMounted = false; // Evita aggiornamenti di stato dopo l'unmount
      //notificationS.client.disconnect(); // Opzionale: mantieni la connessione attiva
    };
  }, []);

  return { connected, notificationService: notificationS };
}
