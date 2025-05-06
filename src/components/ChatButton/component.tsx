import React, { useState } from "react";
import AiChat from 'common/AiChat';
import Button from 'common/Button';
import Typography from 'common/Typography';
import {xIcon} from 'common/icons';
/* import imgIdle from '../../icons/idle.png'
import imgThink from '../../icons/think.png'
import imgError from '../../icons/wrong.png' */
import humi from '../../icons/humi.png'
import styles from "./style.module.scss";
import { chatService } from "../../services/chatService";

export function ChatButton(){
    const bot = {
        id: 0,
        //avatarUrl:humi,
        name:"Humi AI"
    };
    
    const [isOpen,setIsOpen] = useState<boolean>(false);
    //const [imgUrl,setImgUrl] = useState<string>(imgIdle);
    const [messages,setMessages] = useState<any[]>([
        {
            author: bot,
            text: `
👋 Benvenuto! Sono l'assistente virtuale aziendale.

Posso aiutarti con:
📄 Regolamenti aziendali su orari, ferie, permessi, malattia e sicurezza (D.Lgs. 81/2008)
🧑‍💼 Processi HR e follow-up nei primi 6 mesi dalla tua assunzione
📋 Procedure di gestione delle consulenze e assegnazione ai progetti
🔐 Norme su privacy, responsabilità contrattuali e comportamento in azienda
✅ Metodologie
 Agile-Scrum e pratiche di gestione progetti IT

Scrivimi pure la tua domanda, sono qui per aiutarti!
`
        }
    ]);

    const thinkingMessage = {
        author: bot,
        text: `Sto pensando...`
    }



    return <>
        <div className={styles.container}>
            
            <Button  rounded="full"  type="button" themeColor="primary" onClick={()=>setIsOpen(!isOpen)}>
                <img src={humi} />
            </Button>
            
        </div>
        {isOpen && <div className={styles.chatbotContainer}>
            <div className={styles.chatbotHeader}>
                <Typography.h5>Humi AI</Typography.h5>
                <Button fillMode="link" type="button" svgIcon={xIcon} onClick={()=>setIsOpen(!isOpen)}></Button></div>
            {/* <div className={styles.avatarContainer}>
                <img src={imgUrl}/> 
            </div> */}
            {/* <div className={styles.statusContainer}>
            {imgThink===imgUrl && <Typography.p>Sto pensando...</Typography.p>}
            {imgError===imgUrl && <Typography.p>Ops Qualcosa è andato storto</Typography.p>}
            {imgIdle===imgUrl && <Typography.p>Fai la tua domanda</Typography.p>}
            </div> */}
            <AiChat className={styles.chatbot}  messages={messages} onMessageSend={(e)=>{
                const messagesBackup=JSON.parse(JSON.stringify([...messages,e.message]));
                setMessages(messagesBackup);
                
                //setImgUrl(imgThink);
                setMessages([...messagesBackup,thinkingMessage]);
                chatService.sendMessage(e.message.text).then((res)=>{
                    //setImgUrl(imgIdle);
                    
                    const response= {
                        author:bot,
                        text:res.answer
                    };
                    setMessages([...messagesBackup,response]);
                }).catch(()=>{
                    //setImgUrl(imgError);
                })
            }}/>
        </div>}
    </>
}