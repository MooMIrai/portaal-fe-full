import React, { useState } from "react";
import HtmlEditor from 'common/HtmlEditor';
import Typography from 'common/Typography';
import InputText from 'common/InputText';

export function MessageBody(){

    const [title,setTitle] = useState<string>('');
    const [subTitle,setSubtitle] = useState<string>('');
    const [text,setText] = useState<string>('');

    return <div>
        <Typography.p>Titolo</Typography.p>
        <InputText value={title} onChange={(e)=>{
            setTitle(e.value)
        }}/>
        <Typography.p>Sottotitolo</Typography.p>
        <InputText value={subTitle} onChange={(e)=>{
            setSubtitle(e.value)
        }}/>
        <Typography.p>Inserisci il corpo del messaggio</Typography.p>
        <HtmlEditor value={text} onChange={(p)=>{
            setText(p.html);
        }} />
    </div>
}