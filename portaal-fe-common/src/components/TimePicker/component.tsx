import React from "react";
import { TimePicker } from "@progress/kendo-react-dateinputs";

export default function TimePickerCustom(props:{
    value:Date|null,
    onChange:(value:Date|null)=>void
}){

    return <TimePicker format="HH:mm"  adaptive={true} value={props.value} onChange={(event)=>{
        props.onChange(event.value);
    }} />

}