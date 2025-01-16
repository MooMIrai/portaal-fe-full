import { Stepper } from "@progress/kendo-react-layout";
import React from "react";

export default function CustomStepper(props:any){


    return <Stepper items={props.items} value={props.value} onChange={props.onChange} orientation={props.orientation}></Stepper>

}