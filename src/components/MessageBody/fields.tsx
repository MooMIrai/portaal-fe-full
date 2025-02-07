import React, { useEffect, useRef, useState } from "react";
import withField from "common/hoc/Field";
import HtmlEditor from 'common/HtmlEditor';
import Button from 'common/Button';
import {SelectInput} from 'common/Fields';
import { notificationServiceHttp } from "../../services/notificationService";

function MessageBodyField(props:any){

    const editorRef = useRef<any>(null);
    const [state, setState] = React.useState({
        value: undefined
    });
    const [templateList,setTemplateList ] = useState<any[]>([]);

    useEffect(()=>{
        notificationServiceHttp.getTemplate().then(res=>{
            setTemplateList(res.data);
        })
    },[])

    const handleChange = (event: any) => {
        setState({
            value: event.target.value
        });
        if(event.value && event.value.id!=0)
            editorRef.current?.setHtml(event.value.html_text);
    };

    return <HtmlEditor ref={editorRef}
    
    customToolbarActions={[
        (propss:any) => {
            const { view } = propss;
            //const nodeType = view && view.state.schema.nodes[settings.nodeType];
            //const canInsert = view && EditorUtils.canInsert(view.state, nodeType);
            return (
                <SelectInput
                    width={'300px'}
                    data={templateList}
                    textField="subject"
                    dataItemKey="id"
                    value={state.value}
                    onChange={handleChange }
                    defaultItem={{ subject: 'Seleziona un template...', id: 0 }}
                    
                    
                />
            );
        }
      ]}
    onChange={(e=>{
        props.onChange({value:e.html});
    })} />
}

export const MessageFormCustomFields = {
    "message_body":withField((props:any)=><MessageBodyField {...props} />)
}