import React, { useState } from "react";
import AiChat from 'common/AiChat';
import Button from 'common/Button';
import Typography from 'common/Typography';
import {xIcon} from 'common/icons';
import imgIdle from '../../icons/idle.png'
import imgThink from '../../icons/think.png'
import imgError from '../../icons/wrong.png'
import styles from "./style.module.scss";
import { chatService } from "../../services/chatService";

export function ChatButton(){
    const bot = {
        id: 0,
        avatarUrl:imgIdle,
        name:"Max AI"
    };
    
    const [isOpen,setIsOpen] = useState<boolean>(false);
    const [imgUrl,setImgUrl] = useState<string>(imgIdle);
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



    return <>
        <div className={styles.container}>
            <Button rounded="full"  type="button" themeColor="info" onClick={()=>setIsOpen(!isOpen)}>
                <svg width="40px" height="40px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M213.333333 554.666667m-85.333333 0a85.333333 85.333333 0 1 0 170.666667 0 85.333333 85.333333 0 1 0-170.666667 0Z" fill="#FFA726" /><path d="M810.666667 554.666667m-85.333334 0a85.333333 85.333333 0 1 0 170.666667 0 85.333333 85.333333 0 1 0-170.666667 0Z" fill="#FFA726" /><path d="M832 405.333333c0-270.933333-640-177.066667-640 0v213.333334c0 177.066667 142.933333 320 320 320s320-142.933333 320-320V405.333333z" fill="#FFB74D" /><path d="M512 64C311.466667 64 149.333333 226.133333 149.333333 426.666667v72.533333L192 533.333333v-64l448-209.066666 192 209.066666v64l42.666667-34.133333V426.666667c0-170.666667-121.6-362.666667-362.666667-362.666667z" fill="#FF5722" /><path d="M661.333333 554.666667m-42.666666 0a42.666667 42.666667 0 1 0 85.333333 0 42.666667 42.666667 0 1 0-85.333333 0Z" fill="#784719" /><path d="M362.666667 554.666667m-42.666667 0a42.666667 42.666667 0 1 0 85.333333 0 42.666667 42.666667 0 1 0-85.333333 0Z" fill="#784719" /><path d="M917.333333 512c-12.8 0-21.333333 8.533333-21.333333 21.333333v-149.333333c0-187.733333-153.6-341.333333-341.333333-341.333333h-149.333334c-12.8 0-21.333333 8.533333-21.333333 21.333333s8.533333 21.333333 21.333333 21.333333h149.333334c164.266667 0 298.666667 134.4 298.666666 298.666667v213.333333c0 12.8 8.533333 21.333333 21.333334 21.333334s21.333333-8.533333 21.333333-21.333334v42.666667c0 83.2-66.133333 149.333333-149.333333 149.333333H512c-12.8 0-21.333333 8.533333-21.333333 21.333334s8.533333 21.333333 21.333333 21.333333h234.666667c106.666667 0 192-85.333333 192-192v-106.666667c0-12.8-8.533333-21.333333-21.333334-21.333333z" fill="#757575" /><path d="M917.333333 469.333333h-21.333333c-23.466667 0-42.666667 19.2-42.666667 42.666667v85.333333c0 23.466667 19.2 42.666667 42.666667 42.666667h21.333333c23.466667 0 42.666667-19.2 42.666667-42.666667v-85.333333c0-23.466667-19.2-42.666667-42.666667-42.666667z" fill="#37474F" /><path d="M512 810.666667m-42.666667 0a42.666667 42.666667 0 1 0 85.333334 0 42.666667 42.666667 0 1 0-85.333334 0Z" fill="#37474F" /></svg>
            </Button>
            
        </div>
        {isOpen && <div className={styles.chatbotContainer}>
            <div className={styles.chatbotHeader}><Button fillMode="link" type="button" svgIcon={xIcon} onClick={()=>setIsOpen(!isOpen)}></Button></div>
            <div className={styles.avatarContainer}>
                <img src={imgUrl}/> 
            </div>
            <div className={styles.statusContainer}>
            {imgThink===imgUrl && <Typography.p>Sto pensando...</Typography.p>}
            {imgError===imgUrl && <Typography.p>Ops Qualcosa è andato storto</Typography.p>}
            {imgIdle===imgUrl && <Typography.p>Fai la tua domanda</Typography.p>}
            </div>
            <AiChat className={styles.chatbot}  messages={messages} onMessageSend={(e)=>{
                const messagesBackup=JSON.parse(JSON.stringify([...messages,e.message]));
                setMessages(messagesBackup);
                
                setImgUrl(imgThink);
                chatService.sendMessage(e.message.text).then((res)=>{
                    setImgUrl(imgIdle);
                    
                    const response= {
                        author:bot,
                        text:res.answer
                    };
                    setMessages([...messagesBackup,response]);
                }).catch(()=>{
                    setImgUrl(imgError);
                })
            }}/>
        </div>}
    </>
}