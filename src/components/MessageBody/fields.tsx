import React from "react";
import withField from "common/hoc/Field";
import HtmlEditor from 'common/HtmlEditor';


export const MessageFormCustomFields = {
    "message_body":withField((props:any)=>(<HtmlEditor  onChange={(e=>{
        props.onChange({value:e.html});
    })} />))
}