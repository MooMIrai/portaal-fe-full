import { Chat, ChatMessageSendEvent, Message } from '@progress/kendo-react-conversational-ui';
import AuthService from '../../services/AuthService';
import React from 'react';

export default function AiChat(props:{

    messages:Message[],
    onMessageSend:(ev:ChatMessageSendEvent)=>void,
    className?:string
}){
    return <div>
            <Chat
                className={props.className}
                user={{
                    id:1,
                    avatarUrl:AuthService.getImage(),
                    name:AuthService.getUserName()
                }}
                messages={props.messages}
                onMessageSend={props.onMessageSend}
                placeholder={'Scrivi un messaggio...'}
                
            />

        </div>
}